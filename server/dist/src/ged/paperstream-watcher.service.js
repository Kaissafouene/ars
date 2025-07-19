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
var PaperStreamWatcherService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaperStreamWatcherService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notification_service_1 = require("./notification.service");
const ocr_service_1 = require("../ocr/ocr.service");
const chokidar = require("chokidar");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
let PaperStreamWatcherService = PaperStreamWatcherService_1 = class PaperStreamWatcherService {
    prisma;
    notificationService;
    ocrService;
    logger = new common_1.Logger(PaperStreamWatcherService_1.name);
    watcher = null;
    watchDir = process.env.PAPERSTREAM_WATCH_DIR || 'D:/PAPERSTREAM-INBOX';
    allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
    maxSize = 10 * 1024 * 1024;
    constructor(prisma, notificationService, ocrService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.ocrService = ocrService;
    }
    async onModuleInit() {
        this.logger.log(`Starting PaperStream watcher on: ${this.watchDir}`);
        this.watcher = chokidar.watch(this.watchDir, { persistent: true, ignoreInitial: false });
        this.watcher.on('add', this.handleFileAdd.bind(this));
        this.watcher.on('error', (err) => this.logger.error('Watcher error', err));
    }
    async onModuleDestroy() {
        if (this.watcher)
            await this.watcher.close();
    }
    async handleFileAdd(filePath) {
        this.logger.log(`Detected new file: ${filePath}`);
        try {
            const ext = path.extname(filePath).toLowerCase();
            if (!this.allowedTypes.includes(ext)) {
                this.logger.warn(`File type not allowed: ${filePath}`);
                await this.logAction('REJECTED_TYPE', filePath, `Type: ${ext}`);
                return;
            }
            const stat = fs.statSync(filePath);
            if (stat.size > this.maxSize) {
                this.logger.warn(`File too large: ${filePath}`);
                await this.logAction('REJECTED_SIZE', filePath, `Size: ${stat.size}`);
                return;
            }
            const hash = await this.computeFileHash(filePath);
            const existing = await this.prisma.document.findFirst({ where: { hash } });
            if (existing) {
                this.logger.warn(`Duplicate file detected: ${filePath}`);
                await this.logAction('DUPLICATE', filePath, `Hash: ${hash}`);
                return;
            }
            const uploadsDir = path.resolve('uploads');
            if (!fs.existsSync(uploadsDir))
                fs.mkdirSync(uploadsDir);
            const destPath = path.join(uploadsDir, path.basename(filePath));
            fs.renameSync(filePath, destPath);
            let ocrText = '';
            let ocrResult = {};
            try {
                ocrText = await this.ocrService.extractText(destPath);
                ocrResult = this.ocrService.parseFields(ocrText);
            }
            catch (e) {
                this.logger.warn(`OCR failed for ${destPath}: ${e.message}`);
            }
            let bordereau = null;
            if (ocrResult.reference) {
                bordereau = await this.prisma.bordereau.findFirst({ where: { reference: ocrResult.reference } });
            }
            const doc = await this.prisma.document.create({
                data: {
                    name: path.basename(destPath),
                    type: ext.replace('.', ''),
                    path: destPath,
                    uploadedById: '0ce7d8c7-64ee-45a6-b8a5888',
                    status: 'UPLOADED',
                    hash,
                    bordereauId: bordereau && bordereau.id ? bordereau.id : undefined,
                    ocrText,
                    ocrResult,
                },
            });
            await this.logAction('IMPORTED', destPath, `Hash: ${hash}`);
            if (bordereau && bordereau.id) {
                await this.prisma.bordereau.update({
                    where: { id: bordereau.id },
                    data: { statut: 'SCAN_TERMINE' },
                });
                const contract = await this.prisma.contract.findUnique({ where: { id: bordereau.contractId } });
                if (contract && contract.assignedManagerId) {
                    await this.prisma.bordereau.update({
                        where: { id: bordereau.id },
                        data: { teamId: contract.assignedManagerId },
                    });
                    const openCount = await this.prisma.bordereau.count({ where: { teamId: contract.assignedManagerId, statut: { not: 'CLOTURE' } } });
                    const threshold = contract.escalationThreshold || 50;
                    if (openCount > threshold) {
                        await this.notificationService.notify('team_overload', { teamId: contract.assignedManagerId, bordereauId: bordereau.id });
                    }
                }
            }
            await this.notificationService.notify('document_uploaded', { document: doc, user: null });
            this.logger.log(`Imported and triggered workflow for: ${destPath}`);
        }
        catch (err) {
            this.logger.error(`Error importing file: ${filePath}`, err);
            await this.logAction('ERROR', filePath, err?.message || String(err));
        }
    }
    async computeFileHash(filePath) {
        return new Promise((resolve, reject) => {
            const hash = crypto.createHash('sha256');
            const stream = fs.createReadStream(filePath);
            stream.on('data', (data) => hash.update(data));
            stream.on('end', () => resolve(hash.digest('hex')));
            stream.on('error', reject);
        });
    }
    async logAction(action, filePath, details) {
        await this.prisma.auditLog.create({
            data: {
                userId: null,
                action: `PAPERSTREAM_${action}`,
                details: { filePath, details },
                timestamp: new Date(),
            },
        });
    }
};
exports.PaperStreamWatcherService = PaperStreamWatcherService;
exports.PaperStreamWatcherService = PaperStreamWatcherService = PaperStreamWatcherService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService,
        ocr_service_1.OcrService])
], PaperStreamWatcherService);
//# sourceMappingURL=paperstream-watcher.service.js.map