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
exports.ClientController = void 0;
const common_1 = require("@nestjs/common");
const client_service_1 = require("./client.service");
const create_client_dto_1 = require("./dto/create-client.dto");
const update_client_dto_1 = require("./dto/update-client.dto");
const search_client_dto_1 = require("./dto/search-client.dto");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const user_role_enum_1 = require("../auth/user-role.enum");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ClientController = class ClientController {
    clientService;
    constructor(clientService) {
        this.clientService = clientService;
    }
    async create(dto) {
        if (!dto.name || typeof dto.reglementDelay !== 'number' || typeof dto.reclamationDelay !== 'number') {
            throw new Error('All fields (name, reglementDelay, reclamationDelay, accountManagerId) are required.');
        }
        const existing = await this.clientService.findByName(dto.name);
        if (existing) {
            throw new Error('A client with this name already exists.');
        }
        return this.clientService.create(dto);
    }
    findAll(query, req) {
        return this.clientService.findAll(query, req['user']);
    }
    findOne(id) {
        return this.clientService.findOne(id);
    }
    update(id, dto) {
        return this.clientService.update(id, dto);
    }
    remove(id) {
        return this.clientService.remove(id);
    }
    getHistory(id) {
        return this.clientService.getHistory(id);
    }
    analytics(id) {
        return this.clientService.analytics(id);
    }
    async exportExcel(query, res) {
        const buffer = await this.clientService.exportToExcel(query);
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="clients.xlsx"',
        });
        res.status(common_1.HttpStatus.OK).send(buffer);
    }
    async exportPDF(query, res) {
        const buffer = await this.clientService.exportToPDF(query);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="clients.pdf"',
        });
        res.status(common_1.HttpStatus.OK).send(buffer);
    }
    analyticsAI(id) {
        return this.clientService.getAIRecommendation(id);
    }
    async syncExternal(id) {
        return this.clientService.syncWithExternal(id);
    }
    trends(id) {
        return this.clientService.analyticsTrends(id);
    }
    async handleArsWebhook(payload, res) {
        try {
            await this.clientService.handleArsWebhook(payload);
            res.status(common_1.HttpStatus.OK).json({ status: 'success', message: 'Webhook processed' });
        }
        catch (error) {
            res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ status: 'error', message: error.message });
        }
    }
    async uploadContract(id, file, req) {
        if (!file)
            throw new Error('No file uploaded');
        const allowedTypes = ['application/pdf'];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new Error('Only PDF files are allowed');
        }
        if (file.size > 10 * 1024 * 1024) {
            throw new Error('File size exceeds 10MB');
        }
        const user = req['user'];
        const uploaderId = user?.id || user?.userId || user?.sub;
        if (!uploaderId) {
            throw new Error('Uploader user id not found in request');
        }
        return this.clientService.uploadContract(id, file, uploaderId);
    }
    async downloadContract(documentId, res) {
        return this.clientService.downloadContract(documentId, res);
    }
    updateSlaConfig(id, config) {
        return this.clientService.updateSlaConfig(id, config);
    }
    getSlaConfig(id) {
        return this.clientService.getSlaConfig(id);
    }
    getComplaints(id) {
        return this.clientService.getComplaintsByClient(id);
    }
    getBordereaux(id) {
        return this.clientService.getBordereauxByClient(id);
    }
    getSlaStatus(id) {
        return this.clientService.getSlaStatus(id);
    }
    reclamationSla(id) {
        return this.clientService.reclamationSlaStats(id);
    }
    prioritized() {
        return this.clientService.prioritizedClients();
    }
    autofill(id) {
        return this.clientService.autofillData(id);
    }
};
exports.ClientController = ClientController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMINISTRATEUR, user_role_enum_1.UserRole.MANAGER, user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_client_dto_1.CreateClientDto]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_client_dto_1.SearchClientDto, Object]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMINISTRATEUR, user_role_enum_1.UserRole.MANAGER, user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_client_dto_1.UpdateClientDto]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMINISTRATEUR, user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/history'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)(':id/analytics'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "analytics", null);
__decorate([
    (0, common_1.Post)('export/excel'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMINISTRATEUR, user_role_enum_1.UserRole.MANAGER, user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_client_dto_1.SearchClientDto, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "exportExcel", null);
__decorate([
    (0, common_1.Post)('export/pdf'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMINISTRATEUR, user_role_enum_1.UserRole.MANAGER, user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_client_dto_1.SearchClientDto, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "exportPDF", null);
__decorate([
    (0, common_1.Get)(':id/ai-recommendation'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "analyticsAI", null);
__decorate([
    (0, common_1.Post)(':id/sync-external'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMINISTRATEUR, user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "syncExternal", null);
__decorate([
    (0, common_1.Get)(':id/trends'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "trends", null);
__decorate([
    (0, common_1.Post)('webhook/ars'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "handleArsWebhook", null);
__decorate([
    (0, common_1.Post)(':id/upload-contract'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMINISTRATEUR, user_role_enum_1.UserRole.MANAGER, user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "uploadContract", null);
__decorate([
    (0, common_1.Get)('contract/:documentId/download'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMINISTRATEUR, user_role_enum_1.UserRole.MANAGER, user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "downloadContract", null);
__decorate([
    (0, common_1.Patch)(':id/sla-config'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMINISTRATEUR, user_role_enum_1.UserRole.MANAGER, user_role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "updateSlaConfig", null);
__decorate([
    (0, common_1.Get)(':id/sla-config'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "getSlaConfig", null);
__decorate([
    (0, common_1.Get)(':id/complaints'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "getComplaints", null);
__decorate([
    (0, common_1.Get)(':id/bordereaux'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "getBordereaux", null);
__decorate([
    (0, common_1.Get)(':id/sla-status'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "getSlaStatus", null);
__decorate([
    (0, common_1.Get)(':id/reclamation-sla'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "reclamationSla", null);
__decorate([
    (0, common_1.Get)('prioritized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "prioritized", null);
__decorate([
    (0, common_1.Get)(':id/autofill'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "autofill", null);
exports.ClientController = ClientController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('clients'),
    __metadata("design:paramtypes", [client_service_1.ClientService])
], ClientController);
//# sourceMappingURL=client.controller.js.map