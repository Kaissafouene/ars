"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const outlook_service_1 = require("../integrations/outlook.service");
const axios_1 = require("axios");
const AI_MICROSERVICE_URL = process.env.AI_MICROSERVICE_URL || 'http://localhost:8001';
let AlertsService = class AlertsService {
    prisma;
    outlook;
    triggerAlert(arg0) {
        throw new Error('Method not implemented.');
    }
    constructor(prisma, outlook) {
        this.prisma = prisma;
        this.outlook = outlook;
    }
    async getSlaPredictionAI(items) {
        try {
            const response = await axios_1.default.post(`${AI_MICROSERVICE_URL}/sla_prediction`, items);
            return response.data;
        }
        catch (error) {
            throw new Error('AI SLA prediction failed: ' + error.message);
        }
    }
    checkAlertsRole(user) {
        return;
    }
    async getAlertsDashboard(query, user) {
        this.checkAlertsRole(user);
        const where = {};
        if (query.teamId)
            where.teamId = query.teamId;
        if (query.userId)
            where.clientId = query.userId;
        if (query.clientId)
            where.clientId = query.clientId;
        if (query.fromDate || query.toDate) {
            where.createdAt = {};
            if (query.fromDate)
                where.createdAt.gte = new Date(query.fromDate);
            if (query.toDate)
                where.createdAt.lte = new Date(query.toDate);
        }
        const bordereaux = await this.prisma.bordereau.findMany({
            where,
            include: { courriers: true, virement: true, contract: true, client: true },
            orderBy: { createdAt: 'desc' },
        });
        const now = new Date();
        const alerts = bordereaux.map(b => {
            const daysSinceReception = b.dateReception ? (now.getTime() - new Date(b.dateReception).getTime()) / (1000 * 60 * 60 * 24) : 0;
            let level = 'green';
            let reason = 'On time';
            let slaThreshold = 5;
            if (b.contract && typeof b.contract.delaiReglement === 'number')
                slaThreshold = b.contract.delaiReglement;
            else if (b.client && typeof b.client.reglementDelay === 'number')
                slaThreshold = b.client.reglementDelay;
            if (b.statut !== 'CLOTURE' && daysSinceReception > slaThreshold) {
                level = 'red';
                reason = 'SLA breach';
            }
            else if (b.statut !== 'CLOTURE' && daysSinceReception > slaThreshold - 2) {
                level = 'orange';
                reason = 'Risk of delay';
            }
            return {
                bordereau: b,
                alertLevel: level,
                reason,
                slaThreshold,
                daysSinceReception,
            };
        });
        await Promise.allSettled(alerts.map(async (alert) => {
            try {
                if (alert.alertLevel === 'red') {
                    await this.notifyRole('SUPERVISOR', alert);
                }
                else if (alert.alertLevel === 'orange') {
                    await this.notifyRole('TEAM_LEADER', alert);
                }
                else if (alert.alertLevel === 'green') {
                    await this.notifyRole('MANAGER', alert);
                }
            }
            catch (e) {
                console.error('Notification error:', e);
            }
        }));
        return alerts;
    }
    async getTeamOverloadAlerts(user) {
        this.checkAlertsRole(user);
        const teams = await this.prisma.user.findMany({ where: { role: 'CHEF_EQUIPE' } });
        const overloads = [];
        for (const team of teams) {
            const count = await this.prisma.bordereau.count({ where: { statut: { not: 'CLOTURE' }, teamId: team.id } });
            if (count > 50) {
                overloads.push({ team, count, alert: 'red', reason: 'Team overloaded' });
                await this.notifyRole('SUPERVISOR', { team, count, alert: 'red', reason: 'Team overloaded' });
            }
            else if (count > 30) {
                overloads.push({ team, count, alert: 'orange', reason: 'Team at risk' });
                await this.notifyRole('TEAM_LEADER', { team, count, alert: 'orange', reason: 'Team at risk' });
            }
        }
        return overloads;
    }
    async getReclamationAlerts(user) {
        this.checkAlertsRole(user);
        const reclamations = await this.prisma.courrier.findMany({ where: { type: 'RECLAMATION' }, orderBy: { createdAt: 'desc' } });
        for (const r of reclamations) {
            await this.notifyRole('SUPERVISOR', {
                reclamation: r,
                alert: 'red',
                reason: 'Reclamation logged',
                status: r.status,
            });
        }
        return reclamations.map(r => ({
            reclamation: r,
            alert: 'red',
            reason: 'Reclamation logged',
            status: r.status,
        }));
    }
    async getDelayPredictions(user) {
        this.checkAlertsRole(user);
        const data = await this.prisma.bordereau.groupBy({
            by: ['createdAt'],
            _count: { id: true },
            orderBy: { createdAt: 'asc' },
            where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
        });
        const xs = data.map((d, i) => i);
        const ys = data.map(d => d._count.id);
        const n = xs.length;
        const sumX = xs.reduce((a, b) => a + b, 0);
        const sumY = ys.reduce((a, b) => a + b, 0);
        const sumXY = xs.reduce((a, b, i) => a + b * ys[i], 0);
        const sumXX = xs.reduce((a, b) => a + b * b, 0);
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
        const intercept = (sumY - slope * sumX) / (n || 1);
        const nextWeekForecast = Array.from({ length: 7 }).map((_, i) => slope * (n + i) + intercept).reduce((a, b) => a + b, 0);
        let recommendation = 'All OK';
        if (nextWeekForecast > 100)
            recommendation = 'Increase staff or reallocate workload';
        return {
            slope,
            intercept,
            nextWeekForecast: Math.round(nextWeekForecast),
            recommendation,
        };
    }
    async notify(role, message, alert = {}) {
        const users = await this.prisma.user.findMany({ where: { role } });
        for (const user of users) {
            if (user.email) {
                try {
                    await this.outlook.sendMail(user.email, '[ALERT] Notification', message + '\n' + JSON.stringify(alert, null, 2));
                }
                catch (err) {
                    console.error(`[ALERT][EMAIL] Failed to send to ${user.email}:`, err);
                }
            }
        }
        await this.prisma.alertLog.create({
            data: {
                bordereauId: alert.bordereau?.id || alert.bordereauId,
                documentId: alert.documentId,
                userId: alert.userId,
                alertType: alert.type || 'GENERIC',
                alertLevel: alert.alertLevel || alert.level || 'info',
                message,
                notifiedRoles: [role],
            },
        });
        return { role, message, sent: true };
    }
    async notifyRole(role, alert) {
        let message = '';
        if (alert.reason) {
            message = `[${alert.alertLevel?.toUpperCase() || alert.alert?.toUpperCase() || 'ALERT'}] ${alert.reason}`;
        }
        else {
            message = '[ALERT] Please check dashboard for details.';
        }
        await this.notify(role, message, alert);
    }
    async getAlertHistory(query, user) {
        this.checkAlertsRole(user);
        const where = {};
        if (query.bordereauId)
            where.bordereauId = query.bordereauId;
        if (query.userId)
            where.userId = query.userId;
        if (query.alertLevel)
            where.alertLevel = query.alertLevel;
        if (query.fromDate || query.toDate) {
            where.createdAt = {};
            if (query.fromDate)
                where.createdAt.gte = new Date(query.fromDate);
            if (query.toDate)
                where.createdAt.lte = new Date(query.toDate);
        }
        return this.prisma.alertLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { bordereau: true, document: true, user: true },
        });
    }
    async resolveAlert(alertId, user) {
        this.checkAlertsRole(user);
        return this.prisma.alertLog.update({
            where: { id: alertId },
            data: { resolved: true, resolvedAt: new Date() },
        });
    }
    async getPriorityList(user) {
        this.checkAlertsRole(user);
        const alerts = await this.getAlertsDashboard({}, user);
        return alerts.filter(a => a.alertLevel !== 'green').sort((a, b) => (a.alertLevel === 'red' ? -1 : 1));
    }
    async getComparativeAnalytics(user) {
        this.checkAlertsRole(user);
        const data = await this.getDelayPredictions(user);
        const actual = data.nextWeekForecast;
        const planned = data.nextWeekForecast;
        return {
            planned,
            actual,
            gap: planned - actual,
        };
    }
};
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, outlook_service_1.OutlookService])
], AlertsService);
//# sourceMappingURL=alerts.service.js.map