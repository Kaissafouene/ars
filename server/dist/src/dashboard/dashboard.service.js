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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const traitement_service_1 = require("../traitement/traitement.service");
const bordereaux_service_1 = require("../bordereaux/bordereaux.service");
const reclamations_service_1 = require("../reclamations/reclamations.service");
const alerts_service_1 = require("../alerts/alerts.service");
const analytics_service_1 = require("../analytics/analytics.service");
const tuniclaim_service_1 = require("../integrations/tuniclaim.service");
let DashboardService = class DashboardService {
    traitement;
    bordereaux;
    reclamations;
    alerts;
    analytics;
    tuniclaim;
    constructor(traitement, bordereaux, reclamations, alerts, analytics, tuniclaim) {
        this.traitement = traitement;
        this.bordereaux = bordereaux;
        this.reclamations = reclamations;
        this.alerts = alerts;
        this.analytics = analytics;
        this.tuniclaim = tuniclaim;
    }
    async getKpis(user) {
        const bordereauKPIs = await this.bordereaux.getBordereauKPIs();
        const totalBordereaux = bordereauKPIs.length;
        const bsProcessed = bordereauKPIs.filter(b => b.statusColor === 'GREEN').length;
        const bsRejected = bordereauKPIs.filter(b => b.statusColor === 'RED').length;
        const slaBreaches = bsRejected;
        const overdueVirements = bordereauKPIs.filter(b => b.statut === 'EN_COURS').length;
        const pendingReclamations = await this.reclamations.analytics(user).then(a => a.open);
        return {
            totalBordereaux,
            bsProcessed,
            bsRejected,
            pendingReclamations,
            slaBreaches,
            overdueVirements,
        };
    }
    async getPerformance(user) {
        const perf = await this.analytics.getPerformance({}, user);
        return (perf.processedByUser || []).map((u) => ({
            user: u.clientId,
            bsProcessed: u._count.id,
            avgTime: Math.round(Math.random() * 30 + 10),
        }));
    }
    async getSlaStatus(user) {
        const perf = await this.analytics.getPerformance({}, user);
        return [
            { type: 'BS SLA Compliance', status: perf.slaCompliant > 90 ? 'green' : perf.slaCompliant > 70 ? 'orange' : 'red', value: perf.slaCompliant },
        ];
    }
    async getAlerts(user) {
        return this.alerts.getAlertsDashboard({}, user);
    }
    async getCharts(user) {
        const trend = await this.analytics.getTrends(user, 'day');
        return { trend };
    }
    async getOverview(query, user) {
        const period = query.period || 'day';
        const teamId = query.teamId;
        const status = query.status;
        const fromDate = query.fromDate;
        const toDate = query.toDate;
        const analyticsQuery = { ...query, period, teamId, status, fromDate, toDate };
        const [traitementKpi, bordereauKpi, reclamationKpi, aiReco, alerts, analytics, trends] = await Promise.all([
            this.traitement.kpi(user),
            this.bordereaux.getBordereauKPIs(),
            this.reclamations.analytics(user),
            this.traitement.aiRecommendations(user),
            this.alerts.getAlertsDashboard(analyticsQuery, user),
            this.analytics.getDailyKpis(analyticsQuery, user),
            this.analytics.getTrends(user, period),
        ]);
        return {
            traitementKpi,
            bordereauKpi,
            reclamationKpi,
            aiReco,
            alerts,
            analytics,
            trends,
            filters: { period, teamId, status, fromDate, toDate },
            lastUpdated: new Date().toISOString(),
        };
    }
    async getAlertsSummary(query, user) {
        const alerts = await this.alerts.getAlertsDashboard(query, user);
        const summary = alerts.reduce((acc, a) => {
            acc[a.alertLevel] = (acc[a.alertLevel] || 0) + 1;
            return acc;
        }, {});
        return { summary, total: alerts.length };
    }
    async getSyncStatus() {
        const lastLog = await this.tuniclaim.getLastSyncLog();
        return {
            lastSync: lastLog ? lastLog.date : null,
            imported: lastLog ? lastLog.imported : null,
            errors: lastLog ? lastLog.errors : null,
            details: lastLog ? lastLog.details : null,
        };
    }
    async getSyncLogs(limit = 20) {
        return this.tuniclaim.getSyncLogs(limit);
    }
    async syncAndSaveStatus() {
        const result = await this.tuniclaim.syncBs();
        return await this.getSyncStatus();
    }
    async exportKpis(query, user) {
        return this.analytics.exportAnalytics({ ...query, format: query.format || 'excel' }, user);
    }
    async getAdvancedKpis(query, user) {
        const { departmentId, managerId, teamId, fromDate, toDate } = query;
        const filters = {};
        if (departmentId)
            filters.departmentId = departmentId;
        if (managerId)
            filters.managerId = managerId;
        if (teamId)
            filters.teamId = teamId;
        if (fromDate || toDate)
            filters.date = {};
        if (fromDate)
            filters.date.gte = new Date(fromDate);
        if (toDate)
            filters.date.lte = new Date(toDate);
        const kpis = await this.analytics.getFilteredKpis(filters, user);
        const planned = await this.analytics.getPerformance(filters, user);
        const actual = await this.analytics.getPerformance(filters, user);
        const resourceEstimation = await this.analytics.estimateResources(filters, user);
        return {
            ...kpis,
            planned,
            actual,
            resourceEstimation,
        };
    }
    async getDepartments(user) {
        return [
            { id: 'bureau-ordre', name: "Bureau d’ordre", details: "Réception et enregistrement des dossiers" },
            { id: 'scan', name: "Service SCAN / Équipe Scan", details: "Numérisation et indexation des documents" },
            { id: 'sante', name: "Équipe Santé / Équipe Métier", details: "Traitement des bordereaux et bulletins de soins" },
            { id: 'chef-equipe', name: "Chef d’Équipe", details: "Supervision et répartition des tâches aux gestionnaires" },
            { id: 'gestionnaire', name: "Gestionnaire", details: "Traitement opérationnel des dossiers" },
            { id: 'production', name: "Équipe Production", details: "Partie de l’équipe Santé" },
            { id: 'tiers-payant', name: "Équipe Tiers Payant", details: "Traitement des dossiers spécifiques tiers payant" },
            { id: 'finance', name: "Service Financier / Finance", details: "Suivi et exécution des virements" },
            { id: 'client', name: "Service Client", details: "Gestion des réclamations et interaction client" },
            { id: 'super-admin', name: "Super Admin", details: "Supervision globale et vue sur tous les tableaux de bord" },
            { id: 'responsable', name: "Responsable de Département", details: "Responsable de son unité avec accès aux données de performance" },
            { id: 'charge-compte', name: "Chargé de Compte", details: "Liaison avec les clients pour les délais et contrats" }
        ];
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [traitement_service_1.TraitementService,
        bordereaux_service_1.BordereauxService,
        reclamations_service_1.ReclamationsService,
        alerts_service_1.AlertsService,
        analytics_service_1.AnalyticsService,
        tuniclaim_service_1.TuniclaimService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map