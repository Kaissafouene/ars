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
exports.WireTransferService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let WireTransferService = class WireTransferService {
    prisma;
    async previewBatch(file, body) {
        if (!file || !file.buffer)
            throw new common_1.BadRequestException('No file uploaded');
        const content = file.buffer.toString('utf-8');
        const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length === 0)
            throw new common_1.BadRequestException('File is empty');
        const transfers = [];
        const errors = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            try {
                const code = line.substring(0, 6).trim();
                const ref = line.substring(6, 20).trim();
                const amountStr = line.substring(32, 44).trim();
                const amount = parseFloat(amountStr) / 100;
                const rib = line.substring(56, 76).trim();
                const name = line.substring(110, 140).trim();
                if (!rib || isNaN(amount) || !name)
                    throw new Error('Invalid data');
                transfers.push({ code, ref, amount, rib, name });
            }
            catch (e) {
                errors.push({ line: i + 1, error: e.message });
            }
        }
        return { success: errors.length === 0, transfers, errors };
    }
    async uploadAndProcessBatch(file, body) {
        if (!file || !file.buffer)
            throw new common_1.BadRequestException('No file uploaded');
        const content = file.buffer.toString('utf-8');
        const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length === 0)
            throw new common_1.BadRequestException('File is empty');
        const transfers = [];
        const errors = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            try {
                const code = line.substring(0, 6).trim();
                const ref = line.substring(6, 20).trim();
                const amountStr = line.substring(32, 44).trim();
                const amount = parseFloat(amountStr) / 100;
                const rib = line.substring(56, 76).trim();
                const name = line.substring(110, 140).trim();
                if (!rib || isNaN(amount) || !name)
                    throw new Error('Invalid data');
                transfers.push({ code, ref, amount, rib, name });
            }
            catch (e) {
                errors.push({ line: i + 1, error: e.message });
            }
        }
        if (errors.length > 0) {
            return { success: false, errors };
        }
        const batch = await this.prisma.wireTransferBatch.create({
            data: {
                societyId: body.societyId,
                donneurId: body.donneurId,
                status: client_1.WireTransferBatchStatus.CREATED,
                fileName: file.originalname,
                fileType: 'TXT',
                archived: false,
                transfers: {
                    create: await Promise.all(transfers.map(async (t) => {
                        let member = await this.prisma.member.findFirst({ where: { rib: t.rib } });
                        let memberField;
                        if (member) {
                            memberField = { connect: { id: member.id } };
                        }
                        else {
                            memberField = { create: { name: t.name, rib: t.rib, societyId: body.societyId } };
                        }
                        return {
                            member: memberField,
                            donneur: { connect: { id: body.donneurId } },
                            donneurId: body.donneurId,
                            amount: t.amount,
                            reference: t.ref,
                            status: client_1.WireTransferBatchStatus.CREATED,
                        };
                    }))
                }
            },
            include: { transfers: true }
        });
        return { success: true, batch };
    }
    async generateBatchPdf(batchId) {
        const PDFDocument = require('pdfkit');
        const batch = await this.getBatch(batchId);
        const doc = new PDFDocument();
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.text(`Batch ID: ${batch.id}`);
        doc.text(`Society: ${batch.society?.name || ''}`);
        doc.text(`Donneur: ${batch.donneur?.name || ''}`);
        doc.text('Transfers:');
        batch.transfers.forEach((t, idx) => {
            doc.text(`${idx + 1}. ${t.member?.name || ''} | RIB: ${t.member?.rib || ''} | Amount: ${t.amount} | Ref: ${t.reference}`);
        });
        doc.end();
        return await new Promise((resolve) => {
            doc.on('end', () => resolve(Buffer.concat(buffers)));
        });
    }
    async generateBatchTxt(batchId) {
        const batch = await this.getBatch(batchId);
        const lines = batch.transfers.map((t) => {
            const code = ("110104").padEnd(6, ' ');
            const ref = (t.reference || '').padEnd(14, ' ');
            const filler1 = ''.padEnd(12, ' ');
            const amount = (Math.round(t.amount * 100) + '').padStart(12, '0');
            const filler2 = ''.padEnd(12, ' ');
            const rib = (t.member?.rib || '').padEnd(20, ' ');
            const filler3 = ''.padEnd(34, ' ');
            const name = (t.member?.name || '').padEnd(30, ' ');
            return `${code}${ref}${filler1}${amount}${filler2}${rib}${filler3}${name}`;
        });
        return Buffer.from(lines.join('\n'), 'utf-8');
    }
    async archiveBatch(batchId) {
        return this.prisma.wireTransferBatch.update({ where: { id: batchId }, data: { archived: true, status: client_1.WireTransferBatchStatus.ARCHIVED } });
    }
    async getDashboardStats() {
        const total = await this.prisma.wireTransferBatch.count();
        const archived = await this.prisma.wireTransferBatch.count({ where: { archived: true } });
        const processed = await this.prisma.wireTransferBatch.count({ where: { status: 'PROCESSED' } });
        const pending = await this.prisma.wireTransferBatch.count({ where: { status: client_1.WireTransferBatchStatus.CREATED } });
        return { total, archived, processed, pending };
    }
    async getDashboardAnalytics(query, user) {
        const where = {};
        if (query.companyId)
            where.societyId = query.companyId;
        if (query.state)
            where.status = query.state.toUpperCase();
        if (query.periodStart || query.periodEnd) {
            where.createdAt = {};
            if (query.periodStart)
                where.createdAt.gte = new Date(query.periodStart);
            if (query.periodEnd)
                where.createdAt.lte = new Date(query.periodEnd);
        }
        if (query.delayMin || query.delayMax) {
        }
        const batches = await this.prisma.wireTransferBatch.findMany({
            where,
            include: {
                society: true,
                donneur: true,
                transfers: true,
                history: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        const now = new Date();
        const analytics = batches.map(batch => {
            const delayHours = (now.getTime() - new Date(batch.createdAt).getTime()) / 36e5;
            let color = 'default';
            if (batch.status === client_1.WireTransferBatchStatus.CREATED && delayHours > 24)
                color = 'warning';
            if (batch.status === client_1.WireTransferBatchStatus.REJECTED)
                color = 'danger';
            if (batch.status === client_1.WireTransferBatchStatus.PROCESSED)
                color = 'success';
            return {
                id: batch.id,
                society: batch.society?.name,
                donneur: batch.donneur?.name,
                status: batch.status,
                delayHours,
                color,
                createdAt: batch.createdAt,
                updatedAt: batch.updatedAt,
                totalAmount: batch.transfers.reduce((sum, t) => sum + t.amount, 0),
                transfersCount: batch.transfers.length,
                fileName: batch.fileName,
            };
        });
        let filtered = analytics;
        if (query.delayMin)
            filtered = filtered.filter(a => a.delayHours >= Number(query.delayMin));
        if (query.delayMax)
            filtered = filtered.filter(a => a.delayHours <= Number(query.delayMax));
        return {
            analytics: filtered,
            kpis: {
                total: filtered.length,
                pending: filtered.filter(a => a.status === client_1.WireTransferBatchStatus.CREATED).length,
                processed: filtered.filter(a => a.status === client_1.WireTransferBatchStatus.PROCESSED).length,
                archived: filtered.filter(a => a.status === client_1.WireTransferBatchStatus.ARCHIVED).length,
                avgDelay: filtered.length ? (filtered.reduce((sum, a) => sum + a.delayHours, 0) / filtered.length) : 0,
            }
        };
    }
    async exportDashboardAnalyticsExcel(query, user) {
        const { analytics } = await this.getDashboardAnalytics(query, user);
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('WireTransferDashboard');
        sheet.columns = [
            { header: 'Batch ID', key: 'id', width: 20 },
            { header: 'Society', key: 'society', width: 20 },
            { header: 'Donneur', key: 'donneur', width: 20 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Delay (h)', key: 'delayHours', width: 12 },
            { header: 'Total Amount', key: 'totalAmount', width: 15 },
            { header: 'Transfers', key: 'transfersCount', width: 10 },
            { header: 'File', key: 'fileName', width: 20 },
            { header: 'Created At', key: 'createdAt', width: 20 },
            { header: 'Updated At', key: 'updatedAt', width: 20 },
        ];
        analytics.forEach(row => sheet.addRow(row));
        return await workbook.xlsx.writeBuffer();
    }
    async exportDashboardAnalyticsPdf(query, user) {
        const { analytics } = await this.getDashboardAnalytics(query, user);
        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument();
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.text('Wire Transfer Dashboard Analytics');
        analytics.forEach((row, idx) => {
            doc.text(`${idx + 1}. Batch: ${row.id} | Society: ${row.society} | Donneur: ${row.donneur} | Status: ${row.status} | Delay: ${row.delayHours.toFixed(1)}h | Amount: ${row.totalAmount}`);
        });
        doc.end();
        return await new Promise((resolve) => {
            doc.on('end', () => resolve(Buffer.concat(buffers)));
        });
    }
    async getAlerts(user) {
        const errorTransfers = await this.prisma.wireTransfer.findMany({ where: { status: 'ERROR' }, include: { batch: true, member: true } });
        const now = new Date();
        const pendingBatches = await this.prisma.wireTransferBatch.findMany({ where: { status: client_1.WireTransferBatchStatus.CREATED }, include: { transfers: true } });
        const delayedBatches = pendingBatches.filter(b => ((now.getTime() - new Date(b.createdAt).getTime()) / 36e5) > 24);
        let filteredErrorTransfers = errorTransfers;
        let filteredDelayedBatches = delayedBatches;
        return {
            errorTransfers: filteredErrorTransfers,
            delayedBatches: filteredDelayedBatches,
        };
    }
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSociety(data) {
        if (!data.name || !data.code)
            throw new common_1.BadRequestException('name and code are required');
        return this.prisma.society.create({ data: { name: data.name, code: data.code } });
    }
    async getSocieties() {
        return this.prisma.society.findMany();
    }
    async getSociety(id) {
        const society = await this.prisma.society.findUnique({ where: { id } });
        if (!society)
            throw new common_1.NotFoundException('Society not found');
        return society;
    }
    async updateSociety(id, data) {
        return this.prisma.society.update({ where: { id }, data });
    }
    async deleteSociety(id) {
        return this.prisma.society.delete({ where: { id } });
    }
    async createMember(data) {
        if (!data.name || !data.rib || !data.societyId)
            throw new common_1.BadRequestException('name, rib, and societyId are required');
        return this.prisma.member.create({ data: { name: data.name, rib: data.rib, societyId: data.societyId, cin: data.cin, address: data.address } });
    }
    async getMembers(societyId) {
        return this.prisma.member.findMany({ where: societyId ? { societyId } : {} });
    }
    async getMember(id) {
        const member = await this.prisma.member.findUnique({ where: { id } });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        return member;
    }
    async updateMember(id, data) {
        return this.prisma.member.update({ where: { id }, data });
    }
    async deleteMember(id) {
        return this.prisma.member.delete({ where: { id } });
    }
    async createDonneur(data) {
        if (!data.name || !data.rib || !data.societyId)
            throw new common_1.BadRequestException('name, rib, and societyId are required');
        return this.prisma.donneurDOrdre.create({ data: { name: data.name, rib: data.rib, societyId: data.societyId } });
    }
    async getDonneurs(societyId) {
        return this.prisma.donneurDOrdre.findMany({ where: societyId ? { societyId } : {} });
    }
    async getDonneur(id) {
        const donneur = await this.prisma.donneurDOrdre.findUnique({ where: { id } });
        if (!donneur)
            throw new common_1.NotFoundException('Donneur d\'Ordre not found');
        return donneur;
    }
    async updateDonneur(id, data) {
        return this.prisma.donneurDOrdre.update({ where: { id }, data });
    }
    async deleteDonneur(id) {
        return this.prisma.donneurDOrdre.delete({ where: { id } });
    }
    async createBatch(data) {
        if (!data.societyId || !data.donneurId)
            throw new common_1.BadRequestException('societyId and donneurId are required');
        return this.prisma.wireTransferBatch.create({
            data: {
                societyId: data.societyId,
                donneurId: data.donneurId,
                status: data.status || 'CREATED',
                fileName: data.fileName,
                fileType: data.fileType,
                archived: data.archived ?? false,
            }
        });
    }
    async getBatches(societyId) {
        return this.prisma.wireTransferBatch.findMany({ where: societyId ? { societyId } : {} });
    }
    async getBatch(id) {
        const batch = await this.prisma.wireTransferBatch.findUnique({
            where: { id },
            include: { transfers: true, history: true, society: true, donneur: true },
        });
        if (!batch)
            throw new common_1.NotFoundException('Batch not found');
        return batch;
    }
    async updateBatch(id, data) {
        return this.prisma.wireTransferBatch.update({ where: { id }, data });
    }
    async deleteBatch(id) {
        return this.prisma.wireTransferBatch.delete({ where: { id } });
    }
    async createTransfer(data) {
        if (!data.batchId || !data.memberId || !data.donneurId || data.amount === undefined || !data.reference || !data.status)
            throw new common_1.BadRequestException('batchId, memberId, donneurId, amount, reference, and status are required');
        return this.prisma.wireTransfer.create({
            data: {
                batchId: data.batchId,
                memberId: data.memberId,
                donneurId: data.donneurId,
                amount: data.amount,
                reference: data.reference,
                status: data.status,
                error: data.error,
            }
        });
    }
    async getTransfers(batchId) {
        return this.prisma.wireTransfer.findMany({ where: batchId ? { batchId } : {} });
    }
    async getTransfer(id) {
        const transfer = await this.prisma.wireTransfer.findUnique({
            where: { id },
            include: { history: true, member: true, donneur: true, batch: true },
        });
        if (!transfer)
            throw new common_1.NotFoundException('Wire transfer not found');
        return transfer;
    }
    async updateTransfer(id, data) {
        return this.prisma.wireTransfer.update({ where: { id }, data });
    }
    async deleteTransfer(id) {
        return this.prisma.wireTransfer.delete({ where: { id } });
    }
    async addBatchHistory(batchId, status, changedBy) {
        return this.prisma.wireTransferBatchHistory.create({
            data: { batchId, status, changedBy },
        });
    }
    async addTransferHistory(transferId, status, error, changedBy) {
        return this.prisma.wireTransferHistory.create({
            data: { transferId, status, error, changedBy },
        });
    }
    async getBatchHistory(batchId) {
        return this.prisma.wireTransferBatchHistory.findMany({ where: { batchId } });
    }
    async getTransferHistory(transferId) {
        return this.prisma.wireTransferHistory.findMany({ where: { transferId } });
    }
};
exports.WireTransferService = WireTransferService;
exports.WireTransferService = WireTransferService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WireTransferService);
//# sourceMappingURL=wire-transfer.service.js.map