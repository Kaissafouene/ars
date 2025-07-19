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
exports.ReclamationsController = void 0;
const common_1 = require("@nestjs/common");
const reclamations_service_1 = require("./reclamations.service");
const create_reclamation_dto_1 = require("./dto/create-reclamation.dto");
const update_reclamation_dto_1 = require("./dto/update-reclamation.dto");
const search_reclamation_dto_1 = require("./dto/search-reclamation.dto");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const common_2 = require("@nestjs/common");
function getUserFromRequest(req) {
    return req.user || { id: 'demo', role: 'SUPER_ADMIN' };
}
let ReclamationsController = class ReclamationsController {
    reclamationsService;
    constructor(reclamationsService) {
        this.reclamationsService = reclamationsService;
    }
    async createReclamation(file, dto, req) {
        const user = getUserFromRequest(req);
        if (!dto.description || !dto.type || !dto.severity || !dto.department) {
            throw new Error('All required fields (description, type, severity, department) must be provided.');
        }
        if (file)
            dto['evidencePath'] = file.path;
        return this.reclamationsService.createReclamation(dto, user);
    }
    async updateReclamation(id, dto, req) {
        const user = getUserFromRequest(req);
        return this.reclamationsService.updateReclamation(id, dto, user);
    }
    async assignReclamation(id, assignedToId, req) {
        const user = getUserFromRequest(req);
        return this.reclamationsService.assignReclamation(id, assignedToId, user);
    }
    async autoAssign(department) {
        return { assignedToId: await this.reclamationsService.autoAssign(department) };
    }
    async notify(id, body, req) {
        const user = getUserFromRequest(req);
        const reclamation = await this.reclamationsService.getReclamation(id, user);
        if (body.email) {
            await this.reclamationsService.notificationService.sendEmail(body.email, body.type || 'Notification', body.message || '');
        }
        await this.reclamationsService.sendNotification(body.type, reclamation);
        return { notified: true };
    }
    async bulkUpdate(body, req) {
        const user = getUserFromRequest(req);
        return this.reclamationsService.bulkUpdate(body.ids, body.data, user);
    }
    async bulkAssign(body, req) {
        const user = getUserFromRequest(req);
        return this.reclamationsService.bulkAssign(body.ids, body.assignedToId, user);
    }
    async getSlaBreaches(req) {
        const user = getUserFromRequest(req);
        return this.reclamationsService.getSlaBreaches(user);
    }
    async checkSla(req) {
        const user = getUserFromRequest(req);
        return this.reclamationsService.checkSla(user);
    }
    async getGecDocument(id, req) {
        const user = getUserFromRequest(req);
        return this.reclamationsService.getGecDocument(id, user);
    }
    async aiPredict(text, req) {
        const user = getUserFromRequest(req);
        return this.reclamationsService.aiPredict(text, user);
    }
    async generateGec(id, req) {
        const user = getUserFromRequest(req);
        await this.reclamationsService.generateGecDocument(id, user);
        return { gecGenerated: true };
    }
    async performanceAnalytics(req) {
        const user = getUserFromRequest(req);
        return this.reclamationsService.analytics(user);
    }
    async escalateReclamation(id, req) {
        const user = getUserFromRequest(req);
        return this.reclamationsService.escalateReclamation(id, user);
    }
    async getReclamation(id, req) {
        const user = getUserFromRequest(req);
        return this.reclamationsService.getReclamation(id, user);
    }
    async searchReclamations(query, req) {
        const user = getUserFromRequest(req);
        return this.reclamationsService.searchReclamations(query, user);
    }
    async getReclamationHistory(id, req) {
        const user = getUserFromRequest(req);
        return this.reclamationsService.getReclamationHistory(id, user);
    }
    async aiAnalysis(req) {
        const user = getUserFromRequest(req);
        return this.reclamationsService.aiAnalysis(user);
    }
    async getCorrelationAI(payload) {
        return this.reclamationsService.getCorrelationAI(payload);
    }
    async analytics(req) {
        const user = getUserFromRequest(req);
        return this.reclamationsService.analytics(user);
    }
    async trend(req) {
        const user = getUserFromRequest(req);
        return this.reclamationsService.trend(user);
    }
    async convertToTask(id, req) {
        const user = getUserFromRequest(req);
        return this.reclamationsService.convertToTask(id, user);
    }
    async autoReplySuggestion(id, req) {
        const user = getUserFromRequest(req);
        return this.reclamationsService.autoReplySuggestion(id, user);
    }
};
exports.ReclamationsController = ReclamationsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { dest: './uploads/reclamations' })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_reclamation_dto_1.CreateReclamationDto, Object]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "createReclamation", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_reclamation_dto_1.UpdateReclamationDto, Object]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "updateReclamation", null);
__decorate([
    (0, common_1.Patch)(':id/assign'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('assignedToId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "assignReclamation", null);
__decorate([
    (0, common_1.Post)('auto-assign'),
    __param(0, (0, common_1.Body)('department')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "autoAssign", null);
__decorate([
    (0, common_1.Post)(':id/notify'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "notify", null);
__decorate([
    (0, common_1.Patch)('bulk-update'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "bulkUpdate", null);
__decorate([
    (0, common_1.Patch)('bulk-assign'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "bulkAssign", null);
__decorate([
    (0, common_1.Get)('sla/breaches'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "getSlaBreaches", null);
__decorate([
    (0, common_1.Post)('sla/check'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "checkSla", null);
__decorate([
    (0, common_1.Get)(':id/gec/document'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "getGecDocument", null);
__decorate([
    (0, common_1.Post)('ai/predict'),
    __param(0, (0, common_1.Body)('text')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "aiPredict", null);
__decorate([
    (0, common_1.Post)(':id/gec/generate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "generateGec", null);
__decorate([
    (0, common_1.Get)('analytics/performance'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "performanceAnalytics", null);
__decorate([
    (0, common_1.Patch)(':id/escalate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "escalateReclamation", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "getReclamation", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_reclamation_dto_1.SearchReclamationDto, Object]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "searchReclamations", null);
__decorate([
    (0, common_1.Get)(':id/history'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "getReclamationHistory", null);
__decorate([
    (0, common_1.Get)('ai/analysis'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "aiAnalysis", null);
__decorate([
    (0, common_1.Post)('ai/correlation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "getCorrelationAI", null);
__decorate([
    (0, common_1.Get)('analytics/dashboard'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "analytics", null);
__decorate([
    (0, common_1.Get)('trend'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "trend", null);
__decorate([
    (0, common_1.Post)(':id/convert-to-task'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "convertToTask", null);
__decorate([
    (0, common_1.Get)(':id/auto-reply'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReclamationsController.prototype, "autoReplySuggestion", null);
exports.ReclamationsController = ReclamationsController = __decorate([
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('reclamations'),
    __metadata("design:paramtypes", [reclamations_service_1.ReclamationsService])
], ReclamationsController);
//# sourceMappingURL=reclamations.controller.js.map