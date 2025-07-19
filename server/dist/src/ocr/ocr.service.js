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
var OcrService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");
let OcrService = OcrService_1 = class OcrService {
    prisma;
    async extractText(documentUrl) {
        let filePath = documentUrl;
        if (/^https?:\/\//.test(documentUrl)) {
            const axios = require('axios');
            const tmp = require('tmp');
            const tempFile = tmp.fileSync({ postfix: path.extname(documentUrl) });
            const writer = fs.createWriteStream(tempFile.name);
            const response = await axios({ url: documentUrl, method: 'GET', responseType: 'stream' });
            await new Promise((resolve, reject) => {
                response.data.pipe(writer);
                writer.on('finish', () => resolve());
                writer.on('error', (err) => reject(err));
            });
            filePath = tempFile.name;
        }
        try {
            const { data } = await Tesseract.recognize(filePath, 'fra+eng');
            return data.text;
        }
        catch (e) {
            this.logger.error('OCR extraction failed', e);
            throw new Error('OCR extraction failed: ' + e.message);
        }
    }
    logger = new common_1.Logger(OcrService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    checkOcrRole(user) {
        if (!['SCAN', 'SUPER_ADMIN', 'CHEF_EQUIPE'].includes(user.role)) {
            throw new common_1.ForbiddenException('Access denied');
        }
    }
    async processOcr(file, dto, user) {
        this.checkOcrRole(user);
        const document = await this.prisma.document.findUnique({ where: { id: dto.documentId } });
        if (!document)
            throw new common_1.NotFoundException('Document not found');
        let rawText = '';
        let status = 'SUCCESS';
        let error = undefined;
        try {
            const result = await Tesseract.recognize(file.path, 'eng+fra');
            rawText = result.data.text;
        }
        catch (e) {
            status = 'FAILED';
            error = e.message;
            rawText = '';
        }
        const extracted = this.parseFields(rawText);
        await this.prisma.document.update({
            where: { id: dto.documentId },
            data: {
                ocrResult: {
                    rawText,
                    extracted,
                    ocrAt: new Date().toISOString(),
                    status,
                    error,
                },
            },
        });
        await this.prisma.oCRLog.create({
            data: {
                documentId: dto.documentId,
                userId: user.id,
                processedById: user.id,
                status,
                error,
                ocrAt: new Date(),
            },
        });
        return {
            rawText,
            extracted,
            ocrAt: new Date().toISOString(),
            status,
            error,
        };
    }
    parseFields(rawText) {
        const reference = /Ref[:\s]*([\w\d]+)/i.exec(rawText)?.[1];
        const client = /Client[:\s]*([\w\s]+)/i.exec(rawText)?.[1];
        const date = /Date[:\s]*([\d\/\-]+)/i.exec(rawText)?.[1];
        const montant = /Montant[:\s]*([\d\.,]+)/i.exec(rawText)?.[1];
        return {
            reference,
            client,
            date: date ? this.parseDate(date) : undefined,
            montant: montant ? parseFloat(montant.replace(',', '.')) : undefined,
        };
    }
    parseDate(dateStr) {
        const m = /([0-9]{2})[\/\-]([0-9]{2})[\/\-]([0-9]{4})/.exec(dateStr);
        if (m)
            return `${m[3]}-${m[2]}-${m[1]}`;
        return dateStr;
    }
    async getOcrResult(documentId, user) {
        this.checkOcrRole(user);
        const doc = await this.prisma.document.findUnique({ where: { id: documentId } });
        if (!doc)
            throw new common_1.NotFoundException('Document not found');
        return doc.ocrResult;
    }
    async patchOcrResult(documentId, correction, user) {
        this.checkOcrRole(user);
        const doc = await this.prisma.document.findUnique({ where: { id: documentId } });
        if (!doc)
            throw new common_1.NotFoundException('Document not found');
        const ocrResult = typeof doc.ocrResult === 'string'
            ? JSON.parse(doc.ocrResult)
            : doc.ocrResult || {};
        const corrected = { ...ocrResult.extracted, ...correction };
        await this.prisma.document.update({
            where: { id: documentId },
            data: {
                ocrResult: {
                    ...ocrResult,
                    corrected,
                },
            },
        });
        return { ...ocrResult, corrected };
    }
    async getOcrLogs(user) {
        if (user.role !== 'SUPER_ADMIN')
            throw new common_1.ForbiddenException('Admin only');
        return this.prisma.oCRLog.findMany({
            orderBy: { ocrAt: 'desc' },
            include: { document: true, processedBy: true },
        });
    }
};
exports.OcrService = OcrService;
exports.OcrService = OcrService = OcrService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OcrService);
//# sourceMappingURL=ocr.service.js.map