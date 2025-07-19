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
exports.ReclamationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notification_service_1 = require("./notification.service");
const axios_1 = require("axios");
const AI_MICROSERVICE_URL = process.env.AI_MICROSERVICE_URL || 'http://localhost:8001';
let ReclamationsService = class ReclamationsService {
    prisma;
    notificationService;
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async bulkUpdate(ids, data, user) {
        this.checkRole(user, 'update');
        if (!Array.isArray(ids) || ids.length === 0)
            throw new Error('No IDs provided');
        const updates = [];
        for (const id of ids) {
            const old = await this.prisma.reclamation.findUnique({ where: { id } });
            if (!old)
                continue;
            const updated = await this.prisma.reclamation.update({ where: { id }, data });
            await this.prisma.reclamationHistory.create({
                data: {
                    reclamationId: id,
                    userId: user.id,
                    action: 'BULK_UPDATE',
                    fromStatus: old.status,
                    toStatus: data.status || old.status,
                    description: data.description || old.description,
                },
            });
            updates.push(updated);
        }
        return { updated: updates.length };
    }
    async bulkAssign(ids, assignedToId, user) {
        this.checkRole(user, 'assign');
        if (!Array.isArray(ids) || ids.length === 0)
            throw new Error('No IDs provided');
        if (!assignedToId)
            throw new Error('No assignedToId provided');
        const updates = [];
        for (const id of ids) {
            const old = await this.prisma.reclamation.findUnique({ where: { id } });
            if (!old)
                continue;
            const updated = await this.prisma.reclamation.update({ where: { id }, data: { assignedToId } });
            await this.prisma.reclamationHistory.create({
                data: {
                    reclamationId: id,
                    userId: user.id,
                    action: 'BULK_ASSIGN',
                    fromStatus: old.status,
                    toStatus: old.status,
                    description: `Bulk assigned to ${assignedToId}`,
                },
            });
            updates.push(updated);
        }
        return { updated: updates.length };
    }
    async getSlaBreaches(user) {
        this.checkRole(user, 'view');
        const now = new Date();
        const reclamations = await this.prisma.reclamation.findMany({
            where: { status: { not: 'RESOLVED' } },
            include: { client: true, contract: true },
        });
        const breaches = reclamations.filter(r => {
            let slaDays = 7;
            if (r.contract && r.contract.delaiReclamation)
                slaDays = r.contract.delaiReclamation;
            else if (r.client && r.client.reclamationDelay)
                slaDays = r.client.reclamationDelay;
            const deadline = new Date(r.createdAt.getTime() + slaDays * 24 * 60 * 60 * 1000);
            return now > deadline;
        });
        return breaches;
    }
    async checkSla(user) {
        this.checkRole(user, 'view');
        const breaches = await this.getSlaBreaches(user);
        for (const r of breaches) {
            await this.sendNotification('SLA_BREACH', r);
        }
        return { checked: true, breaches: breaches.length };
    }
    async getGecDocument(id, user) {
        this.checkRole(user, 'view');
        const fs = require('fs');
        const path = `./gec-documents/${id}.pdf`;
        if (fs.existsSync(path)) {
            return { documentUrl: `/gec-documents/${id}.pdf` };
        }
        else {
            return { error: 'Document not found' };
        }
    }
    async aiPredict(text, user) {
        this.checkRole(user, 'view');
        if (text.toLowerCase().includes('retard'))
            return { prediction: 'delay' };
        if (text.toLowerCase().includes('paiement'))
            return { prediction: 'payment issue' };
        return { prediction: 'other' };
    }
    checkRole(user, action = 'view') {
        if (user.role === 'SUPER_ADMIN')
            return;
        if (user.role === 'CHEF_EQUIPE' && ['view', 'update', 'assign'].includes(action))
            return;
        if (user.role === 'GESTIONNAIRE' && ['view', 'update'].includes(action))
            return;
        if (user.role === 'CLIENT_SERVICE' && action === 'view')
            return;
        throw new common_1.ForbiddenException('Access denied');
    }
    async autoAssign(department) {
        const users = await this.prisma.user.findMany({
            where: {
                ...(department ? { department } : {}),
                active: true,
                role: { in: ['GESTIONNAIRE', 'CUSTOMER_SERVICE'] },
            },
            select: { id: true },
        });
        if (!users.length)
            return undefined;
        const loads = await Promise.all(users.map(async (u) => {
            const count = await this.prisma.reclamation.count({
                where: { assignedToId: u.id, status: { in: ['OPEN', 'IN_PROGRESS'] } },
            });
            return { id: u.id, count };
        }));
        loads.sort((a, b) => a.count - b.count);
        return loads[0].id;
    }
    async createReclamation(dto, user) {
        this.checkRole(user, 'create');
        let assignedToId = dto.assignedToId;
        if (!assignedToId) {
            assignedToId = await this.autoAssign(dto.department);
        }
        if (dto.clientId) {
            const client = await this.prisma.client.findUnique({ where: { id: dto.clientId } });
            if (!client)
                throw new Error('Linked client does not exist.');
        }
        if (dto.contractId) {
            const contract = await this.prisma.contract.findUnique({ where: { id: dto.contractId } });
            if (!contract)
                throw new Error('Linked contract does not exist.');
        }
        if (dto.bordereauId) {
            const bordereau = await this.prisma.bordereau.findUnique({ where: { id: dto.bordereauId } });
            if (!bordereau)
                throw new Error('Linked bordereau does not exist.');
        }
        const data = {
            description: dto.description,
            type: dto.type,
            severity: dto.severity,
            status: 'OPEN',
            department: dto.department,
            contractId: dto.contractId || undefined,
            processId: dto.processId || undefined,
            client: dto.clientId ? { connect: { id: dto.clientId } } : undefined,
            document: dto.documentId ? { connect: { id: dto.documentId } } : undefined,
            bordereau: dto.bordereauId ? { connect: { id: dto.bordereauId } } : undefined,
            assignedTo: assignedToId ? { connect: { id: assignedToId } } : undefined,
            createdBy: { connect: { id: user.id } },
            evidencePath: dto.evidencePath || undefined,
        };
        const reclamation = await this.prisma.reclamation.create({ data });
        await this.prisma.reclamationHistory.create({
            data: {
                reclamationId: reclamation.id,
                userId: user.id,
                action: 'CREATE',
                toStatus: 'OPEN',
                description: dto.description,
            },
        });
        if (dto.severity === 'critical') {
            await this.sendNotification('CRITICAL_RECLAMATION', reclamation);
        }
        return reclamation;
    }
    async updateReclamation(id, dto, user) {
        this.checkRole(user, 'update');
        const old = await this.prisma.reclamation.findUnique({ where: { id } });
        if (!old)
            throw new common_1.NotFoundException('Reclamation not found');
        const reclamation = await this.prisma.reclamation.update({
            where: { id },
            data: {
                ...dto,
                department: dto.department ?? old.department,
                contractId: dto.contractId ?? old.contractId,
                processId: dto.processId ?? old.processId,
                assignedToId: dto.assignedToId ?? old.assignedToId,
            },
        });
        await this.prisma.reclamationHistory.create({
            data: {
                reclamationId: id,
                userId: user.id,
                action: 'UPDATE',
                fromStatus: old.status,
                toStatus: dto.status || old.status,
                description: dto.description,
            },
        });
        if (dto.status === 'ESCALATED') {
            await this.sendNotification('ESCALATED_RECLAMATION', reclamation);
        }
        return reclamation;
    }
    async assignReclamation(id, assignedToId, user) {
        this.checkRole(user, 'assign');
        const reclamation = await this.prisma.reclamation.update({
            where: { id },
            data: { assignedToId },
        });
        await this.prisma.reclamationHistory.create({
            data: {
                reclamationId: id,
                userId: user.id,
                action: 'ASSIGN',
                description: `Assigned to ${assignedToId}`,
            },
        });
        return reclamation;
    }
    async escalateReclamation(id, user) {
        this.checkRole(user, 'escalate');
        const reclamation = await this.prisma.reclamation.update({
            where: { id },
            data: { status: 'ESCALATED' },
        });
        await this.prisma.reclamationHistory.create({
            data: {
                reclamationId: id,
                userId: user.id,
                action: 'ESCALATE',
                fromStatus: reclamation.status,
                toStatus: 'ESCALATED',
            },
        });
        await this.sendNotification('ESCALATED_RECLAMATION', reclamation);
        return reclamation;
    }
    async getReclamation(id, user) {
        this.checkRole(user, 'view');
        return this.prisma.reclamation.findUnique({
            where: { id },
            include: {
                client: true,
                document: true,
                bordereau: true,
                assignedTo: true,
                createdBy: true,
                contract: true,
                process: true,
                history: { include: { user: true } },
            },
        });
    }
    async searchReclamations(query, user) {
        this.checkRole(user, 'view');
        const where = {};
        if (query.clientId)
            where.clientId = query.clientId;
        if (query.status)
            where.status = query.status;
        if (query.severity)
            where.severity = query.severity;
        if (query.type)
            where.type = query.type;
        if (query.assignedToId)
            where.assignedToId = query.assignedToId;
        if (query.department)
            where.department = query.department;
        if (query.contractId)
            where.contractId = query.contractId;
        if (query.processId)
            where.processId = query.processId;
        const take = query.take || 20;
        const skip = query.skip || 0;
        const orderBy = query.orderBy
            ? { [query.orderBy]: 'desc' }
            : { createdAt: 'desc' };
        return this.prisma.reclamation.findMany({
            where,
            include: {
                client: true,
                document: true,
                bordereau: true,
                assignedTo: true,
                createdBy: true,
                contract: true,
                process: true,
            },
            orderBy,
            take,
            skip,
        });
    }
    async getReclamationHistory(id, user) {
        this.checkRole(user, 'view');
        return this.prisma.reclamationHistory.findMany({
            where: { reclamationId: id },
            orderBy: { createdAt: 'asc' },
            include: { user: true },
        });
    }
    async getCorrelationAI(payload) {
        try {
            const response = await axios_1.default.post(`${AI_MICROSERVICE_URL}/correlation`, payload);
            return response.data;
        }
        catch (error) {
            throw new Error('AI correlation failed: ' + error.message);
        }
    }
    async aiAnalysis(user) {
        this.checkRole(user, 'view');
        const byType = await this.prisma.reclamation.groupBy({ by: ['type'], _count: { id: true } });
        const byClient = await this.prisma.reclamation.groupBy({ by: ['clientId'], _count: { id: true } });
        const bySeverity = await this.prisma.reclamation.groupBy({ by: ['severity'], _count: { id: true } });
        const byDepartment = await this.prisma.reclamation.groupBy({ by: ['department'], _count: { id: true } });
        const byContract = await this.prisma.reclamation.groupBy({ by: ['contractId'], _count: { id: true } });
        const byProcess = await this.prisma.reclamation.groupBy({ by: ['processId'], _count: { id: true } });
        const all = await this.prisma.reclamation.findMany({ select: { description: true } });
        const keywordMap = {};
        all.forEach(r => {
            const words = r.description.toLowerCase().split(/\W+/).filter(w => w.length > 3);
            words.forEach(w => { keywordMap[w] = (keywordMap[w] || 0) + 1; });
        });
        const frequentKeywords = Object.entries(keywordMap).filter(([_, c]) => c > 2).map(([k]) => k);
        const rootCause = frequentKeywords.length ? `Frequent keywords: ${frequentKeywords.join(', ')}` : 'No dominant root cause';
        return { byType, byClient, bySeverity, byDepartment, byContract, byProcess, rootCause };
    }
    async analytics(user) {
        this.checkRole(user, 'view');
        const total = await this.prisma.reclamation.count();
        const open = await this.prisma.reclamation.count({ where: { status: 'OPEN' } });
        const resolved = await this.prisma.reclamation.count({ where: { status: 'RESOLVED' } });
        const byType = await this.prisma.reclamation.groupBy({ by: ['type'], _count: { id: true } });
        const bySeverity = await this.prisma.reclamation.groupBy({ by: ['severity'], _count: { id: true } });
        const byDepartment = await this.prisma.reclamation.groupBy({ by: ['department'], _count: { id: true } });
        const histories = await this.prisma.reclamationHistory.findMany({
            where: { toStatus: 'RESOLVED' },
            include: { reclamation: true },
        });
        const times = histories.map(h => {
            const created = h.reclamation.createdAt.getTime();
            const resolved = h.createdAt.getTime();
            return (resolved - created) / 1000;
        });
        const avgResolution = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
        const minResolution = times.length ? Math.min(...times) : 0;
        const maxResolution = times.length ? Math.max(...times) : 0;
        const byUser = await this.prisma.reclamation.groupBy({ by: ['assignedToId'], _count: { id: true } });
        const byManager = await this.prisma.reclamation.groupBy({ by: ['createdById'], _count: { id: true } });
        return { total, open, resolved, byType, bySeverity, byDepartment, avgResolution, minResolution, maxResolution, byUser, byManager };
    }
    async trend(user) {
        this.checkRole(user, 'view');
        const data = await this.prisma.reclamation.groupBy({
            by: ['createdAt'],
            _count: { id: true },
            orderBy: { createdAt: 'asc' },
        });
        return data.map(d => ({ date: d.createdAt, count: d._count.id }));
    }
    async convertToTask(id, user) {
        this.checkRole(user, 'update');
        await this.generateGecDocument(id, user);
        return { taskCreated: true, reclamationId: id };
    }
    async autoReplySuggestion(id, user) {
        this.checkRole(user, 'view');
        const rec = await this.prisma.reclamation.findUnique({ where: { id } });
        if (!rec)
            return { suggestion: null };
        const desc = rec.description.toLowerCase();
        if (desc.includes('retard') || desc.includes('delay'))
            return { suggestion: 'Nous nous excusons pour le retard. Votre dossier est en cours de traitement.' };
        if (desc.includes('paiement') || desc.includes('payment'))
            return { suggestion: 'Nous analysons votre problème de paiement et reviendrons vers vous rapidement.' };
        if (desc.includes('erreur') || desc.includes('error'))
            return { suggestion: 'Nous avons bien noté l’erreur signalée et la corrigeons dans les plus brefs délais.' };
        return { suggestion: 'Merci pour votre retour. Nous traitons votre réclamation.' };
    }
    async sendNotification(type, reclamation) {
        return true;
    }
    async generateGecDocument(reclamationId, user) {
        return true;
    }
};
exports.ReclamationsService = ReclamationsService;
exports.ReclamationsService = ReclamationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], ReclamationsService);
//# sourceMappingURL=reclamations.service.js.map