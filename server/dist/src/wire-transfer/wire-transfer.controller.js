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
exports.WireTransferController = void 0;
const common_1 = require("@nestjs/common");
const wire_transfer_service_1 = require("./wire-transfer.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer = require("multer");
let WireTransferController = class WireTransferController {
    service;
    constructor(service) {
        this.service = service;
    }
    createSociety(data) { return this.service.createSociety(data); }
    getSocieties() { return this.service.getSocieties(); }
    getSociety(id) { return this.service.getSociety(id); }
    updateSociety(id, data) { return this.service.updateSociety(id, data); }
    deleteSociety(id) { return this.service.deleteSociety(id); }
    createMember(data) { return this.service.createMember(data); }
    getMembers(societyId) { return this.service.getMembers(societyId); }
    getMember(id) { return this.service.getMember(id); }
    updateMember(id, data) { return this.service.updateMember(id, data); }
    deleteMember(id) { return this.service.deleteMember(id); }
    createDonneur(data) { return this.service.createDonneur(data); }
    getDonneurs(societyId) { return this.service.getDonneurs(societyId); }
    getDonneur(id) { return this.service.getDonneur(id); }
    updateDonneur(id, data) { return this.service.updateDonneur(id, data); }
    deleteDonneur(id) { return this.service.deleteDonneur(id); }
    createBatch(data) { return this.service.createBatch(data); }
    getBatches(societyId) { return this.service.getBatches(societyId); }
    getBatch(id) { return this.service.getBatch(id); }
    updateBatch(id, data) { return this.service.updateBatch(id, data); }
    deleteBatch(id) { return this.service.deleteBatch(id); }
    createTransfer(data) { return this.service.createTransfer(data); }
    getTransfers(batchId) { return this.service.getTransfers(batchId); }
    getTransfer(id) { return this.service.getTransfer(id); }
    updateTransfer(id, data) { return this.service.updateTransfer(id, data); }
    deleteTransfer(id) { return this.service.deleteTransfer(id); }
    getBatchHistory(id) { return this.service.getBatchHistory(id); }
    getTransferHistory(id) { return this.service.getTransferHistory(id); }
    async previewBatch(file, body) {
        return this.service.previewBatch(file, body);
    }
    async uploadBatch(file, body) {
        return this.service.uploadAndProcessBatch(file, body);
    }
    async downloadBatchPdf(id, res) {
        const buffer = await this.service.generateBatchPdf(id);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="batch_${id}.pdf"`);
        res.end(buffer);
    }
    async downloadBatchTxt(id, res) {
        const buffer = await this.service.generateBatchTxt(id);
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="batch_${id}.txt"`);
        res.end(buffer);
    }
    async archiveBatch(id) {
        return this.service.archiveBatch(id);
    }
    async dashboardStats() {
        return this.service.getDashboardStats();
    }
    async dashboardAnalytics(query, req) {
        return this.service.getDashboardAnalytics(query, req.user);
    }
    async exportDashboardAnalyticsExcel(query, req, res) {
        const buffer = await this.service.exportDashboardAnalyticsExcel(query, req.user);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="dashboard_analytics.xlsx"');
        res.end(buffer);
    }
    async exportDashboardAnalyticsPdf(query, req, res) {
        const buffer = await this.service.exportDashboardAnalyticsPdf(query, req.user);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="dashboard_analytics.pdf"');
        res.end(buffer);
    }
    async getAlerts() {
        return this.service.getAlerts();
    }
};
exports.WireTransferController = WireTransferController;
__decorate([
    (0, common_1.Post)('society'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "createSociety", null);
__decorate([
    (0, common_1.Get)('society'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "getSocieties", null);
__decorate([
    (0, common_1.Get)('society/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "getSociety", null);
__decorate([
    (0, common_1.Patch)('society/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "updateSociety", null);
__decorate([
    (0, common_1.Delete)('society/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "deleteSociety", null);
__decorate([
    (0, common_1.Post)('member'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "createMember", null);
__decorate([
    (0, common_1.Get)('member'),
    __param(0, (0, common_1.Query)('societyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Get)('member/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "getMember", null);
__decorate([
    (0, common_1.Patch)('member/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "updateMember", null);
__decorate([
    (0, common_1.Delete)('member/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "deleteMember", null);
__decorate([
    (0, common_1.Post)('donneur'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "createDonneur", null);
__decorate([
    (0, common_1.Get)('donneur'),
    __param(0, (0, common_1.Query)('societyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "getDonneurs", null);
__decorate([
    (0, common_1.Get)('donneur/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "getDonneur", null);
__decorate([
    (0, common_1.Patch)('donneur/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "updateDonneur", null);
__decorate([
    (0, common_1.Delete)('donneur/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "deleteDonneur", null);
__decorate([
    (0, common_1.Post)('batch'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "createBatch", null);
__decorate([
    (0, common_1.Get)('batch'),
    __param(0, (0, common_1.Query)('societyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "getBatches", null);
__decorate([
    (0, common_1.Get)('batch/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "getBatch", null);
__decorate([
    (0, common_1.Patch)('batch/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "updateBatch", null);
__decorate([
    (0, common_1.Delete)('batch/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "deleteBatch", null);
__decorate([
    (0, common_1.Post)('transfer'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "createTransfer", null);
__decorate([
    (0, common_1.Get)('transfer'),
    __param(0, (0, common_1.Query)('batchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "getTransfers", null);
__decorate([
    (0, common_1.Get)('transfer/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "getTransfer", null);
__decorate([
    (0, common_1.Patch)('transfer/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "updateTransfer", null);
__decorate([
    (0, common_1.Delete)('transfer/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "deleteTransfer", null);
__decorate([
    (0, common_1.Get)('batch/:id/history'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "getBatchHistory", null);
__decorate([
    (0, common_1.Get)('transfer/:id/history'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WireTransferController.prototype, "getTransferHistory", null);
__decorate([
    (0, common_1.Post)('batch/preview'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: multer.memoryStorage() })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WireTransferController.prototype, "previewBatch", null);
__decorate([
    (0, common_1.Post)('batch/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: multer.memoryStorage() })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WireTransferController.prototype, "uploadBatch", null);
__decorate([
    (0, common_1.Get)('batch/:id/download/pdf'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WireTransferController.prototype, "downloadBatchPdf", null);
__decorate([
    (0, common_1.Get)('batch/:id/download/txt'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WireTransferController.prototype, "downloadBatchTxt", null);
__decorate([
    (0, common_1.Patch)('batch/:id/archive'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WireTransferController.prototype, "archiveBatch", null);
__decorate([
    (0, common_1.Get)('dashboard/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WireTransferController.prototype, "dashboardStats", null);
__decorate([
    (0, common_1.Get)('dashboard/analytics'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WireTransferController.prototype, "dashboardAnalytics", null);
__decorate([
    (0, common_1.Get)('dashboard/analytics/export/excel'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], WireTransferController.prototype, "exportDashboardAnalyticsExcel", null);
__decorate([
    (0, common_1.Get)('dashboard/analytics/export/pdf'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], WireTransferController.prototype, "exportDashboardAnalyticsPdf", null);
__decorate([
    (0, common_1.Get)('alerts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WireTransferController.prototype, "getAlerts", null);
exports.WireTransferController = WireTransferController = __decorate([
    (0, common_1.Controller)('wire-transfer'),
    __metadata("design:paramtypes", [wire_transfer_service_1.WireTransferService])
], WireTransferController);
//# sourceMappingURL=wire-transfer.controller.js.map