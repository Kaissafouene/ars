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
var ContractsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const stream_1 = require("stream");
let ContractsService = ContractsService_1 = class ContractsService {
    prisma;
    logger = new common_1.Logger(ContractsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    checkRole(user, action = 'view') {
        if (user.role === 'SUPER_ADMIN')
            return;
        if (user.role === 'ADMIN' && action !== 'delete')
            return;
        if (user.role === 'CHEF_EQUIPE' && action === 'view')
            return;
        throw new common_1.ForbiddenException('Access denied');
    }
    async isClientExists(clientId) {
        const client = await this.prisma.client.findUnique({ where: { id: clientId } });
        return !!client;
    }
    async hasContractOverlap(clientId, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const overlap = await this.prisma.contract.findFirst({
            where: {
                clientId,
                OR: [
                    {
                        startDate: { lte: end },
                        endDate: { gte: start },
                    },
                ],
            },
        });
        return !!overlap;
    }
    async createContract(dto, file, user) {
        try {
            this.checkRole(user, 'create');
            const client = await this.prisma.client.findUnique({ where: { id: dto.clientId } });
            if (!client) {
                console.error('Contract creation error: Linked client does not exist.', dto.clientId);
                throw new common_1.NotFoundException('Linked client does not exist.');
            }
            const overlap = await this.hasContractOverlap(dto.clientId, dto.startDate, dto.endDate);
            if (overlap) {
                console.error('Contract creation error: Overlapping contract exists.', dto.clientId, dto.startDate, dto.endDate);
                throw new common_1.ConflictException('A contract for this client and period already exists.');
            }
            const { startDate, endDate, signatureDate, ...rest } = dto;
            if ('notes' in rest) {
                delete rest.notes;
            }
            console.log('Contract creation payload:', {
                ...rest,
                startDate,
                endDate,
                documentPath: file?.path || dto.documentPath || '',
            });
            const contract = await this.prisma.contract.create({
                data: {
                    ...rest,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    documentPath: file?.path || dto.documentPath || '',
                },
            });
            return contract;
        }
        catch (err) {
            console.error('Contract creation error (catch):', err);
            throw err;
        }
    }
    async updateContract(id, dto, user) {
        this.checkRole(user, 'update');
        const old = await this.prisma.contract.findUnique({ where: { id } });
        if (!old)
            throw new common_1.NotFoundException('Contract not found');
        const contract = await this.prisma.contract.update({
            where: { id },
            data: { ...dto },
        });
        await this.prisma.contractHistory.create({
            data: {
                contractId: contract.id,
                modifiedById: user.id,
                changes: { before: old, after: contract },
            },
        });
        return contract;
    }
    async deleteContract(id, user) {
        this.checkRole(user, 'delete');
        return this.prisma.contract.delete({ where: { id } });
    }
    async getContract(id, user) {
        this.checkRole(user, 'view');
        return this.prisma.contract.findUnique({ where: { id }, include: { assignedManager: true, history: true } });
    }
    async searchContracts(query, user) {
        this.checkRole(user, 'view');
        const where = {};
        if (query.clientId)
            where.clientId = query.clientId;
        if (query.clientName)
            where.clientName = query.clientName;
        if (query.assignedManagerId)
            where.assignedManagerId = query.assignedManagerId;
        return this.prisma.contract.findMany({ where, include: { assignedManager: true } });
    }
    async getContractHistory(id, user) {
        this.checkRole(user, 'view');
        return this.prisma.contractHistory.findMany({
            where: { contractId: id },
            orderBy: { modifiedAt: 'desc' },
            include: { modifiedBy: true },
        });
    }
    async exportContractsExcel(query, user) {
        this.checkRole(user, 'view');
        const contracts = await this.searchContracts(query, user);
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Contracts');
        sheet.columns = [
            { header: 'ID', key: 'id', width: 20 },
            { header: 'Client ID', key: 'clientId', width: 20 },
            { header: 'Client Name', key: 'clientName', width: 30 },
            { header: 'Assigned Manager', key: 'assignedManagerId', width: 20 },
            { header: 'Start Date', key: 'startDate', width: 20 },
            { header: 'End Date', key: 'endDate', width: 20 },
            { header: 'Delai Reglement', key: 'delaiReglement', width: 20 },
            { header: 'Delai Reclamation', key: 'delaiReclamation', width: 20 },
            { header: 'Escalation Threshold', key: 'escalationThreshold', width: 20 },
            { header: 'Document Path', key: 'documentPath', width: 40 },
            { header: 'Signature', key: 'signature', width: 20 },
        ];
        contracts.forEach(contract => {
            sheet.addRow(contract);
        });
        const buffer = await workbook.xlsx.writeBuffer();
        return {
            file: buffer,
            filename: 'contracts.xlsx',
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        };
    }
    async exportContractsPdf(query, user) {
        this.checkRole(user, 'view');
        const contracts = await this.searchContracts(query, user);
        const doc = new PDFDocument();
        const stream = new stream_1.PassThrough();
        doc.pipe(stream);
        doc.fontSize(18).text('Contracts List', { align: 'center' });
        doc.moveDown();
        contracts.forEach(contract => {
            doc.fontSize(12).text(`ID: ${contract.id}`);
            doc.text(`Client: ${contract.clientName} (${contract.clientId})`);
            doc.text(`Manager: ${contract.assignedManagerId}`);
            doc.text(`Start: ${contract.startDate}  End: ${contract.endDate}`);
            doc.text(`Delai Reglement: ${contract.delaiReglement}`);
            doc.text(`Delai Reclamation: ${contract.delaiReclamation}`);
            doc.text(`Escalation Threshold: ${contract.escalationThreshold}`);
            doc.text(`Document Path: ${contract.documentPath}`);
            doc.text(`Signature: ${contract.signature}`);
            doc.moveDown();
        });
        doc.end();
        const chunks = [];
        return new Promise((resolve, reject) => {
            stream.on('data', chunk => chunks.push(chunk));
            stream.on('end', () => {
                resolve({
                    file: Buffer.concat(chunks),
                    filename: 'contracts.pdf',
                    contentType: 'application/pdf',
                });
            });
            stream.on('error', reject);
        });
    }
    async checkSlaBreaches() {
        const now = new Date();
        const contracts = await this.prisma.contract.findMany({});
        const breached = [];
        for (const contract of contracts) {
            if (contract.endDate && new Date(contract.endDate) < now && !contract.signature) {
                breached.push({
                    id: contract.id,
                    reason: 'Contract expired without signature',
                });
                this.logger.warn(`SLA Breach: Contract ${contract.id} expired without signature.`);
            }
            if (contract.escalationThreshold && contract.delaiReglement > contract.escalationThreshold) {
                breached.push({
                    id: contract.id,
                    reason: 'Delai Reglement exceeds escalation threshold',
                });
                this.logger.warn(`SLA Breach: Contract ${contract.id} delaiReglement exceeds threshold.`);
            }
        }
        return { breached };
    }
    async getContractStatistics(user) {
        this.checkRole(user, 'view');
        const now = new Date();
        const [total, active, expired, expiringSoon, contractsWithThreshold] = await Promise.all([
            this.prisma.contract.count(),
            this.prisma.contract.count({ where: { endDate: { gte: now } } }),
            this.prisma.contract.count({ where: { endDate: { lt: now } } }),
            this.prisma.contract.count({
                where: {
                    endDate: {
                        gte: now,
                        lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
                    },
                },
            }),
            this.prisma.contract.findMany({ where: { escalationThreshold: { not: null } } })
        ]);
        let slaCompliant = 0;
        for (const contract of contractsWithThreshold) {
            if (typeof contract.escalationThreshold === 'number' && contract.delaiReglement <= contract.escalationThreshold) {
                slaCompliant++;
            }
        }
        return {
            total,
            active,
            expired,
            expiringSoon,
            slaCompliant,
        };
    }
    async associateContractsToBordereaux() {
        const contracts = await this.prisma.contract.findMany();
        let count = 0;
        for (const contract of contracts) {
            const bordereaux = await this.prisma.bordereau.findMany({
                where: {
                    clientId: contract.clientId,
                    dateReception: {
                        gte: contract.startDate,
                        lte: contract.endDate,
                    },
                },
            });
            for (const bordereau of bordereaux) {
                if (bordereau.contractId !== contract.id) {
                    await this.prisma.bordereau.update({
                        where: { id: bordereau.id },
                        data: { contractId: contract.id },
                    });
                    count++;
                }
            }
        }
        return { associated: count };
    }
    async triggerContractReminders() {
        const now = new Date();
        const soon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const contracts = await this.prisma.contract.findMany({
            where: {
                OR: [
                    { endDate: { gte: now, lte: soon } },
                    { signature: null },
                ],
            },
        });
        for (const contract of contracts) {
            this.logger.log(`[REMINDER] Contract ${contract.id} is expiring soon or missing signature.`);
        }
        return { remindersSent: contracts.length };
    }
    async indexContractsForGed() {
        const contracts = await this.prisma.contract.findMany();
        let indexed = 0;
        for (const contract of contracts) {
            this.logger.log(`[GED] Indexed contract ${contract.id} for search.`);
            indexed++;
        }
        return { indexed };
    }
    async linkContractsToComplaints() {
        const complaints = await this.prisma.reclamation.findMany();
        let linked = 0;
        for (const complaint of complaints) {
            const contract = await this.prisma.contract.findFirst({
                where: {
                    clientId: complaint.clientId,
                    startDate: { lte: complaint.createdAt },
                    endDate: { gte: complaint.createdAt },
                },
            });
            if (contract && complaint.contractId !== contract.id) {
                await this.prisma.reclamation.update({
                    where: { id: complaint.id },
                    data: { contractId: contract.id },
                });
                linked++;
            }
        }
        return { linked };
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = ContractsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map