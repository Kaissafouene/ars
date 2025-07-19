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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GedService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const fs = require("fs");
const path = require("path");
const notification_service_1 = require("./notification.service");
let GedService = class GedService {
    prisma;
    notificationService;
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async getSlaBreaches(user) {
        if (!['SUPER_ADMIN', 'CHEF_EQUIPE', 'ADMINISTRATEUR'].includes(user.role)) {
            throw new common_1.ForbiddenException('You do not have permission to view SLA breaches');
        }
        const thresholdHours = 48;
        const thresholdDate = new Date(Date.now() - thresholdHours * 60 * 60 * 1000);
        const docs = await this.prisma.document.findMany({
            where: {
                uploadedAt: { lte: thresholdDate },
                OR: [
                    { status: { not: 'EN_COURS' } },
                    { status: null },
                ],
            },
            orderBy: { uploadedAt: 'asc' },
        });
        return docs;
    }
    async getSlaStatus(user) {
        if (!['SUPER_ADMIN', 'CHEF_EQUIPE', 'ADMINISTRATEUR'].includes(user.role)) {
            throw new common_1.ForbiddenException('You do not have permission to view SLA status');
        }
        const warningHours = 36;
        const breachHours = 48;
        const now = new Date();
        const docs = await this.prisma.document.findMany({
            orderBy: { uploadedAt: 'asc' },
        });
        if (!docs.length)
            return [];
        return docs.map(doc => {
            const hours = (now.getTime() - doc.uploadedAt.getTime()) / (1000 * 60 * 60);
            let slaStatus = 'green';
            if (doc.status !== 'EN_COURS') {
                if (hours >= breachHours)
                    slaStatus = 'red';
                else if (hours >= warningHours)
                    slaStatus = 'orange';
            }
            return { ...doc, slaStatus };
        });
    }
    async getDocumentAudit(id, user) {
        await this.getDocumentById(id, user);
        return this.prisma.auditLog.findMany({
            where: { details: { path: ['documentId'], equals: id } },
            orderBy: { timestamp: 'asc' },
        });
    }
    async assignDocument(id, body, user) {
        if (!['CHEF_EQUIPE', 'SUPER_ADMIN'].includes(user.role)) {
            throw new common_1.ForbiddenException('You do not have permission to assign documents');
        }
        let assignedToUserId = body.assignedToUserId;
        if (!assignedToUserId) {
            const eligible = await this.prisma.user.findMany({
                where: {
                    role: { in: ['SCAN_TEAM', 'GESTIONNAIRE'] },
                    active: true,
                },
            });
            if (eligible.length === 0)
                throw new common_1.ForbiddenException('No eligible users for auto-assignment.');
            const workloads = await Promise.all(eligible.map(async (user) => {
                const count = await this.prisma.document.count({
                    where: { uploadedById: user.id, status: { not: 'EN_COURS' } },
                });
                return { user, count };
            }));
            workloads.sort((a, b) => a.count - b.count);
            assignedToUserId = workloads[0].user.id;
        }
        const doc = await this.prisma.document.update({
            where: { id },
            data: {
                uploadedById: assignedToUserId,
                ...(body.teamId && { teamId: body.teamId }),
            },
        });
        try {
            await this.prisma.auditLog.create({
                data: {
                    userId: user.id,
                    action: 'ASSIGN_DOCUMENT',
                    details: { documentId: id, assignedToUserId, ...body },
                },
            });
        }
        catch (e) {
            console.log(`[AUDIT] Document assigned: ${id} by ${user.id}`);
        }
        await this.notificationService.notify('document_assigned', { document: doc, user, assignedToUserId, ...body });
        return doc;
    }
    async getDocumentStats(user) {
        if (!['SUPER_ADMIN', 'CHEF_EQUIPE'].includes(user.role)) {
            throw new common_1.ForbiddenException('You do not have permission to view stats');
        }
        const total = await this.prisma.document.count();
        const byType = await this.prisma.document.groupBy({
            by: ['type'],
            _count: { type: true },
        });
        const recent = await this.prisma.document.findMany({
            orderBy: { uploadedAt: 'desc' },
            take: 10,
            select: { id: true, name: true, type: true, uploadedAt: true },
        });
        return { total, byType, recent };
    }
    async updateDocumentStatus(id, status, user) {
        if (!['SCAN_TEAM', 'CHEF_EQUIPE', 'SUPER_ADMIN'].includes(user.role)) {
            throw new common_1.ForbiddenException('You do not have permission to update document status');
        }
        let doc;
        try {
            doc = await this.prisma.document.update({
                where: { id },
                data: { status: status },
            });
        }
        catch (err) {
            doc = await this.prisma.document.findUnique({ where: { id } });
            console.warn('[WARN] Document.status field does not exist in schema. Status not updated.');
        }
        try {
            await this.prisma.auditLog.create({
                data: {
                    userId: user.id,
                    action: 'UPDATE_DOCUMENT_STATUS',
                    details: { documentId: id, newStatus: status },
                },
            });
        }
        catch (e) {
            console.log(`[AUDIT] Document status updated: ${id} to ${status} by ${user.id}`);
        }
        await this.notificationService.notify('document_status_updated', { document: doc, user, status });
        return doc;
    }
    async uploadDocument(file, dto, user) {
        try {
            if (!['SCAN_TEAM', 'CHEF_EQUIPE', 'SUPER_ADMIN'].includes(user.role)) {
                throw new common_1.ForbiddenException('You do not have permission to upload documents');
            }
            if (!user || !user.id) {
                throw new common_1.ForbiddenException('Authenticated user not found or missing user ID');
            }
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
            if (!allowedTypes.includes(file.mimetype)) {
                throw new common_1.ForbiddenException('File type not allowed.');
            }
            if (file.size > 10 * 1024 * 1024) {
                throw new common_1.ForbiddenException('File size exceeds 10MB limit.');
            }
            if (dto.bordereauId) {
                const bordereau = await this.prisma.bordereau.findUnique({ where: { id: dto.bordereauId } });
                if (!bordereau)
                    throw new common_1.ForbiddenException('Linked bordereau does not exist.');
            }
            const doc = await this.prisma.document.create({
                data: {
                    name: dto.name,
                    type: dto.type,
                    path: file.path,
                    uploadedById: user.id,
                    bordereauId: dto.bordereauId,
                    status: 'UPLOADED',
                },
            });
            try {
                await this.prisma.auditLog.create({
                    data: {
                        userId: user.id,
                        action: 'UPLOAD_DOCUMENT',
                        details: { documentId: doc.id },
                    },
                });
            }
            catch (e) {
                console.log(`[AUDIT] Document uploaded: ${doc.id} by ${user.id}`);
            }
            await this.notificationService.notify('document_uploaded', { document: doc, user });
            return doc;
        }
        catch (err) {
            console.error('Upload error:', err);
            throw new Error('File upload failed: ' + (err?.message || err));
        }
    }
    async searchDocuments(query, user) {
        const where = {};
        if (query.type)
            where.type = query.type;
        if (query.uploadedAfter || query.uploadedBefore) {
            where.uploadedAt = {};
            if (query.uploadedAfter)
                where.uploadedAt.gte = new Date(query.uploadedAfter);
            if (query.uploadedBefore)
                where.uploadedAt.lte = new Date(query.uploadedBefore);
        }
        if (query.bordereauReference) {
            where.bordereau = { reference: query.bordereauReference };
        }
        if (query.clientName) {
            where.bordereau = { ...where.bordereau, client: { name: { contains: query.clientName, mode: 'insensitive' } } };
        }
        if (query.prestataire) {
            where.bordereau = { ...where.bordereau, prestataire: { name: { contains: query.prestataire, mode: 'insensitive' } } };
        }
        if (user.role === 'GESTIONNAIRE') {
            where.bordereau = { ...where.bordereau, clientId: user.id };
        }
        if (query.keywords) {
            where.OR = [
                { name: { contains: query.keywords, mode: 'insensitive' } },
                { type: { contains: query.keywords, mode: 'insensitive' } },
                { ocrText: { contains: query.keywords, mode: 'insensitive' } },
            ];
        }
        return this.prisma.document.findMany({
            where,
            include: { bordereau: { include: { client: true, prestataire: true } }, uploader: true },
            orderBy: { uploadedAt: 'desc' },
        });
    }
    async getDocumentById(id, user) {
        const doc = await this.prisma.document.findUnique({
            where: { id },
            include: { bordereau: true, uploader: true },
        });
        if (!doc)
            throw new common_1.NotFoundException('Document not found');
        if (user.role === 'GESTIONNAIRE' && doc.bordereau?.clientId !== user.id) {
            throw new common_1.ForbiddenException('You do not have access to this document');
        }
        return doc;
    }
    async tagDocument(id, tags, user) {
        if (!['CHEF_EQUIPE', 'SUPER_ADMIN'].includes(user.role)) {
            throw new common_1.ForbiddenException('You do not have permission to tag documents');
        }
        const doc = await this.prisma.document.update({
            where: { id },
            data: {
                type: tags.type,
                bordereauId: tags.bordereauId,
            },
        });
        try {
            await this.prisma.auditLog.create({
                data: {
                    userId: user.id,
                    action: 'TAG_DOCUMENT',
                    details: { documentId: id, tags },
                },
            });
        }
        catch (e) {
            console.log(`[AUDIT] Document tagged: ${id} by ${user.id}`);
        }
        await this.notificationService.notify('document_tagged', { document: doc, user });
        return doc;
    }
    async deleteDocument(id, user) {
        if (user.role !== 'SUPER_ADMIN') {
            throw new common_1.ForbiddenException('Only Super Admin can delete documents');
        }
        const doc = await this.prisma.document.findUnique({ where: { id } });
        if (!doc)
            throw new common_1.NotFoundException('Document not found');
        if (doc.path) {
            try {
                fs.unlinkSync(path.resolve(doc.path));
            }
            catch (err) {
                console.error(`[WARN] Failed to delete file from disk: ${doc.path}`);
            }
        }
        try {
            await this.prisma.auditLog.create({
                data: {
                    userId: user.id,
                    action: 'DELETE_DOCUMENT',
                    details: { documentId: id },
                },
            });
        }
        catch (e) {
            console.log(`[AUDIT] Document deleted: ${id} by ${user.id}`);
        }
        await this.notificationService.notify('document_deleted', { document: doc, user });
        return this.prisma.document.delete({ where: { id } });
    }
};
exports.GedService = GedService;
exports.GedService = GedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], GedService);
//# sourceMappingURL=ged.service.js.map