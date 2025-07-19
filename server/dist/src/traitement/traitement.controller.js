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
exports.TraitementController = void 0;
const common_1 = require("@nestjs/common");
const traitement_service_1 = require("./traitement.service");
const assign_traitement_dto_1 = require("./dto/assign-traitement.dto");
const update_traitement_status_dto_1 = require("./dto/update-traitement-status.dto");
const search_traitement_dto_1 = require("./dto/search-traitement.dto");
function getUserFromRequest(req) {
    return req.user || { id: 'demo', role: 'SUPER_ADMIN' };
}
let TraitementController = class TraitementController {
    traitementService;
    constructor(traitementService) {
        this.traitementService = traitementService;
    }
    async globalInbox(query, req) {
        const user = getUserFromRequest(req);
        return this.traitementService.globalInbox(query, user);
    }
    async personalInbox(query, req) {
        const user = getUserFromRequest(req);
        return this.traitementService.personalInbox(user, query);
    }
    async assignTraitement(dto, req) {
        const user = getUserFromRequest(req);
        return this.traitementService.assignTraitement(dto, user);
    }
    async updateStatus(dto, req) {
        const user = getUserFromRequest(req);
        return this.traitementService.updateStatus(dto, user);
    }
    async kpi(req) {
        const user = getUserFromRequest(req);
        return this.traitementService.kpi(user);
    }
    async aiRecommendations(req) {
        const user = getUserFromRequest(req);
        return this.traitementService.aiRecommendations(user);
    }
    async exportStats(req) {
        const user = getUserFromRequest(req);
        return this.traitementService.exportStats(user);
    }
    async exportStatsPdf(req) {
        const user = getUserFromRequest(req);
        return this.traitementService.exportStatsPdf(user);
    }
    async history(bordereauId, req) {
        const user = getUserFromRequest(req);
        return this.traitementService.history(bordereauId, user);
    }
    async exportHistoryExcel(bordereauId, req, res) {
        const user = getUserFromRequest(req);
        const result = await this.traitementService.exportHistoryExcel(bordereauId, user);
        if (result && result.filePath) {
            res.download(result.filePath);
        }
        else {
            res.status(500).json({ error: 'Export failed' });
        }
    }
    async exportHistoryPdf(bordereauId, req, res) {
        const user = getUserFromRequest(req);
        const result = await this.traitementService.exportHistoryPdf(bordereauId, user);
        if (result && result.filePath) {
            res.download(result.filePath);
        }
        else {
            res.status(500).json({ error: 'Export failed' });
        }
    }
};
exports.TraitementController = TraitementController;
__decorate([
    (0, common_1.Get)('global-inbox'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_traitement_dto_1.SearchTraitementDto, Object]),
    __metadata("design:returntype", Promise)
], TraitementController.prototype, "globalInbox", null);
__decorate([
    (0, common_1.Get)('personal-inbox'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_traitement_dto_1.SearchTraitementDto, Object]),
    __metadata("design:returntype", Promise)
], TraitementController.prototype, "personalInbox", null);
__decorate([
    (0, common_1.Post)('assign'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_traitement_dto_1.AssignTraitementDto, Object]),
    __metadata("design:returntype", Promise)
], TraitementController.prototype, "assignTraitement", null);
__decorate([
    (0, common_1.Patch)('status'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_traitement_status_dto_1.UpdateTraitementStatusDto, Object]),
    __metadata("design:returntype", Promise)
], TraitementController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('kpi'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TraitementController.prototype, "kpi", null);
__decorate([
    (0, common_1.Get)('ai/recommendations'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TraitementController.prototype, "aiRecommendations", null);
__decorate([
    (0, common_1.Get)('export/excel'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TraitementController.prototype, "exportStats", null);
__decorate([
    (0, common_1.Get)('export/pdf'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TraitementController.prototype, "exportStatsPdf", null);
__decorate([
    (0, common_1.Get)(':bordereauId/history'),
    __param(0, (0, common_1.Param)('bordereauId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TraitementController.prototype, "history", null);
__decorate([
    (0, common_1.Get)(':bordereauId/history/export/excel'),
    __param(0, (0, common_1.Param)('bordereauId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TraitementController.prototype, "exportHistoryExcel", null);
__decorate([
    (0, common_1.Get)(':bordereauId/history/export/pdf'),
    __param(0, (0, common_1.Param)('bordereauId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TraitementController.prototype, "exportHistoryPdf", null);
exports.TraitementController = TraitementController = __decorate([
    (0, common_1.Controller)('traitement'),
    __metadata("design:paramtypes", [traitement_service_1.TraitementService])
], TraitementController);
//# sourceMappingURL=traitement.controller.js.map