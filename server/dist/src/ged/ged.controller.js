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
exports.GedController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const ged_service_1 = require("./ged.service");
const create_document_dto_1 = require("./dto/create-document.dto");
const search_document_dto_1 = require("./dto/search-document.dto");
const path_1 = require("path");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const common_2 = require("@nestjs/common");
function getUserFromRequest(req) {
    return req.user || { id: 'demo', role: 'SUPER_ADMIN' };
}
let GedController = class GedController {
    gedService;
    constructor(gedService) {
        this.gedService = gedService;
    }
    async uploadDocument(file, body, req) {
        const user = getUserFromRequest(req);
        if (!file)
            throw new Error('No file(s) uploaded.');
        return this.gedService.uploadDocument(file, body, user);
    }
    async seedDemo(req) {
        await this.gedService['prisma'].user.upsert({
            where: { id: 'demo' },
            update: {},
            create: {
                id: 'demo',
                email: 'demo@example.com',
                password: 'password',
                fullName: 'Demo User',
                role: 'SUPER_ADMIN',
                createdAt: new Date(),
            },
        });
        await this.gedService['prisma'].client.upsert({
            where: { id: 'demo-client' },
            update: {},
            create: {
                id: 'demo-client',
                name: 'Demo Client',
                reglementDelay: 30,
                reclamationDelay: 15,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        await this.gedService['prisma'].contract.upsert({
            where: { id: 'demo-contract' },
            update: {},
            create: {
                id: 'demo-contract',
                clientId: 'demo-client',
                clientName: 'Demo Client',
                delaiReglement: 30,
                delaiReclamation: 15,
                assignedManagerId: 'demo',
                documentPath: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                startDate: new Date(),
                endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            },
        });
        await this.gedService['prisma'].bordereau.upsert({
            where: { id: '12345' },
            update: {},
            create: {
                id: '12345',
                reference: 'REF12345',
                clientId: 'demo-client',
                contractId: 'demo-contract',
                dateReception: new Date(),
                delaiReglement: 30,
                nombreBS: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        return { message: 'Demo user, client, contract, and bordereau seeded.' };
    }
    async searchDocuments(query, req) {
        const user = getUserFromRequest(req);
        return this.gedService.searchDocuments(query, user);
    }
    async getDocumentStats(req) {
        const user = getUserFromRequest(req);
        return this.gedService.getDocumentStats(user);
    }
    async getSlaBreaches(req) {
        const user = getUserFromRequest(req);
        return this.gedService.getSlaBreaches(user);
    }
    async getSlaStatus(req) {
        const user = getUserFromRequest(req);
        return this.gedService.getSlaStatus(user);
    }
    async getDocumentAudit(id, req) {
        const user = getUserFromRequest(req);
        return this.gedService.getDocumentAudit(id, user);
    }
    async assignDocument(id, body, req) {
        const user = getUserFromRequest(req);
        return this.gedService.assignDocument(id, body, user);
    }
    async updateDocumentStatus(id, body, req) {
        const user = getUserFromRequest(req);
        return this.gedService.updateDocumentStatus(id, body.status, user);
    }
    async tagDocument(id, tags, req) {
        const user = getUserFromRequest(req);
        return this.gedService.tagDocument(id, tags, user);
    }
    async deleteDocument(id, req) {
        const user = getUserFromRequest(req);
        return this.gedService.deleteDocument(id, user);
    }
    async getDocument(id, req) {
        const user = getUserFromRequest(req);
        return this.gedService.getDocumentById(id, user);
    }
};
exports.GedController = GedController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, uniqueSuffix + (0, path_1.extname)(file.originalname));
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_document_dto_1.CreateDocumentDto, Object]),
    __metadata("design:returntype", Promise)
], GedController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Get)('seed-demo'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GedController.prototype, "seedDemo", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_document_dto_1.SearchDocumentDto, Object]),
    __metadata("design:returntype", Promise)
], GedController.prototype, "searchDocuments", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GedController.prototype, "getDocumentStats", null);
__decorate([
    (0, common_1.Get)('sla-breaches'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GedController.prototype, "getSlaBreaches", null);
__decorate([
    (0, common_1.Get)('sla-status'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GedController.prototype, "getSlaStatus", null);
__decorate([
    (0, common_1.Get)(':id/audit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GedController.prototype, "getDocumentAudit", null);
__decorate([
    (0, common_1.Patch)(':id/assign'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], GedController.prototype, "assignDocument", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], GedController.prototype, "updateDocumentStatus", null);
__decorate([
    (0, common_1.Patch)(':id/tag'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], GedController.prototype, "tagDocument", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GedController.prototype, "deleteDocument", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GedController.prototype, "getDocument", null);
exports.GedController = GedController = __decorate([
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('documents'),
    __metadata("design:paramtypes", [ged_service_1.GedService])
], GedController);
//# sourceMappingURL=ged.controller.js.map