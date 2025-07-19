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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const dashboard_service_1 = require("./dashboard.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let DashboardController = class DashboardController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getKpis(req) {
        return this.dashboardService.getKpis(req.user);
    }
    async getPerformance(req) {
        return this.dashboardService.getPerformance(req.user);
    }
    async getSlaStatus(req) {
        return this.dashboardService.getSlaStatus(req.user);
    }
    async getAlerts(req) {
        return this.dashboardService.getAlerts(req.user);
    }
    async getCharts(req) {
        return this.dashboardService.getCharts(req.user);
    }
    async getOverview(query, req) {
        return this.dashboardService.getOverview(query, req.user);
    }
    async getAlertsSummary(query, req) {
        return this.dashboardService.getAlertsSummary(query, req.user);
    }
    async getSyncStatus() {
        return this.dashboardService.getSyncStatus();
    }
    async getSyncLogs(limit = 20) {
        return this.dashboardService.getSyncLogs(limit);
    }
    async exportKpis(query, req, res) {
        const result = await this.dashboardService.exportKpis(query, req.user);
        if (result && result.filePath) {
            res.download(result.filePath);
        }
        else {
            res.json(result);
        }
    }
    async syncBs() {
        return this.dashboardService.syncAndSaveStatus();
    }
    async getAdvancedKpis(query, req) {
        return this.dashboardService.getAdvancedKpis(query, req.user);
    }
    async getDepartments(req) {
        if (this.dashboardService.getDepartments) {
            try {
                const departments = await this.dashboardService.getDepartments(req.user);
                if (departments && departments.length > 0)
                    return departments;
            }
            catch (e) {
                console.warn('Failed to fetch departments dynamically, using static fallback.', e);
            }
        }
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
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('kpis'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getKpis", null);
__decorate([
    (0, common_1.Get)('performance'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPerformance", null);
__decorate([
    (0, common_1.Get)('sla-status'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getSlaStatus", null);
__decorate([
    (0, common_1.Get)('alerts'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAlerts", null);
__decorate([
    (0, common_1.Get)('charts'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getCharts", null);
__decorate([
    (0, common_1.Get)('overview'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('alerts-summary'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAlertsSummary", null);
__decorate([
    (0, common_1.Get)('sync-status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getSyncStatus", null);
__decorate([
    (0, common_1.Get)('sync-logs'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getSyncLogs", null);
__decorate([
    (0, common_1.Get)('export'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "exportKpis", null);
__decorate([
    (0, common_1.Post)('sync'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "syncBs", null);
__decorate([
    (0, common_1.Get)('advanced-kpis'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAdvancedKpis", null);
__decorate([
    (0, common_1.Get)('departments'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDepartments", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map