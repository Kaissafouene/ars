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
exports.BulletinSoinService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const alerts_service_1 = require("../alerts/alerts.service");
const ocr_service_1 = require("../ocr/ocr.service");
let BulletinSoinService = class BulletinSoinService {
    prisma;
    alertsService;
    ocrService;
    constructor(prisma, alertsService, ocrService) {
        this.prisma = prisma;
        this.alertsService = alertsService;
        this.ocrService = ocrService;
    }
    async getPaymentStatus(bsId) {
        const bs = await this.prisma.bulletinSoin.findUnique({ where: { id: bsId }, include: { virement: true } });
        if (!bs)
            throw new common_1.NotFoundException('Bulletin de soin not found');
        if (!bs.virementId)
            return { status: 'UNPAID', virement: null };
        if (!bs.virement)
            return { status: 'UNPAID', virement: null };
        return {
            status: bs.virement.confirmed ? 'PAID' : 'PENDING',
            virement: bs.virement,
        };
    }
    async getBsForVirement(virementId) {
        return this.prisma.bulletinSoin.findMany({ where: { virementId, deletedAt: null } });
    }
    async markBsAsPaid(bsId) {
        return this.prisma.bulletinSoin.update({ where: { id: bsId }, data: { etat: 'PAID' } });
    }
    async reconcilePaymentsWithAccounting() {
        const localVirements = await this.prisma.virement.findMany({ include: { bordereau: true, confirmedBy: true } });
        const externalPayments = [];
        const matches = [];
        const unmatched = [];
        for (const v of localVirements) {
            const match = externalPayments.find(e => e.reference === v.referenceBancaire &&
                Math.abs(e.amount - v.montant) < 1 &&
                (!e.date || !v.dateExecution || new Date(e.date).toDateString() === v.dateExecution.toDateString()));
            if (match) {
                matches.push({ virement: v, external: match });
                match.matched = true;
            }
            else {
                unmatched.push(v);
            }
        }
        return {
            matched: matches,
            unmatched,
            externalUnmatched: externalPayments.filter(e => !e.matched),
        };
    }
    async exportBsListToExcel() {
        const bsList = await this.prisma.bulletinSoin.findMany({ where: { deletedAt: null } });
        return bsList;
    }
    async analyseCharge() {
        const gestionnaires = await this.prisma.user.findMany({ where: { role: 'gestionnaire' } });
        const stats = await Promise.all(gestionnaires.map(async (g) => {
            const inProgress = await this.prisma.bulletinSoin.count({ where: { ownerId: g.id, etat: { in: ['IN_PROGRESS', 'EN_COURS'] }, deletedAt: null } });
            let risk = 'LOW';
            if (inProgress > 10)
                risk = 'HIGH';
            else if (inProgress > 5)
                risk = 'MEDIUM';
            return { id: g.id, fullName: g.fullName, inProgress, risk };
        }));
        return stats;
    }
    async getBsWithReclamations() {
        const reclamations = await this.prisma.reclamation.findMany({ where: { bsId: { not: null } } });
        if (!reclamations.length || !('bsId' in reclamations[0]))
            return [];
        const bsIds = reclamations.map((r) => r.bsId).filter(Boolean);
        if (bsIds.length === 0)
            return [];
        const bsList = await this.prisma.bulletinSoin.findMany({ where: { id: { in: bsIds }, deletedAt: null } });
        return bsList.map(bs => ({ ...bs, reclamations: reclamations.filter((r) => r.bsId === bs.id) }));
    }
    async calculateDueDate(dateCreation, contractId) {
        let days = 5;
        if (contractId) {
            const contract = await this.prisma.contract.findUnique({ where: { id: contractId } });
            if (contract && contract.delaiReglement)
                days = contract.delaiReglement;
        }
        if (!dateCreation)
            throw new Error('dateCreation is required');
        return new Date(dateCreation.getTime() + days * 24 * 60 * 60 * 1000);
    }
    async suggestRebalancing() {
        const stats = await this.analyseCharge();
        const overloaded = stats.filter(s => s.risk === 'HIGH');
        const underloaded = stats.filter(s => s.risk === 'LOW');
        const suggestions = [];
        for (const over of overloaded) {
            const bsToMove = await this.prisma.bulletinSoin.findFirst({
                where: { ownerId: over.id, etat: { in: ['IN_PROGRESS', 'EN_COURS'] }, deletedAt: null },
                orderBy: { dateCreation: 'asc' },
            });
            if (bsToMove && underloaded.length > 0) {
                suggestions.push({ bsId: bsToMove.id, from: over.id, to: underloaded[0].id });
            }
        }
        return suggestions;
    }
    async estimateEscalationRisk(bsId) {
        const bs = await this.prisma.bulletinSoin.findUnique({ where: { id: bsId } });
        if (!bs)
            return { risk: 'UNKNOWN' };
        const now = new Date();
        if (bs.dueDate && bs.dueDate < now)
            return { risk: 'HIGH' };
        if (bs.dueDate && bs.dueDate < new Date(now.getTime() + 24 * 60 * 60 * 1000))
            return { risk: 'MEDIUM' };
        return { risk: 'LOW' };
    }
    async sendNotification({ to, subject, text, }) {
        if (this.outlookService) {
            return this.outlookService.sendMail(to, subject, text);
        }
        console.log(`[NOTIFY] To: ${to} | Subject: ${subject} | Text: ${text}`);
        return Promise.resolve();
    }
    async notifySlaAlerts() {
        const { overdue, approaching } = await this.getSlaAlerts();
        const gestionnaires = await this.prisma.user.findMany({ where: { role: 'gestionnaire' } });
        for (const g of gestionnaires) {
            const myOverdue = overdue.filter(bs => bs.ownerId === g.id);
            const myApproaching = approaching.filter(bs => bs.ownerId === g.id);
            if (myOverdue.length > 0 || myApproaching.length > 0) {
                await this.sendNotification({
                    to: g.email,
                    subject: 'Alerte SLA Bulletin de Soin',
                    text: `Vous avez ${myOverdue.length} BS en retard et ${myApproaching.length} BS proches de la date limite.`,
                });
            }
        }
    }
    async notifyAssignment(bsId, userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user) {
            await this.sendNotification({
                to: user.email,
                subject: 'Nouveau Bulletin de Soin Assigné',
                text: `Un nouveau BS vous a été assigné (ID: ${bsId}).`,
            });
        }
    }
    async notifyOverload(gestionnaireId, riskLevel) {
        const user = await this.prisma.user.findUnique({ where: { id: gestionnaireId } });
        if (user) {
            await this.sendNotification({
                to: user.email,
                subject: 'Risque de surcharge',
                text: `Votre charge de travail est actuellement : ${riskLevel}`,
            });
        }
    }
    async create(dto) {
        let ownerId = dto.ownerId ? String(dto.ownerId) : undefined;
        if (!ownerId) {
            const gestionnaires = await this.prisma.user.findMany({ where: { role: 'gestionnaire' } });
            let minCount = Number.POSITIVE_INFINITY;
            let selected = undefined;
            for (const g of gestionnaires) {
                const count = await this.prisma.bulletinSoin.count({ where: { ownerId: g.id, etat: { in: ['IN_PROGRESS', 'EN_COURS'] }, deletedAt: null } });
                if (count < minCount) {
                    minCount = count;
                    selected = g.id;
                }
            }
            ownerId = selected;
        }
        const dueDate = dto.dateCreation ? new Date(new Date(dto.dateCreation).getTime() + 5 * 24 * 60 * 60 * 1000) : undefined;
        const created = await this.prisma.bulletinSoin.create({
            data: {
                ...dto,
                ownerId: ownerId ?? undefined,
                dueDate,
                items: {
                    create: dto.items?.map(item => ({
                        ...item,
                    })),
                },
            },
            include: { items: true, expertises: true, logs: true },
        });
        await this.alertsService.triggerAlert({ type: 'NEW_BS', bsId: created.id });
        return created;
    }
    async findAll(query, user) {
        const { page = 1, limit = 20, etat, ownerId, bordereauId, search } = query;
        const where = { deletedAt: null };
        if (user.role === 'gestionnaire') {
            where.ownerId = user.id;
        }
        else if (user.role === 'chef') {
        }
        if (etat)
            where.etat = etat;
        if (ownerId)
            where.ownerId = ownerId;
        if (bordereauId)
            where.bordereauId = bordereauId;
        if (search) {
            where.OR = [
                { numBs: { contains: search, mode: 'insensitive' } },
                { nomAssure: { contains: search, mode: 'insensitive' } },
                { nomBeneficiaire: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [items, total] = await Promise.all([
            this.prisma.bulletinSoin.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                include: { items: true, expertises: true, logs: true },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.bulletinSoin.count({ where }),
        ]);
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id, user) {
        const bs = await this.prisma.bulletinSoin.findUnique({
            where: { id: String(id) },
            include: { items: true, expertises: true, logs: true },
        });
        if (!bs || bs.deletedAt)
            throw new common_1.NotFoundException('Bulletin de soin not found');
        if (user.role === 'gestionnaire' && bs.ownerId !== user.id) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return bs;
    }
    async update(id, dto, user) {
        const bs = await this.prisma.bulletinSoin.findUnique({ where: { id: String(id) } });
        if (!bs || bs.deletedAt)
            throw new common_1.NotFoundException('Bulletin de soin not found');
        const updateData = {
            ...dto,
            ownerId: dto.ownerId ?? undefined,
        };
        if (dto.etat && ['VALIDATED', 'REJECTED'].includes(dto.etat)) {
            updateData.processedById = user.id;
            updateData.processedAt = new Date();
        }
        if (dto.virementId) {
            updateData.virementId = dto.virementId;
        }
        return this.prisma.bulletinSoin.update({
            where: { id: String(id) },
            data: updateData,
            include: { items: true, expertises: true, logs: true },
        });
    }
    async remove(id, user) {
        const bs = await this.prisma.bulletinSoin.findUnique({ where: { id: String(id) } });
        if (!bs || bs.deletedAt)
            throw new common_1.NotFoundException('Bulletin de soin not found');
        if (user.role === 'gestionnaire' && bs.ownerId !== user.id) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.bulletinSoin.update({
            where: { id: String(id) },
            data: { deletedAt: new Date(), etat: 'DELETED' },
        });
    }
    async assign(id, dto, user) {
        const bs = await this.prisma.bulletinSoin.findUnique({ where: { id: String(id) } });
        if (!bs || bs.deletedAt)
            throw new common_1.NotFoundException('Bulletin de soin not found');
        return this.prisma.bulletinSoin.update({
            where: { id: String(id) },
            data: { ownerId: dto.ownerId != null ? String(dto.ownerId) : undefined },
        });
    }
    async getOcr(id, user) {
        const bs = await this.prisma.bulletinSoin.findUnique({ where: { id: String(id) } });
        if (!bs || bs.deletedAt)
            throw new common_1.NotFoundException('Bulletin de soin not found');
        return { ocrText: await this.ocrService.extractText(bs.lien) };
    }
    async getOcrText(bulletinSoinId) {
        const bs = await this.prisma.bulletinSoin.findUnique({ where: { id: String(bulletinSoinId) } });
        if (!bs || bs.deletedAt)
            throw new common_1.NotFoundException('Bulletin de soin not found');
        const ocrResult = await this.ocrService.extractText(bs.lien);
        return typeof ocrResult === 'string' ? ocrResult : '';
    }
    async getExpertise(id, user) {
        const bs = await this.prisma.bulletinSoin.findUnique({
            where: { id: String(id) },
            include: { expertises: true },
        });
        if (!bs || bs.deletedAt)
            throw new common_1.NotFoundException('Bulletin de soin not found');
        return bs.expertises;
    }
    async upsertExpertise(p0, dto, bsId, expertiseData) {
        let dents = undefined;
        if (Array.isArray(expertiseData.dents)) {
            dents = JSON.stringify(expertiseData.dents);
        }
        else if (typeof expertiseData.dents === 'string') {
            dents = expertiseData.dents;
        }
        const { id, ...updateData } = expertiseData;
        return this.prisma.expertiseInfo.upsert({
            where: { id: expertiseData.id != null ? String(expertiseData.id) : undefined },
            update: { ...updateData, dents },
            create: {
                ...updateData,
                bulletinSoinId: String(bsId),
                dents,
                id: expertiseData.id != null ? String(expertiseData.id) : undefined,
            },
        });
    }
    async getLogs(id, user) {
        const bs = await this.prisma.bulletinSoin.findUnique({
            where: { id: String(id) },
            include: { logs: true },
        });
        if (!bs || bs.deletedAt)
            throw new common_1.NotFoundException('Bulletin de soin not found');
        return bs.logs;
    }
    async addLog(id, dto, user) {
        const bs = await this.prisma.bulletinSoin.findUnique({ where: { id: String(id) } });
        if (!bs || bs.deletedAt)
            throw new common_1.NotFoundException('Bulletin de soin not found');
        return this.prisma.bSLog.create({
            data: {
                bsId: String(id),
                userId: user.id,
                action: dto.action,
                timestamp: new Date(),
            },
        });
    }
    async softDelete(id) {
        return this.prisma.bulletinSoin.update({
            where: { id: String(id) },
            data: { deletedAt: new Date(), etat: 'DELETED' },
        });
    }
    async getPerformanceMetrics({ start, end }) {
        const results = await this.prisma.bulletinSoin.groupBy({
            by: ['processedById'],
            where: {
                processedAt: { gte: start, lte: end },
                deletedAt: null,
            },
            _count: { id: true },
        });
        return results;
    }
    async getSlaAlerts() {
        const now = new Date();
        const soon = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const overdue = await this.prisma.bulletinSoin.findMany({
            where: {
                dueDate: { lt: now },
                etat: { not: 'VALIDATED' },
                deletedAt: null,
            },
        });
        const approaching = await this.prisma.bulletinSoin.findMany({
            where: {
                dueDate: { gte: now, lt: soon },
                etat: { not: 'VALIDATED' },
                deletedAt: null,
            },
        });
        return { overdue, approaching };
    }
    async suggestAssignment() {
        const gestionnaires = await this.prisma.user.findMany({ where: { role: 'gestionnaire' } });
        const stats = await Promise.all(gestionnaires.map(async (g) => {
            const inProgress = await this.prisma.bulletinSoin.count({ where: { ownerId: g.id, etat: { in: ['IN_PROGRESS', 'EN_COURS'] }, deletedAt: null } });
            const overdue = await this.prisma.bulletinSoin.count({ where: { ownerId: g.id, dueDate: { lt: new Date() }, etat: { not: 'VALIDATED' }, deletedAt: null } });
            const processed = await this.prisma.bulletinSoin.findMany({ where: { processedById: g.id, processedAt: { not: null }, deletedAt: null } });
            const avgTime = processed.length > 0 ? processed.reduce((sum, bs) => {
                const processedAt = bs.processedAt ? new Date(bs.processedAt) : null;
                const dateCreation = bs.dateCreation ? new Date(bs.dateCreation) : null;
                if (!processedAt || !dateCreation)
                    return sum;
                return sum + ((processedAt.getTime() - dateCreation.getTime()) / 1000 / 60 / 60);
            }, 0) / processed.length : null;
            const score = (inProgress * 2) + (overdue * 3) + (avgTime ?? 10);
            return { id: g.id, fullName: g.fullName, inProgress, overdue, avgProcessingHours: avgTime, score };
        }));
        stats.sort((a, b) => a.score - b.score);
        return stats;
    }
    async suggestPriorities(gestionnaireId) {
        const bsList = await this.prisma.bulletinSoin.findMany({
            where: { ownerId: gestionnaireId, etat: { not: 'VALIDATED' }, deletedAt: null },
            orderBy: { dueDate: 'asc' },
        });
        return bsList;
    }
};
exports.BulletinSoinService = BulletinSoinService;
exports.BulletinSoinService = BulletinSoinService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        alerts_service_1.AlertsService,
        ocr_service_1.OcrService])
], BulletinSoinService);
//# sourceMappingURL=bulletin-soin.service.js.map