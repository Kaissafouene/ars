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
exports.OcrController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const ocr_service_1 = require("./ocr.service");
const ocr_request_dto_1 = require("./dto/ocr-request.dto");
function getUserFromRequest(req) {
    return req.user || { id: 'demo', role: 'SUPER_ADMIN' };
}
let OcrController = class OcrController {
    ocrService;
    constructor(ocrService) {
        this.ocrService = ocrService;
    }
    async processOcr(file, dto, req) {
        const user = getUserFromRequest(req);
        return this.ocrService.processOcr(file, dto, user);
    }
    async getOcrResult(docId, req) {
        const user = getUserFromRequest(req);
        return this.ocrService.getOcrResult(docId, user);
    }
    async patchOcrResult(docId, correction, req) {
        const user = getUserFromRequest(req);
        return this.ocrService.patchOcrResult(docId, correction, user);
    }
    async getOcrLogs(req) {
        const user = getUserFromRequest(req);
        return this.ocrService.getOcrLogs(user);
    }
};
exports.OcrController = OcrController;
__decorate([
    (0, common_1.Post)('process'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { dest: './uploads' })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ocr_request_dto_1.OcrRequestDto, Object]),
    __metadata("design:returntype", Promise)
], OcrController.prototype, "processOcr", null);
__decorate([
    (0, common_1.Get)(':docId'),
    __param(0, (0, common_1.Param)('docId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OcrController.prototype, "getOcrResult", null);
__decorate([
    (0, common_1.Patch)(':docId'),
    __param(0, (0, common_1.Param)('docId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], OcrController.prototype, "patchOcrResult", null);
__decorate([
    (0, common_1.Get)('logs'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OcrController.prototype, "getOcrLogs", null);
exports.OcrController = OcrController = __decorate([
    (0, common_1.Controller)('ocr'),
    __metadata("design:paramtypes", [ocr_service_1.OcrService])
], OcrController);
//# sourceMappingURL=ocr.controller.js.map