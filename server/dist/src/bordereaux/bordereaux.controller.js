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
exports.BordereauxController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const bordereaux_service_1 = require("./bordereaux.service");
const create_bordereau_dto_1 = require("./dto/create-bordereau.dto");
const update_bordereau_dto_1 = require("./dto/update-bordereau.dto");
const assign_bordereau_dto_1 = require("./dto/assign-bordereau.dto");
const bs_dto_1 = require("./dto/bs.dto");
const audit_log_service_1 = require("./audit-log.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const common_2 = require("@nestjs/common");
const update_bulletin_soin_dto_1 = require("../bulletin-soin/dto/update-bulletin-soin.dto");
let BordereauxController = class BordereauxController {
    bordereauxService;
    auditLogService;
    contractsService;
    constructor(bordereauxService, auditLogService) {
        this.bordereauxService = bordereauxService;
        this.auditLogService = auditLogService;
    }
    async create(createBordereauDto) {
        if (!createBordereauDto.reference || !createBordereauDto.dateReception || !createBordereauDto.clientId || typeof createBordereauDto.delaiReglement !== 'number' || typeof createBordereauDto.nombreBS !== 'number') {
            throw new Error('All required fields must be provided.');
        }
        const bordereau = await this.bordereauxService.create(createBordereauDto);
        return bordereau;
    }
    getAuditLog(id) {
        return this.auditLogService.getBordereauHistory(id);
    }
    updateThresholds(id, thresholds) {
        return this.contractsService.updateThresholds(id, thresholds);
    }
    exportCSV() {
        return this.bordereauxService.exportCSV();
    }
    exportExcel() {
        return this.bordereauxService.exportExcel();
    }
    exportPDF() {
        return this.bordereauxService.exportPDF();
    }
    getUnassignedBordereaux() {
        return this.bordereauxService.findUnassigned();
    }
    getTeamBordereaux(teamId) {
        return this.bordereauxService.findByTeam(teamId);
    }
    getUserBordereaux(userId) {
        return this.bordereauxService.findByUser(userId);
    }
    returnBordereau(id, reason) {
        return this.bordereauxService.returnBordereau(id, reason);
    }
    findAll() {
        return this.bordereauxService.findAll();
    }
    getApproachingDeadlines() {
        return this.bordereauxService.getApproachingDeadlines();
    }
    getOverdueBordereaux() {
        return this.bordereauxService.getOverdueBordereaux();
    }
    getBordereauKPIs() {
        return this.bordereauxService.getBordereauKPIs();
    }
    findOne(id) {
        return this.bordereauxService.findOne(id);
    }
    update(id, updateBordereauDto) {
        return this.bordereauxService.update(id, updateBordereauDto);
    }
    remove(id) {
        return this.bordereauxService.remove(id);
    }
    assignBordereau(assignDto) {
        return this.bordereauxService.assignBordereau(assignDto);
    }
    startScan(id) {
        return this.bordereauxService.startScan(id);
    }
    completeScan(id) {
        return this.bordereauxService.completeScan(id);
    }
    markAsProcessed(id) {
        return this.bordereauxService.markAsProcessed(id);
    }
    closeBordereau(id) {
        return this.bordereauxService.closeBordereau(id);
    }
    getBSList(id) {
        return this.bordereauxService.getBSList(id);
    }
    createBS(id, createBSDto) {
        return this.bordereauxService.createBS(id, createBSDto);
    }
    async updateBS(bsId, updateBSDto) {
        return this.bordereauxService.updateBS(bsId, updateBSDto);
    }
    getDocuments(id) {
        return this.bordereauxService.getDocuments(id);
    }
    uploadDocument(id, file, documentData) {
        const data = { ...documentData, file };
        return this.bordereauxService.uploadDocument(id, data);
    }
    updateBordereauStatus(id) {
        return this.bordereauxService.updateBordereauStatus(id);
    }
    getVirement(id) {
        return this.bordereauxService.getVirement(id);
    }
    getAlerts(id) {
        return this.bordereauxService.getAlerts(id);
    }
    forecastBordereaux(days) {
        return this.bordereauxService.forecastBordereaux(days ? Number(days) : 7);
    }
    estimateStaffing(days, avg) {
        return this.bordereauxService.estimateStaffing(days ? Number(days) : 7, avg ? Number(avg) : 5);
    }
    async seedTestData() {
        return this.bordereauxService.seedTestData();
    }
    async seedComplaints() {
        return this.bordereauxService.seedComplaints();
    }
    analyzeComplaintsAI() {
        return this.bordereauxService.analyzeComplaintsAI();
    }
    getAIRecommendations() {
        return this.bordereauxService.getAIRecommendations();
    }
    analyzeReclamationsAI() {
        return this.bordereauxService.analyzeReclamationsAI();
    }
    getReclamationSuggestions(id) {
        return this.bordereauxService.getReclamationSuggestions(id);
    }
    getTeamRecommendations() {
        return this.bordereauxService.getTeamRecommendations();
    }
    async getPredictResourcesAI(payload) {
        return this.bordereauxService.getPredictResourcesAI(payload);
    }
    searchBordereauxAndDocuments(query) {
        return this.bordereauxService.searchBordereauxAndDocuments(query);
    }
};
exports.BordereauxController = BordereauxController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bordereau_dto_1.CreateBordereauDto]),
    __metadata("design:returntype", Promise)
], BordereauxController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id/audit-log'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "getAuditLog", null);
__decorate([
    (0, common_1.Patch)(':id/thresholds'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "updateThresholds", null);
__decorate([
    (0, common_1.Get)('export/csv'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "exportCSV", null);
__decorate([
    (0, common_1.Get)('export/excel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "exportExcel", null);
__decorate([
    (0, common_1.Get)('export/pdf'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "exportPDF", null);
__decorate([
    (0, common_1.Get)('inbox/unassigned'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "getUnassignedBordereaux", null);
__decorate([
    (0, common_1.Get)('inbox/team/:teamId'),
    __param(0, (0, common_1.Param)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "getTeamBordereaux", null);
__decorate([
    (0, common_1.Get)('inbox/user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "getUserBordereaux", null);
__decorate([
    (0, common_1.Post)(':id/return'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "returnBordereau", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BordereauxController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('approaching-deadlines'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BordereauxController.prototype, "getApproachingDeadlines", null);
__decorate([
    (0, common_1.Get)('overdue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BordereauxController.prototype, "getOverdueBordereaux", null);
__decorate([
    (0, common_1.Get)('kpis'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BordereauxController.prototype, "getBordereauKPIs", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BordereauxController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_bordereau_dto_1.UpdateBordereauDto]),
    __metadata("design:returntype", Promise)
], BordereauxController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BordereauxController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('assign'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_bordereau_dto_1.AssignBordereauDto]),
    __metadata("design:returntype", Promise)
], BordereauxController.prototype, "assignBordereau", null);
__decorate([
    (0, common_1.Post)(':id/start-scan'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BordereauxController.prototype, "startScan", null);
__decorate([
    (0, common_1.Post)(':id/complete-scan'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BordereauxController.prototype, "completeScan", null);
__decorate([
    (0, common_1.Post)(':id/mark-processed'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BordereauxController.prototype, "markAsProcessed", null);
__decorate([
    (0, common_1.Post)(':id/close'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BordereauxController.prototype, "closeBordereau", null);
__decorate([
    (0, common_1.Get)(':id/bs'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "getBSList", null);
__decorate([
    (0, common_1.Post)(':id/bs'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bs_dto_1.CreateBSDto]),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "createBS", null);
__decorate([
    (0, common_1.Patch)('bs/:bsId'),
    __param(0, (0, common_1.Param)('bsId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_bulletin_soin_dto_1.UpdateBulletinSoinDto]),
    __metadata("design:returntype", Promise)
], BordereauxController.prototype, "updateBS", null);
__decorate([
    (0, common_1.Get)(':id/documents'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "getDocuments", null);
__decorate([
    (0, common_1.Post)(':id/documents'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Patch)(':id/update-status'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "updateBordereauStatus", null);
__decorate([
    (0, common_1.Get)(':id/virement'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "getVirement", null);
__decorate([
    (0, common_1.Get)(':id/alerts'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "getAlerts", null);
__decorate([
    (0, common_1.Get)('forecast/bordereaux'),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "forecastBordereaux", null);
__decorate([
    (0, common_1.Get)('forecast/staffing'),
    __param(0, (0, common_1.Query)('days')),
    __param(1, (0, common_1.Query)('avgPerStaffPerDay')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "estimateStaffing", null);
__decorate([
    (0, common_1.Post)('seed-test-data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BordereauxController.prototype, "seedTestData", null);
__decorate([
    (0, common_1.Post)('seed-complaints'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BordereauxController.prototype, "seedComplaints", null);
__decorate([
    (0, common_1.Get)('ai/complaints'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "analyzeComplaintsAI", null);
__decorate([
    (0, common_1.Get)('ai/recommendations'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "getAIRecommendations", null);
__decorate([
    (0, common_1.Get)('ai/reclamations/analyze'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "analyzeReclamationsAI", null);
__decorate([
    (0, common_1.Get)('ai/reclamations/suggestions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "getReclamationSuggestions", null);
__decorate([
    (0, common_1.Get)('ai/teams/recommendations'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "getTeamRecommendations", null);
__decorate([
    (0, common_1.Post)('ai/predict-resources'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BordereauxController.prototype, "getPredictResourcesAI", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BordereauxController.prototype, "searchBordereauxAndDocuments", null);
exports.BordereauxController = BordereauxController = __decorate([
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('bordereaux'),
    __metadata("design:paramtypes", [bordereaux_service_1.BordereauxService,
        audit_log_service_1.AuditLogService])
], BordereauxController);
//# sourceMappingURL=bordereaux.controller.js.map