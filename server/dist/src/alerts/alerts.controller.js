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
exports.AlertsController = void 0;
const common_1 = require("@nestjs/common");
const alerts_service_1 = require("./alerts.service");
const alerts_query_dto_1 = require("./dto/alerts-query.dto");
const common_2 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
function getUserFromRequest(req) {
    return req.user || { id: 'demo', role: 'SUPER_ADMIN' };
}
let AlertsController = class AlertsController {
    alertsService;
    constructor(alertsService) {
        this.alertsService = alertsService;
    }
    async getAlertsDashboard(query, req) {
        const user = getUserFromRequest(req);
        if (query.fromDate && isNaN(Date.parse(query.fromDate)))
            throw new Error('Invalid fromDate');
        if (query.toDate && isNaN(Date.parse(query.toDate)))
            throw new Error('Invalid toDate');
        return this.alertsService.getAlertsDashboard(query, user);
    }
    async getTeamOverloadAlerts(req) {
        const user = getUserFromRequest(req);
        return this.alertsService.getTeamOverloadAlerts(user);
    }
    async getReclamationAlerts(req) {
        const user = getUserFromRequest(req);
        return this.alertsService.getReclamationAlerts(user);
    }
    async getDelayPredictions(req) {
        const user = getUserFromRequest(req);
        return this.alertsService.getDelayPredictions(user);
    }
    async getPriorityList(req) {
        const user = getUserFromRequest(req);
        return this.alertsService.getPriorityList(user);
    }
    async getComparativeAnalytics(req) {
        const user = getUserFromRequest(req);
        return this.alertsService.getComparativeAnalytics(user);
    }
    async getAlertHistory(query, req) {
        const user = getUserFromRequest(req);
        return this.alertsService.getAlertHistory(query, user);
    }
    async resolveAlert(alertId, req) {
        const user = getUserFromRequest(req);
        return this.alertsService.resolveAlert(alertId, user);
    }
    async getSlaPredictionAI(items) {
        let parsedItems = [];
        try {
            parsedItems = JSON.parse(items);
        }
        catch {
            throw new Error('Invalid items format. Must be JSON array.');
        }
        return this.alertsService.getSlaPredictionAI(parsedItems);
    }
};
exports.AlertsController = AlertsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [alerts_query_dto_1.AlertsQueryDto, Object]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "getAlertsDashboard", null);
__decorate([
    (0, common_1.Get)('team-overload'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "getTeamOverloadAlerts", null);
__decorate([
    (0, common_1.Get)('reclamations'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "getReclamationAlerts", null);
__decorate([
    (0, common_1.Get)('delay-predictions'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "getDelayPredictions", null);
__decorate([
    (0, common_1.Get)('priority-list'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "getPriorityList", null);
__decorate([
    (0, common_1.Get)('comparative-analytics'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "getComparativeAnalytics", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "getAlertHistory", null);
__decorate([
    (0, common_1.Get)('resolve'),
    __param(0, (0, common_1.Query)('alertId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "resolveAlert", null);
__decorate([
    (0, common_1.Get)('sla-prediction'),
    __param(0, (0, common_1.Query)('items')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "getSlaPredictionAI", null);
exports.AlertsController = AlertsController = __decorate([
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('alerts'),
    __metadata("design:paramtypes", [alerts_service_1.AlertsService])
], AlertsController);
//# sourceMappingURL=alerts.controller.js.map