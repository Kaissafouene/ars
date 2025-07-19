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
var TuniclaimService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TuniclaimService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const outlook_service_1 = require("./outlook.service");
let TuniclaimService = TuniclaimService_1 = class TuniclaimService {
    prisma;
    outlook;
    async syncBordereaux() {
        await this.syncBs();
    }
    logger = new common_1.Logger(TuniclaimService_1.name);
    baseUrl = 'http://197.14.56.112:8083/api';
    constructor(prisma, outlook) {
        this.prisma = prisma;
        this.outlook = outlook;
    }
    lastSync = null;
    lastResult = null;
    async fetchBsList() {
        try {
            const res = await axios_1.default.get(`${this.baseUrl}/bs`);
            return res.data;
        }
        catch (e) {
            this.logger.error('Failed to fetch BS list', e);
            throw e;
        }
    }
    async fetchBsDetails(bsId) {
        try {
            const res = await axios_1.default.get(`${this.baseUrl}/bs/${bsId}`);
            return res.data;
        }
        catch (e) {
            this.logger.error(`Failed to fetch BS details for ${bsId}`, e);
            throw e;
        }
    }
    async syncBs() {
        let bsList = [];
        let imported = 0, errors = 0;
        try {
            bsList = await this.fetchBsList();
        }
        catch (e) {
            this.logger.error('Tuniclaim fetch failed', e);
            this.lastSync = new Date().toISOString();
            this.lastResult = { imported: 0, errors: 1 };
            await this.prisma.syncLog.create({
                data: {
                    imported: 0,
                    errors: 1,
                    details: 'External API unavailable: ' + (e.message || e.toString()),
                },
            });
            await this.outlook.sendMail('admin@example.com', 'Tuniclaim Sync Errors', `Tuniclaim API unavailable: ${e.message}`);
            return { imported: 0, errors: 1, error: e.message };
        }
        for (const extBs of bsList) {
            try {
                const mapped = {
                    reference: extBs.reference || 'EXT_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
                    clientId: await this.resolveClientId(extBs.client || {}),
                    contractId: await this.resolveContractId(extBs.contract || {}),
                    dateReception: extBs.dateReception ? new Date(extBs.dateReception) : new Date(),
                    delaiReglement: extBs.delaiReglement || 5,
                    statut: client_1.Statut.EN_ATTENTE,
                    nombreBS: extBs.nombreBS || 1,
                };
                await this.prisma.bordereau.upsert({
                    where: { reference: mapped.reference },
                    update: mapped,
                    create: mapped,
                });
                imported++;
            }
            catch (e) {
                this.logger.error(`Failed to import BS ${extBs.reference}: ${e.message}`);
                errors++;
            }
        }
        this.lastSync = new Date().toISOString();
        this.lastResult = { imported, errors };
        await this.prisma.syncLog.create({
            data: {
                imported,
                errors,
                details: errors > 0 ? 'See logs or email for details' : null,
            },
        });
        if (errors > 0) {
            await this.outlook.sendMail('admin@example.com', 'Tuniclaim Sync Errors', `There were ${errors} errors during the last sync.`);
        }
        return { imported, errors };
    }
    async getLastSyncLog() {
        return this.prisma.syncLog.findFirst({
            orderBy: { date: 'desc' },
        });
    }
    async getSyncLogs(limit = 20) {
        return this.prisma.syncLog.findMany({
            orderBy: { date: 'desc' },
            take: limit,
        });
    }
    async getDefaultManagerId() {
        const user = await this.prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } });
        if (user)
            return user.id;
        const anyUser = await this.prisma.user.findFirst();
        if (anyUser)
            return anyUser.id;
        throw new Error('No user found to assign as manager');
    }
    async resolveClientId(extClient) {
        const client = await this.prisma.client.findFirst({
            where: { name: extClient?.name },
        });
        if (client)
            return client.id;
        const accountManagerId = await this.getDefaultManagerId();
        const data = {
            name: extClient?.name || 'EXT_' + Date.now(),
            reglementDelay: extClient?.reglementDelay || 5,
            reclamationDelay: extClient?.reclamationDelay || 5,
            accountManagerId,
        };
        const created = await this.prisma.client.create({ data });
        return created.id;
    }
    async resolveContractId(extContract) {
        const contract = await this.prisma.contract.findFirst({
            where: { clientName: extContract?.clientName },
        });
        if (contract)
            return contract.id;
        const assignedManagerId = await this.getDefaultManagerId();
        const now = new Date();
        const startDate = extContract?.startDate ? new Date(extContract.startDate) : now;
        const endDate = extContract?.endDate ? new Date(extContract.endDate) : now;
        const created = await this.prisma.contract.create({
            data: {
                clientId: await this.resolveClientId(extContract?.client),
                clientName: extContract?.clientName || 'EXT_' + Date.now(),
                delaiReglement: extContract?.delaiReglement || 5,
                delaiReclamation: extContract?.delaiReclamation || 5,
                documentPath: '',
                assignedManagerId,
                startDate,
                endDate,
                signature: extContract?.signature || undefined,
            },
        });
        return created.id;
    }
};
exports.TuniclaimService = TuniclaimService;
exports.TuniclaimService = TuniclaimService = TuniclaimService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        outlook_service_1.OutlookService])
], TuniclaimService);
//# sourceMappingURL=tuniclaim.service.js.map