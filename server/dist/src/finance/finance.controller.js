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
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const finance_service_1 = require("./finance.service");
const create_virement_dto_1 = require("./dto/create-virement.dto");
const search_virement_dto_1 = require("./dto/search-virement.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const common_2 = require("@nestjs/common");
function getUserFromRequest(req) {
    return req.user || { id: 'demo', role: 'SUPER_ADMIN' };
}
let FinanceController = class FinanceController {
    financeService;
    constructor(financeService) {
        this.financeService = financeService;
    }
    async createVirement(dto, req) {
        const user = getUserFromRequest(req);
        if (!dto.bordereauId || typeof dto.montant !== 'number' || !dto.referenceBancaire || !dto.dateDepot || !dto.dateExecution) {
            throw new Error('All required fields must be provided.');
        }
        return this.financeService.createVirement(dto, user);
    }
    async confirmVirement(id, req) {
        const user = getUserFromRequest(req);
        return this.financeService.confirmVirement(id, user);
    }
    async searchVirements(query, req) {
        const user = getUserFromRequest(req);
        return this.financeService.searchVirements(query, user);
    }
    async getVirement(id, req) {
        const user = getUserFromRequest(req);
        return this.financeService.getVirementById(id, user);
    }
    async exportVirements(format, query, req, res) {
        const user = getUserFromRequest(req);
        return this.financeService.exportVirements(format, query, user, res);
    }
    async autoConfirmVirements(req) {
        const user = getUserFromRequest(req);
        return this.financeService.autoConfirmVirements();
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_virement_dto_1.CreateVirementDto, Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "createVirement", null);
__decorate([
    (0, common_1.Patch)(':id/confirm'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "confirmVirement", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_virement_dto_1.SearchVirementDto, Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "searchVirements", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "getVirement", null);
__decorate([
    (0, common_1.Get)('export'),
    __param(0, (0, common_1.Query)('format')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, search_virement_dto_1.SearchVirementDto, Object, Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "exportVirements", null);
__decorate([
    (0, common_1.Post)('auto-confirm'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "autoConfirmVirements", null);
exports.FinanceController = FinanceController = __decorate([
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('virements'),
    __metadata("design:paramtypes", [finance_service_1.FinanceService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map