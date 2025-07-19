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
exports.BulletinSoinController = void 0;
const common_1 = require("@nestjs/common");
const bulletin_soin_service_1 = require("./bulletin-soin.service");
const create_bulletin_soin_dto_1 = require("./dto/create-bulletin-soin.dto");
const update_bulletin_soin_dto_1 = require("./dto/update-bulletin-soin.dto");
const assign_bulletin_soin_dto_1 = require("./dto/assign-bulletin-soin.dto");
const expertise_info_dto_1 = require("./dto/expertise-info.dto");
const bs_log_dto_1 = require("./dto/bs-log.dto");
const bs_query_dto_1 = require("./dto/bs-query.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
let BulletinSoinController = class BulletinSoinController {
    bsService;
    constructor(bsService) {
        this.bsService = bsService;
    }
    notifySla() {
        return this.bsService.notifySlaAlerts();
    }
    notifyAssignment(body) {
        return this.bsService.notifyAssignment(body.bsId, body.userId);
    }
    notifyOverload(body) {
        return this.bsService.notifyOverload(body.gestionnaireId, body.riskLevel);
    }
    exportExcel() {
        return this.bsService.exportBsListToExcel();
    }
    analyseCharge() {
        return this.bsService.analyseCharge();
    }
    getBsWithReclamations() {
        return this.bsService.getBsWithReclamations();
    }
    calculateDueDate(dateCreation, contractId) {
        return this.bsService.calculateDueDate(new Date(dateCreation), contractId);
    }
    suggestRebalancing() {
        return this.bsService.suggestRebalancing();
    }
    estimateEscalationRisk(bsId) {
        return this.bsService.estimateEscalationRisk(bsId);
    }
    suggestAssignment() {
        return this.bsService.suggestAssignment();
    }
    suggestPriorities(gestionnaireId) {
        return this.bsService.suggestPriorities(gestionnaireId);
    }
    reconcilePayments() {
        return this.bsService.reconcilePaymentsWithAccounting();
    }
    getPaymentStatus(id) {
        return this.bsService.getPaymentStatus(id);
    }
    getBsForVirement(virementId) {
        return this.bsService.getBsForVirement(virementId);
    }
    markBsAsPaid(id) {
        return this.bsService.markBsAsPaid(id);
    }
    findAll(query, req) {
        return this.bsService.findAll(query, req.user);
    }
    getSlaAlerts() {
        return this.bsService.getSlaAlerts();
    }
    getPerformanceMetrics(start, end) {
        const startDate = start ? new Date(start) : new Date(new Date().setHours(0, 0, 0, 0));
        const endDate = end ? new Date(end) : new Date();
        return this.bsService.getPerformanceMetrics({ start: startDate, end: endDate });
    }
    findOne(id, req) {
        return this.bsService.findOne(id, req.user);
    }
    create(dto, req) {
        return this.bsService.create(dto);
    }
    update(id, dto, req) {
        return this.bsService.update(id, dto, req.user);
    }
    remove(id, req) {
        return this.bsService.remove(id, req.user);
    }
    assign(id, dto, req) {
        return this.bsService.assign(id, dto, req.user);
    }
    getOcr(id, req) {
        return this.bsService.getOcr(id, req.user);
    }
    getExpertise(id, req) {
        return this.bsService.getExpertise(id, req.user);
    }
    updateExpertise(id, dto, req) {
        return this.bsService.upsertExpertise(Number(id), dto, req.user, dto);
    }
    getLogs(id, req) {
        return this.bsService.getLogs(id, req.user);
    }
    addLog(id, dto, req) {
        return this.bsService.addLog(id, dto, req.user);
    }
};
exports.BulletinSoinController = BulletinSoinController;
__decorate([
    (0, common_1.Post)('notify/sla'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "notifySla", null);
__decorate([
    (0, common_1.Post)('notify/assignment'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "notifyAssignment", null);
__decorate([
    (0, common_1.Post)('notify/overload'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "notifyOverload", null);
__decorate([
    (0, common_1.Get)('export/excel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "exportExcel", null);
__decorate([
    (0, common_1.Get)('analyse-charge'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "analyseCharge", null);
__decorate([
    (0, common_1.Get)('with-reclamations'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "getBsWithReclamations", null);
__decorate([
    (0, common_1.Get)('calculate-due-date'),
    __param(0, (0, common_1.Query)('dateCreation')),
    __param(1, (0, common_1.Query)('contractId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "calculateDueDate", null);
__decorate([
    (0, common_1.Get)('suggest-rebalancing'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "suggestRebalancing", null);
__decorate([
    (0, common_1.Get)('ai/escalation-risk/:bsId'),
    __param(0, (0, common_1.Param)('bsId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "estimateEscalationRisk", null);
__decorate([
    (0, common_1.Get)('ai/suggest-assignment'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "suggestAssignment", null);
__decorate([
    (0, common_1.Get)('ai/suggest-priorities/:gestionnaireId'),
    __param(0, (0, common_1.Param)('gestionnaireId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "suggestPriorities", null);
__decorate([
    (0, common_1.Get)('reconcile-payments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BulletinSoinController.prototype, "reconcilePayments", null);
__decorate([
    (0, common_1.Get)(':id/payment-status'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "getPaymentStatus", null);
__decorate([
    (0, common_1.Get)('virement/:virementId'),
    __param(0, (0, common_1.Param)('virementId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "getBsForVirement", null);
__decorate([
    (0, common_1.Patch)(':id/mark-paid'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "markBsAsPaid", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bs_query_dto_1.BsQueryDto, Object]),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('sla/alerts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "getSlaAlerts", null);
__decorate([
    (0, common_1.Get)('kpi/performance'),
    __param(0, (0, common_1.Query)('start')),
    __param(1, (0, common_1.Query)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "getPerformanceMetrics", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bulletin_soin_dto_1.CreateBulletinSoinDto, Object]),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_bulletin_soin_dto_1.UpdateBulletinSoinDto, Object]),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/assign'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_bulletin_soin_dto_1.AssignBulletinSoinDto, Object]),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "assign", null);
__decorate([
    (0, common_1.Get)(':id/ocr'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "getOcr", null);
__decorate([
    (0, common_1.Get)(':id/expertise'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "getExpertise", null);
__decorate([
    (0, common_1.Post)(':id/expertise'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, expertise_info_dto_1.ExpertiseInfoDto, Object]),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "updateExpertise", null);
__decorate([
    (0, common_1.Get)(':id/logs'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Post)(':id/logs'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bs_log_dto_1.BsLogDto, Object]),
    __metadata("design:returntype", void 0)
], BulletinSoinController.prototype, "addLog", null);
exports.BulletinSoinController = BulletinSoinController = __decorate([
    (0, common_1.Controller)('bulletin-soin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [bulletin_soin_service_1.BulletinSoinService])
], BulletinSoinController);
//# sourceMappingURL=bulletin-soin.controller.js.map