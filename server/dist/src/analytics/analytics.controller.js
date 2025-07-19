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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const analytics_service_1 = require("./analytics.service");
const analytics_kpi_dto_1 = require("./dto/analytics-kpi.dto");
const analytics_performance_dto_1 = require("./dto/analytics-performance.dto");
const analytics_export_dto_1 = require("./dto/analytics-export.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const common_2 = require("@nestjs/common");
const common_3 = require("@nestjs/common");
function getUserFromRequest(req) {
    return req.user || { id: 'demo', role: 'SUPER_ADMIN' };
}
let AnalyticsController = class AnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getSlaComplianceByUser(query, req) {
        const user = getUserFromRequest(req);
        return this.analyticsService.getSlaComplianceByUser(user, query);
    }
    async getReclamationPerformance(query, req) {
        const user = getUserFromRequest(req);
        return this.analyticsService.getReclamationPerformance(user, query);
    }
    async getClientDashboard(query, req) {
        const user = getUserFromRequest(req);
        return this.analyticsService.getClientDashboard(user, query);
    }
    async getUserDailyTargetAnalysis(query, req) {
        const user = getUserFromRequest(req);
        return this.analyticsService.getUserDailyTargetAnalysis(user, query);
    }
    async getPriorityScoring(query, req) {
        const user = getUserFromRequest(req);
        return this.analyticsService.getPriorityScoring(user, query);
    }
    async getComparativeAnalysis(query, req) {
        const user = getUserFromRequest(req);
        const { period1, period2 } = query;
        if (!period1 || !period2 || !period1.fromDate || !period1.toDate || !period2.fromDate || !period2.toDate) {
            throw new (await Promise.resolve().then(() => require('@nestjs/common'))).BadRequestException('All period date ranges must be provided');
        }
        if (isNaN(Date.parse(period1.fromDate)) ||
            isNaN(Date.parse(period1.toDate)) ||
            isNaN(Date.parse(period2.fromDate)) ||
            isNaN(Date.parse(period2.toDate))) {
            throw new (await Promise.resolve().then(() => require('@nestjs/common'))).BadRequestException('All period dates must be valid ISO date strings');
        }
        return this.analyticsService.getComparativeAnalysis(user, query);
    }
    async getSlaTrend(query, req) {
        const user = getUserFromRequest(req);
        return this.analyticsService.getSlaTrend(user, query);
    }
    async getAlertEscalationFlag(req) {
        const user = getUserFromRequest(req);
        return this.analyticsService.getAlertEscalationFlag(user);
    }
    async getEnhancedRecommendations(req) {
        const user = getUserFromRequest(req);
        return this.analyticsService.getEnhancedRecommendations(user);
    }
    async getCourrierVolume(req) {
        const user = getUserFromRequest(req);
        return this.analyticsService.getCourrierVolume(user);
    }
    async getCourrierSlaBreaches(req) {
        const user = getUserFromRequest(req);
        return this.analyticsService.getCourrierSlaBreaches(user);
    }
    async getCourrierRecurrence(req) {
        const user = getUserFromRequest(req);
        return this.analyticsService.getCourrierRecurrence(user);
    }
    async getCourrierEscalations(req) {
        const user = getUserFromRequest(req);
        return this.analyticsService.getCourrierEscalations(user);
    }
    async getDailyKpis(query, req) {
        const user = getUserFromRequest(req);
        if (query.fromDate && isNaN(Date.parse(query.fromDate)))
            throw new Error('Invalid fromDate');
        if (query.toDate && isNaN(Date.parse(query.toDate)))
            throw new Error('Invalid toDate');
        return this.analyticsService.getDailyKpis(query, user);
    }
    async getPerformanceByUser(query, req) {
        const user = getUserFromRequest(req);
        return this.analyticsService.getPerformance(query, user);
    }
    async getAlerts(req) {
        const user = getUserFromRequest(req);
        return this.analyticsService.getAlerts(user);
    }
    async getRecommendations(req) {
        const user = getUserFromRequest(req);
        return this.analyticsService.getRecommendations(user);
    }
    async getTrends(period, req) {
        const user = getUserFromRequest(req);
        return this.analyticsService.getTrends(user, period);
    }
    async getForecast(req) {
        const user = getUserFromRequest(req);
        return this.analyticsService.getForecast(user);
    }
    async getStaffing(req) {
        const user = getUserFromRequest(req);
        const rec = await this.analyticsService.getRecommendations(user);
        return { neededStaff: rec.neededStaff, recommendation: rec.recommendation };
    }
    async getThroughputGap(req) {
        const user = getUserFromRequest(req);
        return this.analyticsService.getThroughputGap(user);
    }
    async exportAnalytics(query, req) {
        const user = getUserFromRequest(req);
        return this.analyticsService.exportAnalytics(query, user);
    }
    async getTraceability(bordereauId, req) {
        const user = getUserFromRequest(req);
        return this.analyticsService.getTraceability(bordereauId, user);
    }
    async getPrioritiesAI(items) {
        return this.analyticsService.getPrioritiesAI(items);
    }
    async getReassignmentAI(payload) {
        return this.analyticsService.getReassignmentAI(payload);
    }
    async getPerformanceAI(payload) {
        return this.analyticsService.getPerformanceAI(payload);
    }
    async getComparePerformanceAI(payload) {
        const { BadRequestException, BadGatewayException } = await Promise.resolve().then(() => require('@nestjs/common'));
        if (!payload || !Array.isArray(payload.planned) || !Array.isArray(payload.actual) || payload.planned.length === 0 || payload.actual.length === 0) {
            throw new BadRequestException('Payload must include non-empty planned and actual arrays');
        }
        try {
            return await this.analyticsService.getComparePerformanceAI(payload);
        }
        catch (e) {
            throw new BadGatewayException('AI microservice error: ' + (e?.message || e));
        }
    }
    async getDiagnosticOptimisationAI(payload) {
        return this.analyticsService.getDiagnosticOptimisationAI(payload);
    }
    async getPredictResourcesAI(payload) {
        return this.analyticsService.getPredictResourcesAI(payload);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('sla-compliance-by-user'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getSlaComplianceByUser", null);
__decorate([
    (0, common_1.Get)('reclamation-performance'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getReclamationPerformance", null);
__decorate([
    (0, common_1.Get)('client-dashboard'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getClientDashboard", null);
__decorate([
    (0, common_1.Get)('user-daily-target'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getUserDailyTargetAnalysis", null);
__decorate([
    (0, common_1.Get)('priority-scoring'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getPriorityScoring", null);
__decorate([
    (0, common_1.Get)('comparative-analysis'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getComparativeAnalysis", null);
__decorate([
    (0, common_1.Get)('sla-trend'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getSlaTrend", null);
__decorate([
    (0, common_1.Get)('alert-escalation-flag'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getAlertEscalationFlag", null);
__decorate([
    (0, common_1.Get)('recommendations/enhanced'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getEnhancedRecommendations", null);
__decorate([
    (0, common_1.Get)('courriers/volume'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCourrierVolume", null);
__decorate([
    (0, common_1.Get)('courriers/sla-breaches'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCourrierSlaBreaches", null);
__decorate([
    (0, common_1.Get)('courriers/recurrence'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCourrierRecurrence", null);
__decorate([
    (0, common_1.Get)('courriers/escalations'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCourrierEscalations", null);
__decorate([
    (0, common_1.Get)('kpis/daily'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_kpi_dto_1.AnalyticsKpiDto, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDailyKpis", null);
__decorate([
    (0, common_1.Get)('performance/by-user'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_performance_dto_1.AnalyticsPerformanceDto, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getPerformanceByUser", null);
__decorate([
    (0, common_1.Get)('alerts'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getAlerts", null);
__decorate([
    (0, common_1.Get)('recommendations'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getRecommendations", null);
__decorate([
    (0, common_1.Get)('trends'),
    __param(0, (0, common_1.Query)('period')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTrends", null);
__decorate([
    (0, common_1.Get)('forecast'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getForecast", null);
__decorate([
    (0, common_1.Get)('staffing'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getStaffing", null);
__decorate([
    (0, common_1.Get)('throughput-gap'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getThroughputGap", null);
__decorate([
    (0, common_1.Get)('export'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_export_dto_1.AnalyticsExportDto, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "exportAnalytics", null);
__decorate([
    (0, common_1.Get)('traceability/:bordereauId'),
    __param(0, (0, common_1.Param)('bordereauId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTraceability", null);
__decorate([
    (0, common_3.Post)('ai/priorities'),
    __param(0, (0, common_3.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getPrioritiesAI", null);
__decorate([
    (0, common_3.Post)('ai/reassignment'),
    __param(0, (0, common_3.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getReassignmentAI", null);
__decorate([
    (0, common_3.Post)('ai/performance'),
    __param(0, (0, common_3.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getPerformanceAI", null);
__decorate([
    (0, common_3.Post)('ai/compare-performance'),
    __param(0, (0, common_3.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getComparePerformanceAI", null);
__decorate([
    (0, common_3.Post)('ai/diagnostic-optimisation'),
    __param(0, (0, common_3.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDiagnosticOptimisationAI", null);
__decorate([
    (0, common_3.Post)('ai/predict-resources'),
    __param(0, (0, common_3.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getPredictResourcesAI", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map