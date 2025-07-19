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
exports.TraitementService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ExcelJS = require("exceljs");
const path = require("path");
let TraitementService = class TraitementService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    checkRole(user, action = 'view') {
        if (user.role === 'SUPER_ADMIN')
            return;
        if (user.role === 'CHEF_EQUIPE' && ['view', 'assign', 'update'].includes(action))
            return;
        if (user.role === 'GESTIONNAIRE' && ['view', 'update'].includes(action))
            return;
        if (user.role === 'SCAN' && action === 'view')
            return;
        if (user.role === 'BO' && action === 'view')
            return;
        throw new common_1.ForbiddenException('Access denied');
    }
    async globalInbox(query, user) {
        this.checkRole(user, 'view');
        const where = {};
        if (query.statut)
            where.statut = query.statut;
        if (query.teamId)
            where.teamId = query.teamId;
        const take = query.take || 20;
        const skip = query.skip || 0;
        const orderBy = query.orderBy
            ? { [query.orderBy]: 'desc' }
            : { createdAt: 'desc' };
        return this.prisma.bordereau.findMany({
            where,
            orderBy,
            take,
            skip,
            include: { currentHandler: true, team: true },
        });
    }
    async personalInbox(user, query) {
        this.checkRole(user, 'view');
        const where = { currentHandlerId: user.id };
        if (query.statut)
            where.statut = query.statut;
        const take = query.take || 20;
        const skip = query.skip || 0;
        const orderBy = query.orderBy ? { [query.orderBy]: 'desc' } : { createdAt: 'desc' };
        return this.prisma.bordereau.findMany({
            where,
            orderBy,
            take,
            skip,
            include: { currentHandler: true, team: true },
        });
    }
    async assignTraitement(dto, user) {
        this.checkRole(user, 'assign');
        const bordereau = await this.prisma.bordereau.update({
            where: { id: dto.bordereauId },
            data: { currentHandlerId: dto.assignedToId, statut: 'ASSIGNE' },
        });
        await this.prisma.traitementHistory.create({
            data: {
                bordereauId: dto.bordereauId,
                userId: user.id,
                action: 'ASSIGN',
                toStatus: 'ASSIGNE',
                assignedToId: dto.assignedToId,
            },
        });
        return bordereau;
    }
    async updateStatus(dto, user) {
        this.checkRole(user, 'update');
        const old = await this.prisma.bordereau.findUnique({ where: { id: dto.bordereauId } });
        if (!old)
            throw new common_1.NotFoundException('Bordereau not found');
        const bordereau = await this.prisma.bordereau.update({
            where: { id: dto.bordereauId },
            data: { statut: dto.statut },
        });
        await this.prisma.traitementHistory.create({
            data: {
                bordereauId: dto.bordereauId,
                userId: user.id,
                action: 'STATUS_UPDATE',
                fromStatus: old.statut,
                toStatus: dto.statut,
            },
        });
        return bordereau;
    }
    async kpi(user) {
        this.checkRole(user, 'view');
        const total = await this.prisma.bordereau.count();
        const traite = await this.prisma.bordereau.count({ where: { statut: 'TRAITE' } });
        const enDifficulte = await this.prisma.bordereau.count({ where: { statut: 'EN_DIFFICULTE' } });
        const avgDelay = await this.prisma.bordereau.aggregate({ _avg: { delaiReglement: true } });
        return { total, traite, enDifficulte, avgDelay: avgDelay._avg.delaiReglement };
    }
    async aiRecommendations(user) {
        this.checkRole(user, 'view');
        const enDifficulte = await this.prisma.bordereau.count({ where: { statut: 'EN_DIFFICULTE' } });
        let recommendation = 'All OK';
        if (enDifficulte > 10)
            recommendation = 'Reallocate workload, team is overloaded';
        return { enDifficulte, recommendation };
    }
    async exportStats(user) {
        this.checkRole(user, 'export');
        const stats = await this.kpi(user);
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Traitement Stats');
        sheet.columns = [
            { header: 'Total', key: 'total', width: 10 },
            { header: 'Traités', key: 'traite', width: 10 },
            { header: 'En Difficulté', key: 'enDifficulte', width: 15 },
            { header: 'Délai Moyen', key: 'avgDelay', width: 15 },
        ];
        sheet.addRow(stats);
        const filePath = path.join('exports', `traitement_stats_${Date.now()}.xlsx`);
        await workbook.xlsx.writeFile(filePath);
        return { filePath };
    }
    async exportStatsPdf(user) {
        this.checkRole(user, 'export');
        const stats = await this.kpi(user);
        const PDFDocument = require('pdfkit');
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join('exports', `traitement_stats_${Date.now()}.pdf`);
        if (!fs.existsSync('exports')) {
            fs.mkdirSync('exports', { recursive: true });
        }
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        const ws = fs.createWriteStream(filePath);
        doc.pipe(ws);
        doc.fontSize(18).text('Traitement Stats', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12);
        doc.text(`Total: ${stats.total}`);
        doc.text(`Traités: ${stats.traite}`);
        doc.text(`En Difficulté: ${stats.enDifficulte}`);
        doc.text(`Délai Moyen: ${stats.avgDelay}`);
        doc.end();
        await new Promise((resolve, reject) => {
            ws.on('finish', resolve);
            ws.on('error', reject);
        });
        return { filePath };
    }
    async history(bordereauId, user) {
        this.checkRole(user, 'view');
        return this.prisma.traitementHistory.findMany({
            where: { bordereauId },
            orderBy: { createdAt: 'asc' },
            include: { user: true, assignedTo: true },
        });
    }
    async exportHistoryExcel(bordereauId, user) {
        this.checkRole(user, 'export');
        const history = await this.history(bordereauId, user);
        const ExcelJS = require('exceljs');
        const path = require('path');
        const fs = require('fs');
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Historique');
        sheet.columns = [
            { header: 'Date', key: 'createdAt', width: 20 },
            { header: 'Action', key: 'action', width: 20 },
            { header: 'Utilisateur', key: 'user', width: 20 },
            { header: 'Statut', key: 'toStatus', width: 20 },
            { header: 'Assigné à', key: 'assignedTo', width: 20 },
        ];
        for (const h of history) {
            sheet.addRow({
                createdAt: h.createdAt ? new Date(h.createdAt).toLocaleString() : '',
                action: h.action,
                user: h.user ? h.user.fullName || h.user.id : '',
                toStatus: h.toStatus,
                assignedTo: h.assignedTo ? h.assignedTo.fullName || h.assignedTo.id : '',
            });
        }
        if (!fs.existsSync('exports')) {
            fs.mkdirSync('exports', { recursive: true });
        }
        const filePath = path.join('exports', `traitement_history_${bordereauId}_${Date.now()}.xlsx`);
        await workbook.xlsx.writeFile(filePath);
        return { filePath };
    }
    async exportHistoryPdf(bordereauId, user) {
        this.checkRole(user, 'export');
        const history = await this.history(bordereauId, user);
        const PDFDocument = require('pdfkit');
        const fs = require('fs');
        const path = require('path');
        if (!fs.existsSync('exports')) {
            fs.mkdirSync('exports', { recursive: true });
        }
        const filePath = path.join('exports', `traitement_history_${bordereauId}_${Date.now()}.pdf`);
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        const ws = fs.createWriteStream(filePath);
        doc.pipe(ws);
        doc.fontSize(18).text('Historique de Traitement', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12);
        for (const h of history) {
            doc.text(`Date: ${h.createdAt ? new Date(h.createdAt).toLocaleString() : ''}`);
            doc.text(`Action: ${h.action}`);
            doc.text(`Utilisateur: ${h.user ? h.user.fullName || h.user.id : ''}`);
            doc.text(`Statut: ${h.toStatus}`);
            doc.text(`Assigné à: ${h.assignedTo ? h.assignedTo.fullName || h.assignedTo.id : ''}`);
            doc.moveDown(0.5);
        }
        doc.end();
        await new Promise((resolve, reject) => {
            ws.on('finish', resolve);
            ws.on('error', reject);
        });
        return { filePath };
    }
};
exports.TraitementService = TraitementService;
exports.TraitementService = TraitementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TraitementService);
//# sourceMappingURL=traitement.service.js.map