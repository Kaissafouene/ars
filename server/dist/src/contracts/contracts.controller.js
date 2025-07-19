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
exports.ContractsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const common_2 = require("@nestjs/common");
const contracts_service_1 = require("./contracts.service");
const create_contract_dto_1 = require("./dto/create-contract.dto");
const update_contract_dto_1 = require("./dto/update-contract.dto");
const search_contract_dto_1 = require("./dto/search-contract.dto");
const common_3 = require("@nestjs/common");
function getUserFromRequest(req) {
    return req.user || { id: 'demo', role: 'SUPER_ADMIN' };
}
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const common_4 = require("@nestjs/common");
let ContractsController = class ContractsController {
    contractsService;
    constructor(contractsService) {
        this.contractsService = contractsService;
    }
    async createContract(file, dto, req) {
        try {
            console.log('Controller: createContract called', { dto, file });
            const user = getUserFromRequest(req);
            if (!dto.clientId || !dto.clientName || typeof dto.delaiReglement !== 'number' || typeof dto.delaiReclamation !== 'number' || !dto.assignedManagerId || !dto.startDate || !dto.endDate) {
                throw new common_3.BadRequestException('All required fields must be provided.');
            }
            if (new Date(dto.startDate) > new Date(dto.endDate)) {
                throw new common_3.BadRequestException('startDate must be before or equal to endDate');
            }
            const clientLinked = await this.contractsService.isClientExists(dto.clientId);
            if (!clientLinked) {
                throw new common_3.NotFoundException('Linked client does not exist.');
            }
            const overlap = await this.contractsService.hasContractOverlap(dto.clientId, dto.startDate, dto.endDate);
            if (overlap) {
                throw new common_3.ConflictException('A contract for this client and period already exists.');
            }
            return await this.contractsService.createContract(dto, file, user);
        }
        catch (err) {
            console.error('Controller error:', err);
            throw err;
        }
    }
    async updateContract(id, dto, req) {
        const user = getUserFromRequest(req);
        return this.contractsService.updateContract(id, dto, user);
    }
    async deleteContract(id, req) {
        const user = getUserFromRequest(req);
        return this.contractsService.deleteContract(id, user);
    }
    async getContract(id, req) {
        const user = getUserFromRequest(req);
        return this.contractsService.getContract(id, user);
    }
    async searchContracts(query, req) {
        const user = getUserFromRequest(req);
        return this.contractsService.searchContracts(query, user);
    }
    async getContractHistory(id, req) {
        const user = getUserFromRequest(req);
        return this.contractsService.getContractHistory(id, user);
    }
    async getAllContracts(req) {
        const user = getUserFromRequest(req);
        return this.contractsService.searchContracts({}, user);
    }
    async exportContractsExcel(req, query, res) {
        const user = getUserFromRequest(req);
        const result = await this.contractsService.exportContractsExcel(query, user);
        res.setHeader('Content-Type', result.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
        res.send(result.file);
    }
    async exportContractsPdf(req, query, res) {
        const user = getUserFromRequest(req);
        const result = await this.contractsService.exportContractsPdf(query, user);
        res.setHeader('Content-Type', result.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
        res.send(result.file);
    }
    async getContractStatistics(req) {
        const user = getUserFromRequest(req);
        return this.contractsService.getContractStatistics(user);
    }
    async checkSlaBreaches() {
        return this.contractsService.checkSlaBreaches();
    }
    async associateContractsToBordereaux() {
        return this.contractsService.associateContractsToBordereaux();
    }
    async triggerContractReminders() {
        return this.contractsService.triggerContractReminders();
    }
    async indexContractsForGed() {
        return this.contractsService.indexContractsForGed();
    }
    async linkContractsToComplaints() {
        return this.contractsService.linkContractsToComplaints();
    }
};
exports.ContractsController = ContractsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { dest: './uploads/contracts' })),
    (0, common_2.UsePipes)(new (require('@nestjs/common').ValidationPipe)({ transform: true })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_contract_dto_1.CreateContractDto, Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "createContract", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_contract_dto_1.UpdateContractDto, Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "updateContract", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "deleteContract", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "getContract", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_contract_dto_1.SearchContractDto, Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "searchContracts", null);
__decorate([
    (0, common_1.Get)(':id/history'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "getContractHistory", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "getAllContracts", null);
__decorate([
    (0, common_1.Get)('export/excel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, search_contract_dto_1.SearchContractDto, Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "exportContractsExcel", null);
__decorate([
    (0, common_1.Get)('export/pdf'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, search_contract_dto_1.SearchContractDto, Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "exportContractsPdf", null);
__decorate([
    (0, common_1.Get)('dashboard/statistics'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "getContractStatistics", null);
__decorate([
    (0, common_1.Post)('sla/check'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "checkSlaBreaches", null);
__decorate([
    (0, common_1.Post)('associate-bordereaux'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "associateContractsToBordereaux", null);
__decorate([
    (0, common_1.Post)('reminders/trigger'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "triggerContractReminders", null);
__decorate([
    (0, common_1.Post)('ged/index'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "indexContractsForGed", null);
__decorate([
    (0, common_1.Post)('link-complaints'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "linkContractsToComplaints", null);
exports.ContractsController = ContractsController = __decorate([
    (0, common_4.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('contracts'),
    __metadata("design:paramtypes", [contracts_service_1.ContractsService])
], ContractsController);
//# sourceMappingURL=contracts.controller.js.map