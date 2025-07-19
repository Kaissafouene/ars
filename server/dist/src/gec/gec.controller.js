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
exports.GecController = void 0;
const common_1 = require("@nestjs/common");
const gec_service_1 = require("./gec.service");
const create_courrier_dto_1 = require("./dto/create-courrier.dto");
const send_courrier_dto_1 = require("./dto/send-courrier.dto");
const search_courrier_dto_1 = require("./dto/search-courrier.dto");
const update_courrier_status_dto_1 = require("./dto/update-courrier-status.dto");
const template_service_1 = require("./template.service");
function getUserFromRequest(req) {
    return req.user || { id: 'demo', role: 'SUPER_ADMIN' };
}
let GecController = class GecController {
    gecService;
    templateService;
    constructor(gecService, templateService) {
        this.gecService = gecService;
        this.templateService = templateService;
    }
    listTemplates() {
        return this.templateService.listTemplates();
    }
    getTemplate(id) {
        return this.templateService.getTemplate(id);
    }
    createTemplate(dto) {
        return this.templateService.createTemplate(dto);
    }
    updateTemplate(id, dto) {
        return this.templateService.updateTemplate(id, dto);
    }
    deleteTemplate(id) {
        return this.templateService.deleteTemplate(id);
    }
    async renderTemplate(id, variables) {
        const tpl = await this.templateService.getTemplate(id);
        return {
            subject: this.templateService.renderTemplate(tpl.subject, variables),
            body: this.templateService.renderTemplate(tpl.body, variables),
        };
    }
    async createCourrier(dto, req) {
        const user = getUserFromRequest(req);
        return this.gecService.createCourrier(dto, user);
    }
    async sendCourrier(id, dto, req) {
        const user = getUserFromRequest(req);
        return this.gecService.sendCourrier(id, dto, user);
    }
    async searchCourriers(query, req) {
        const user = getUserFromRequest(req);
        return this.gecService.searchCourriers(query, user);
    }
    async getCourrier(id, req) {
        const user = getUserFromRequest(req);
        return this.gecService.getCourrierById(id, user);
    }
    async updateCourrierStatus(id, dto, req) {
        const user = getUserFromRequest(req);
        return this.gecService.updateCourrierStatus(id, dto, user);
    }
    async deleteCourrier(id, req) {
        const user = getUserFromRequest(req);
        return this.gecService.deleteCourrier(id, user);
    }
};
exports.GecController = GecController;
__decorate([
    (0, common_1.Get)('templates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GecController.prototype, "listTemplates", null);
__decorate([
    (0, common_1.Get)('templates/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GecController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Post)('templates'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GecController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Patch)('templates/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GecController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Delete)('templates/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GecController.prototype, "deleteTemplate", null);
__decorate([
    (0, common_1.Post)('templates/:id/render'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GecController.prototype, "renderTemplate", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_courrier_dto_1.CreateCourrierDto, Object]),
    __metadata("design:returntype", Promise)
], GecController.prototype, "createCourrier", null);
__decorate([
    (0, common_1.Post)(':id/send'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, send_courrier_dto_1.SendCourrierDto, Object]),
    __metadata("design:returntype", Promise)
], GecController.prototype, "sendCourrier", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_courrier_dto_1.SearchCourrierDto, Object]),
    __metadata("design:returntype", Promise)
], GecController.prototype, "searchCourriers", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GecController.prototype, "getCourrier", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_courrier_status_dto_1.UpdateCourrierStatusDto, Object]),
    __metadata("design:returntype", Promise)
], GecController.prototype, "updateCourrierStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GecController.prototype, "deleteCourrier", null);
exports.GecController = GecController = __decorate([
    (0, common_1.Controller)('courriers'),
    __metadata("design:paramtypes", [gec_service_1.GecService,
        template_service_1.TemplateService])
], GecController);
//# sourceMappingURL=gec.controller.js.map