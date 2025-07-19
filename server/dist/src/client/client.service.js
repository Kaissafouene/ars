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
exports.ClientService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const axios_1 = require("axios");
const stream_1 = require("stream");
let ClientService = class ClientService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getComplaintsByClient(clientId) {
        return this.prisma.reclamation.findMany({ where: { clientId } });
    }
    async getBordereauxByClient(clientId) {
        return this.prisma.bordereau.findMany({ where: { clientId } });
    }
    async uploadContract(clientId, file, uploadedById) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        const document = await this.prisma.document.create({
            data: {
                name: file.originalname,
                type: 'contrat',
                path: file.path,
                uploadedById,
            },
        });
        return document;
    }
    async downloadContract(documentId, res) {
        const document = await this.prisma.document.findUnique({ where: { id: documentId } });
        if (!document)
            throw new common_1.NotFoundException('Document not found');
        const fs = require('fs');
        if (!fs.existsSync(document.path)) {
            throw new common_1.NotFoundException('File not found on server');
        }
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${document.name}"`,
        });
        const stream = fs.createReadStream(document.path);
        stream.pipe(res);
    }
    async updateSlaConfig(clientId, config) {
        return this.prisma.client.update({
            where: { id: clientId },
            data: { slaConfig: config },
        });
    }
    async getSlaConfig(clientId) {
        const client = await this.prisma.client.findUnique({ where: { id: clientId }, select: { slaConfig: true } });
        if (!client)
            throw new common_1.NotFoundException('Client not found');
        return client.slaConfig;
    }
    async getSlaStatus(clientId) {
        const analytics = await this.analytics(clientId);
        const client = await this.prisma.client.findUnique({ where: { id: clientId }, select: { slaConfig: true } });
        let status = 'healthy';
        let reason = '';
        let config = {};
        if (typeof client?.slaConfig === 'string') {
            try {
                config = JSON.parse(client.slaConfig);
            }
            catch {
                config = {};
            }
        }
        else if (typeof client?.slaConfig === 'object' && client.slaConfig !== null) {
            config = client.slaConfig;
        }
        const threshold = config.slaThreshold;
        if (analytics.avgSLA && threshold !== undefined) {
            if (analytics.avgSLA > threshold) {
                status = 'breach';
                reason = 'Average SLA exceeds threshold';
            }
        }
        else if (analytics.avgSLA && analytics.reglementDelay && analytics.avgSLA > analytics.reglementDelay) {
            status = 'breach';
            reason = 'Average SLA exceeds contractual delay';
        }
        return { status, reason, avgSLA: analytics.avgSLA };
    }
    async findAll(query, user) {
        let where = {
            name: query.name ? { contains: query.name, mode: 'insensitive' } : undefined,
        };
        return this.prisma.client.findMany({
            where,
            include: {
                gestionnaires: true,
                contracts: true,
                bordereaux: true,
                reclamations: true,
            },
        });
    }
    async reclamationSlaStats(clientId) {
        const client = await this.prisma.client.findUnique({ where: { id: clientId }, select: { reclamationDelay: true } });
        if (!client)
            throw new common_1.NotFoundException('Client not found');
        const reclamations = await this.prisma.reclamation.findMany({
            where: { clientId },
            select: { createdAt: true, updatedAt: true, status: true },
        });
        let withinSla = 0, total = reclamations.length;
        reclamations.forEach(r => {
            if (r.status === 'closed' || r.status === 'CLOSED') {
                const days = (r.updatedAt.getTime() - r.createdAt.getTime()) / (1000 * 60 * 60 * 24);
                if (days <= client.reclamationDelay)
                    withinSla++;
            }
        });
        return { total, withinSla, breach: total - withinSla };
    }
    async prioritizedClients() {
        const clients = await this.prisma.client.findMany({
            include: { bordereaux: true },
        });
        const prioritized = await Promise.all(clients.map(async (client) => {
            const breachCount = await this.prisma.bordereau.count({
                where: {
                    clientId: client.id,
                    delaiReglement: { gt: client.reglementDelay },
                },
            });
            return { ...client, breachCount };
        }));
        return prioritized.sort((a, b) => b.breachCount - a.breachCount);
    }
    async autofillData(clientId) {
        const client = await this.prisma.client.findUnique({
            where: { id: clientId },
            include: { gestionnaires: true, contracts: true },
        });
        if (!client)
            throw new common_1.NotFoundException('Client not found');
        return client;
    }
    async handleArsWebhook(payload) {
        try {
            console.log('Received ARS webhook payload:', payload);
            if (payload && payload.clientId && payload.name) {
                await this.prisma.client.upsert({
                    where: { id: payload.clientId },
                    update: { name: payload.name },
                    create: {
                        id: payload.clientId,
                        name: payload.name,
                        reglementDelay: payload.reglementDelay ?? 0,
                        reclamationDelay: payload.reclamationDelay ?? 0,
                    },
                });
            }
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('Failed to process ARS webhook payload');
        }
    }
    async syncWithExternal(id) {
        try {
            const externalUrl = `http://197.14.56.112:8083/api/societes/${id}`;
            const { data } = await axios_1.default.get(externalUrl);
            if (!data)
                throw new common_1.NotFoundException('External client not found');
            const updated = await this.prisma.client.update({
                where: { id },
                data: {
                    name: data.name,
                    reglementDelay: data.reglementDelay ?? 5,
                    reclamationDelay: data.reclamationDelay ?? 5,
                },
            });
            return updated;
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('Failed to sync with external API');
        }
    }
    async getAIRecommendation(id) {
        const analytics = await this.analytics(id);
        if (typeof analytics.avgSLA === 'number' &&
            typeof analytics.reglementDelay === 'number' &&
            analytics.avgSLA > analytics.reglementDelay) {
            return {
                recommendation: '⚠️ AI Suggestion: SLA is trending late. Consider increasing staff or reviewing process.',
            };
        }
        return {
            recommendation: '✅ AI Suggestion: SLA is healthy.',
        };
    }
    async exportToExcel(query) {
        const clients = await this.findAll(query);
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Clients');
        sheet.columns = [
            { header: 'ID', key: 'id', width: 24 },
            { header: 'Name', key: 'name', width: 32 },
            { header: 'Reglement Delay', key: 'reglementDelay', width: 18 },
            { header: 'Reclamation Delay', key: 'reclamationDelay', width: 18 },
            { header: 'Gestionnaires', key: 'gestionnaires', width: 32 },
        ];
        clients.forEach((client) => {
            sheet.addRow({
                id: client.id,
                name: client.name,
                reglementDelay: client.reglementDelay,
                reclamationDelay: client.reclamationDelay,
                gestionnaires: client.gestionnaires?.map((g) => g.fullName).join(', ') || '',
            });
        });
        const arrayBuffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(arrayBuffer);
    }
    async exportToPDF(query) {
        const clients = await this.findAll(query);
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        const stream = new stream_1.PassThrough();
        doc.pipe(stream);
        doc.fontSize(18).text('Clients', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text('ID', 30, doc.y, { continued: true }).text('Name', 120, doc.y, { continued: true }).text('Reglement Delay', 250, doc.y, { continued: true }).text('Reclamation Delay', 370, doc.y, { continued: true }).text('Gestionnaires', 500, doc.y);
        doc.moveDown(0.5);
        clients.forEach((client) => {
            doc.text(client.id, 30, doc.y, { continued: true }).text(client.name, 120, doc.y, { continued: true }).text(String(client.reglementDelay), 250, doc.y, { continued: true }).text(String(client.reclamationDelay), 370, doc.y, { continued: true }).text(client.gestionnaires?.map((g) => g.fullName).join(', ') || '', 500, doc.y);
            doc.moveDown(0.5);
        });
        doc.end();
        const chunks = [];
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', reject);
        });
    }
    async findByName(name) {
        return this.prisma.client.findUnique({ where: { name } });
    }
    async create(dto) {
        const existing = await this.prisma.client.findUnique({ where: { name: dto.name } });
        if (existing) {
            throw new Error('A client with this name already exists.');
        }
        if (!('slaConfig' in dto)) {
            dto.slaConfig = { slaThreshold: dto.reglementDelay };
        }
        const { gestionnaireIds, ...rest } = dto;
        return this.prisma.client.create({
            data: {
                ...rest,
                gestionnaires: {
                    connect: gestionnaireIds.map(id => ({ id })),
                },
            },
            include: { gestionnaires: true },
        });
    }
    async findOne(id) {
        const client = await this.prisma.client.findUnique({
            where: { id },
            include: {
                gestionnaires: true,
                contracts: true,
                bordereaux: true,
                reclamations: true,
            },
        });
        if (!client)
            throw new common_1.NotFoundException('Client not found');
        return client;
    }
    async update(id, dto) {
        const { name, reglementDelay, reclamationDelay, gestionnaireIds, slaConfig } = dto;
        const data = {
            ...(name !== undefined && { name }),
            ...(reglementDelay !== undefined && { reglementDelay }),
            ...(reclamationDelay !== undefined && { reclamationDelay }),
            ...(slaConfig !== undefined && { slaConfig }),
        };
        if (gestionnaireIds) {
            data.gestionnaires = {
                set: gestionnaireIds.map(id => ({ id })),
            };
        }
        return this.prisma.client.update({
            where: { id },
            data,
            include: { gestionnaires: true },
        });
    }
    async remove(id) {
        return this.prisma.client.delete({ where: { id } });
    }
    async getHistory(id) {
        return {
            contracts: await this.prisma.contract.findMany({ where: { clientId: id } }),
            bordereaux: await this.prisma.bordereau.findMany({ where: { clientId: id } }),
            reclamations: await this.prisma.reclamation.findMany({ where: { clientId: id } }),
        };
    }
    async analytics(id) {
        const bordereauxCount = await this.prisma.bordereau.count({ where: { clientId: id } });
        const reclamationsCount = await this.prisma.reclamation.count({ where: { clientId: id } });
        const avgSLA = await this.prisma.bordereau.aggregate({
            where: { clientId: id },
            _avg: { delaiReglement: true },
        });
        const client = await this.prisma.client.findUnique({
            where: { id },
            select: { reglementDelay: true }
        });
        return {
            bordereauxCount,
            reclamationsCount,
            avgSLA: avgSLA._avg.delaiReglement,
            reglementDelay: client?.reglementDelay,
        };
    }
    async analyticsTrends(id) {
        const now = new Date();
        const months = Array.from({ length: 12 }).map((_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            return { year: d.getFullYear(), month: d.getMonth() + 1 };
        }).reverse();
        const data = await Promise.all(months.map(async ({ year, month }) => {
            const count = await this.prisma.bordereau.count({
                where: {
                    clientId: id,
                    dateReception: {
                        gte: new Date(year, month - 1, 1),
                        lt: new Date(year, month, 1),
                    },
                },
            });
            return { year, month, count };
        }));
        return { monthlyBordereaux: data };
    }
};
exports.ClientService = ClientService;
exports.ClientService = ClientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientService);
//# sourceMappingURL=client.service.js.map