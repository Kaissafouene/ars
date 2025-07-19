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
var GecService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GecService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ged_service_1 = require("../ged/ged.service");
const outlook_service_1 = require("../integrations/outlook.service");
const template_service_1 = require("./template.service");
let GecService = GecService_1 = class GecService {
    prisma;
    gedService;
    outlookService;
    templateService;
    logger = new common_1.Logger(GecService_1.name);
    constructor(prisma, gedService, outlookService, templateService) {
        this.prisma = prisma;
        this.gedService = gedService;
        this.outlookService = outlookService;
        this.templateService = templateService;
    }
    async createCourrier(dto, user) {
        if (!['GESTIONNAIRE', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
            throw new common_1.ForbiddenException('You do not have permission to create courriers');
        }
        const created = await this.prisma.courrier.create({
            data: {
                ...dto,
                status: 'DRAFT',
                uploadedById: user.id,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'CREATE_COURRIER',
                details: { dto },
            },
        });
        return created;
    }
    async sendCourrier(id, dto, user) {
        const courrier = await this.prisma.courrier.findUnique({ where: { id } });
        if (!courrier)
            throw new common_1.NotFoundException('Courrier not found');
        if (courrier.status !== 'DRAFT')
            throw new common_1.ForbiddenException('Only DRAFT courriers can be sent');
        let subject = courrier.subject;
        let body = courrier.body;
        if (courrier.templateUsed) {
            try {
                const tpl = this.templateService.getTemplate(courrier.templateUsed);
                const variables = { subject: courrier.subject, ...dto };
                subject = this.templateService.renderTemplate((await tpl).subject, variables);
                body = this.templateService.renderTemplate((await tpl).body, variables);
            }
            catch (e) {
                this.logger.warn(`Template not found: ${courrier.templateUsed}`);
            }
        }
        if (dto.recipientEmail) {
            await this.outlookService.sendMail(dto.recipientEmail, subject, body);
        }
        this.logger.log(`Sending courrier to ${dto.recipientEmail || 'N/A'}: ${subject}`);
        await this.gedService.uploadDocument({
            originalname: courrier.subject + '.txt',
            path: `archived_courriers/${courrier.id}.txt`,
        }, {
            name: courrier.subject,
            type: 'courrier',
            bordereauId: courrier.bordereauId ?? undefined,
        }, user);
        const updated = await this.prisma.courrier.update({
            where: { id },
            data: {
                status: 'SENT',
                sentAt: new Date(),
            },
        });
        await this.prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'SEND_COURRIER',
                details: { courrierId: id, recipientEmail: dto.recipientEmail },
            },
        });
        return updated;
    }
    async searchCourriers(query, user) {
        const where = {};
        if (query.type)
            where.type = query.type;
        if (query.status)
            where.status = query.status;
        if (query.bordereauId)
            where.bordereauId = query.bordereauId;
        if (query.createdAfter || query.createdBefore) {
            where.createdAt = {};
            if (query.createdAfter)
                where.createdAt.gte = new Date(query.createdAfter);
            if (query.createdBefore)
                where.createdAt.lte = new Date(query.createdBefore);
        }
        if (user.role === 'GESTIONNAIRE') {
            where.uploadedById = user.id;
        }
        return this.prisma.courrier.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    async getCourrierById(id, user) {
        const courrier = await this.prisma.courrier.findUnique({ where: { id } });
        if (!courrier)
            throw new common_1.NotFoundException('Courrier not found');
        if (user.role === 'GESTIONNAIRE' && courrier.uploadedById !== user.id) {
            throw new common_1.ForbiddenException('You do not have access to this courrier');
        }
        return courrier;
    }
    async updateCourrierStatus(id, dto, user) {
        const courrier = await this.prisma.courrier.findUnique({ where: { id } });
        if (!courrier)
            throw new common_1.NotFoundException('Courrier not found');
        if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role) &&
            courrier.uploadedById !== user.id) {
            throw new common_1.ForbiddenException('You do not have permission to update this courrier');
        }
        const updated = await this.prisma.courrier.update({
            where: { id },
            data: {
                status: dto.status,
                responseAt: dto.status === 'RESPONDED' ? new Date() : undefined,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'UPDATE_COURRIER_STATUS',
                details: { courrierId: id, newStatus: dto.status },
            },
        });
        return updated;
    }
    async deleteCourrier(id, user) {
        const courrier = await this.prisma.courrier.findUnique({ where: { id } });
        if (!courrier)
            throw new common_1.NotFoundException('Courrier not found');
        if (courrier.status !== 'DRAFT')
            throw new common_1.ForbiddenException('Only DRAFT courriers can be deleted');
        if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role) &&
            courrier.uploadedById !== user.id) {
            throw new common_1.ForbiddenException('You do not have permission to delete this courrier');
        }
        const deleted = await this.prisma.courrier.delete({ where: { id } });
        await this.prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'DELETE_COURRIER',
                details: { courrierId: id },
            },
        });
        return deleted;
    }
    renderTemplate(body, variables) {
        return body.replace(/{{(\w+)}}/g, (_, key) => variables[key] || '');
    }
    async triggerRelances() {
        const pending = await this.prisma.courrier.findMany({
            where: {
                type: 'RELANCE',
                status: 'PENDING_RESPONSE',
                sentAt: { lte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
            },
        });
        for (const courrier of pending) {
            this.logger.warn(`Relance overdue for courrier ${courrier.id}`);
            const uploader = await this.prisma.user.findUnique({ where: { id: courrier.uploadedById } });
            if (uploader && uploader.email) {
                await this.outlookService.sendMail(uploader.email, `Relance overdue for courrier ${courrier.subject}`, `The courrier with subject "${courrier.subject}" is overdue for response.`);
            }
        }
        return pending.length;
    }
    async notify(type, message, email) {
        if (email) {
            await this.outlookService.sendMail(email, `[NOTIFY] ${type}`, message);
        }
        else {
            this.logger.log(`[NOTIFY] ${type}: ${message}`);
        }
    }
};
exports.GecService = GecService;
exports.GecService = GecService = GecService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ged_service_1.GedService,
        outlook_service_1.OutlookService,
        template_service_1.TemplateService])
], GecService);
//# sourceMappingURL=gec.service.js.map