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
var BordereauxService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BordereauxService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const bordereau_response_dto_1 = require("./dto/bordereau-response.dto");
const bs_dto_1 = require("./dto/bs.dto");
const alerts_service_1 = require("../alerts/alerts.service");
const path = require("path");
const fs = require("fs");
const axios_1 = require("axios");
let BordereauxService = BordereauxService_1 = class BordereauxService {
    prisma;
    alertsService;
    async seedComplaints() {
        const client = await this.prisma.client.findFirst();
        const user = await this.prisma.user.findFirst();
        if (!client || !user) {
            throw new Error('No client or user found. Seed clients and users first.');
        }
        const complaints = [
            { description: "Problème de remboursement pour la facture 12345" },
            { description: "Erreur de montant sur la facture 67890" },
            { description: "Délai de traitement trop long pour la réclamation 54321" },
            { description: "Problème de communication avec le service client" },
            { description: "Erreur de saisie sur mon nom" }
        ];
        const results = [];
        for (const c of complaints) {
            const data = {
                description: c.description,
                type: 'SERVICE',
                severity: 'MOYENNE',
                status: 'OUVERTE',
                client: { connect: { id: client.id } },
                createdBy: { connect: { id: user.id } },
            };
            console.log('Creating reclamation with data:', data);
            try {
                const result = await this.prisma.reclamation.create({ data });
                results.push();
            }
            catch (error) {
                console.error('Error creating reclamation:', error);
            }
        }
        return results;
    }
    async seedTestData() {
        let user1 = await this.prisma.user.findUnique({ where: { id: 'manager1' } });
        if (!user1) {
            user1 = await this.prisma.user.create({
                data: {
                    id: 'manager1',
                    email: 'manager1@example.com',
                    password: 'password123',
                    fullName: 'Manager 1',
                    role: 'MANAGER',
                }
            });
        }
        let user2 = await this.prisma.user.findUnique({ where: { id: 'manager2' } });
        if (!user2) {
            user2 = await this.prisma.user.create({
                data: {
                    id: 'manager2',
                    email: 'manager2@example.com',
                    password: 'password123',
                    fullName: 'Manager 2',
                    role: 'MANAGER',
                }
            });
        }
        let client1 = await this.prisma.client.findUnique({ where: { name: 'Test Client 1' } });
        if (!client1) {
            client1 = await this.prisma.client.create({
                data: {
                    name: 'Test Client 1',
                    reglementDelay: 30,
                    reclamationDelay: 15,
                    gestionnaires: { connect: [{ id: 'manager1' }] }
                }
            });
        }
        let client2 = await this.prisma.client.findUnique({ where: { name: 'Test Client 2' } });
        if (!client2) {
            client2 = await this.prisma.client.create({
                data: {
                    name: 'Test Client 2',
                    reglementDelay: 45,
                    reclamationDelay: 20,
                    gestionnaires: { connect: [{ id: 'manager2' }] }
                }
            });
        }
        const contract1 = await this.prisma.contract.create({
            data: {
                clientId: client1.id,
                clientName: client1.name,
                startDate: new Date('2023-01-01').toISOString(),
                endDate: new Date('2024-12-31').toISOString(),
                delaiReglement: 30,
                delaiReclamation: 15,
                documentPath: '/tmp/doc1.pdf',
                assignedManagerId: 'manager1'
            }
        });
        const contract2 = await this.prisma.contract.create({
            data: {
                clientId: client2.id,
                clientName: client2.name,
                startDate: new Date('2023-01-01').toISOString(),
                endDate: new Date('2024-12-31').toISOString(),
                delaiReglement: 45,
                delaiReclamation: 20,
                documentPath: '/tmp/doc2.pdf',
                assignedManagerId: 'manager2'
            }
        });
        const testBordereaux = [
            {
                reference: 'BORD-2023-001',
                dateReception: new Date('2023-01-15').toISOString(),
                clientId: client1.id,
                contractId: contract1.id,
                delaiReglement: 30,
                nombreBS: 10
            },
            {
                reference: 'BORD-2023-002',
                dateReception: new Date('2023-02-01').toISOString(),
                clientId: client2.id,
                contractId: contract2.id,
                delaiReglement: 45,
                nombreBS: 15
            }
        ];
        const results = [];
        for (const tb of testBordereaux) {
            const existing = await this.prisma.bordereau.findUnique({ where: { reference: tb.reference } });
            if (existing) {
                results.push({ message: 'Already exists', data: tb });
                continue;
            }
            const data = {
                reference: tb.reference,
                dateReception: tb.dateReception,
                clientId: tb.clientId,
                contractId: tb.contractId,
                delaiReglement: tb.delaiReglement,
                nombreBS: tb.nombreBS
            };
            try {
                results.push(await this.create(data));
            }
            catch (e) {
                results.push({ error: e.message, data });
            }
        }
        return results;
    }
    logger = new common_1.Logger(BordereauxService_1.name);
    auditLogService;
    constructor(prisma, alertsService) {
        this.prisma = prisma;
        this.alertsService = alertsService;
    }
    async create(createBordereauDto) {
        let { reference, dateReception, clientId, contractId, dateDebutScan, dateFinScan, dateReceptionSante, dateCloture, dateDepotVirement, dateExecutionVirement, delaiReglement, statut, nombreBS, } = createBordereauDto;
        const client = await this.prisma.client.findUnique({ where: { id: clientId } });
        if (!client)
            throw new common_1.BadRequestException('Invalid clientId');
        if (contractId) {
            const contract = await this.prisma.contract.findUnique({ where: { id: contractId } });
            if (!contract)
                throw new common_1.BadRequestException('Invalid contractId');
        }
        if (!contractId) {
            const today = new Date();
            const activeContract = await this.prisma.contract.findFirst({
                where: {
                    clientId,
                    startDate: { lte: today },
                    endDate: { gte: today },
                },
                orderBy: { startDate: 'desc' },
            });
            if (activeContract) {
                contractId = activeContract.id;
                if (!delaiReglement && typeof activeContract.delaiReglement === 'number') {
                    delaiReglement = activeContract.delaiReglement;
                }
            }
        }
        const existing = await this.prisma.bordereau.findFirst({ where: { reference, clientId } });
        if (existing) {
            throw new common_1.BadRequestException('A bordereau with this reference already exists for this client.');
        }
        const data = {
            reference,
            dateReception,
            clientId,
            contractId,
            delaiReglement,
            nombreBS,
        };
        if (statut !== undefined)
            data.statut = statut;
        if (dateDebutScan)
            data.dateDebutScan = dateDebutScan;
        if (dateFinScan)
            data.dateFinScan = dateFinScan;
        if (dateReceptionSante)
            data.dateReceptionSante = dateReceptionSante;
        if (dateCloture)
            data.dateCloture = dateCloture;
        if (dateDepotVirement)
            data.dateDepotVirement = dateDepotVirement;
        if (dateExecutionVirement)
            data.dateExecutionVirement = dateExecutionVirement;
        const bordereau = await this.prisma.bordereau.create({
            data,
            include: {
                client: true,
                contract: true,
            },
        });
        await this.alertsService.triggerAlert({
            type: 'NEW_BORDEREAU',
            bsId: bordereau.id,
        });
        await this.autoAssignBordereau(bordereau.id);
        await this.logAction(bordereau.id, 'CREATE_BORDEREAU');
        return bordereau_response_dto_1.BordereauResponseDto.fromEntity(bordereau);
    }
    async findAll() {
        const bordereaux = await this.prisma.bordereau.findMany({
            include: {
                client: true,
                contract: true,
            },
        });
        return bordereaux.map(bordereau => bordereau_response_dto_1.BordereauResponseDto.fromEntity(bordereau));
    }
    async updateBordereauStatus(bordereauId) {
        const bordereau = await this.prisma.bordereau.findUnique({
            where: { id: bordereauId },
            include: { contract: true },
        });
        if (!bordereau) {
            throw new common_1.NotFoundException(`Bordereau with ID ${bordereauId} not found`);
        }
        const today = new Date();
        const daysElapsed = Math.floor((today.getTime() - new Date(bordereau.dateReception).getTime()) / (1000 * 60 * 60 * 24));
        const daysRemaining = bordereau.delaiReglement - daysElapsed;
        if (daysRemaining <= 0) {
            await this.alertsService.triggerAlert({
                type: 'SLA_BREACH',
                bsId: bordereauId,
            });
        }
        let overloadThreshold = 50;
        if (bordereau.contract && typeof bordereau.contract.escalationThreshold === 'number') {
            overloadThreshold = bordereau.contract.escalationThreshold;
        }
        const teamCount = await this.prisma.bordereau.count({ where: { teamId: bordereau.teamId, statut: { not: 'CLOTURE' } } });
        if (teamCount > overloadThreshold) {
            await this.alertsService.triggerAlert({
                type: 'TEAM_OVERLOAD',
                bsId: bordereauId,
            });
        }
    }
    async findOne(id) {
        const bordereau = await this.prisma.bordereau.findUnique({
            where: { id },
            include: {
                client: true,
                contract: true,
                virement: true,
                documents: true,
                team: true,
                currentHandler: true,
                traitementHistory: { include: { user: true, assignedTo: true } },
            },
        });
        if (!bordereau)
            throw new common_1.NotFoundException('Bordereau not found');
        return bordereau_response_dto_1.BordereauResponseDto.fromEntity(bordereau);
    }
    async update(id, updateBordereauDto) {
        const { reference, dateReception, clientId, contractId, dateDebutScan, dateFinScan, dateReceptionSante, dateCloture, dateDepotVirement, dateExecutionVirement, delaiReglement, statut, nombreBS, } = updateBordereauDto;
        const data = {};
        if (reference !== undefined)
            data.reference = reference;
        if (dateReception !== undefined)
            data.dateReception = dateReception;
        if (clientId !== undefined)
            data.clientId = clientId;
        if (contractId !== undefined)
            data.contractId = contractId;
        if (dateDebutScan !== undefined)
            data.dateDebutScan = dateDebutScan;
        if (dateFinScan !== undefined)
            data.dateFinScan = dateFinScan;
        if (dateReceptionSante !== undefined)
            data.dateReceptionSante = dateReceptionSante;
        if (dateCloture !== undefined)
            data.dateCloture = dateCloture;
        if (dateDepotVirement !== undefined)
            data.dateDepotVirement = dateDepotVirement;
        if (dateExecutionVirement !== undefined)
            data.dateExecutionVirement = dateExecutionVirement;
        if (delaiReglement !== undefined)
            data.delaiReglement = delaiReglement;
        if (statut !== undefined)
            data.statut = { set: statut };
        if (nombreBS !== undefined)
            data.nombreBS = nombreBS;
        const bordereau = await this.prisma.bordereau.update({
            where: { id },
            data,
            include: { client: true, contract: true },
        });
        await this.logAction(id, 'UPDATE_BORDEREAU');
        return bordereau_response_dto_1.BordereauResponseDto.fromEntity(bordereau);
    }
    async remove(id) {
        const bordereau = await this.prisma.bordereau.delete({
            where: { id },
            include: {
                client: true,
                contract: true,
            },
        });
        return bordereau_response_dto_1.BordereauResponseDto.fromEntity(bordereau);
    }
    async assignBordereau(assignDto) {
        const { bordereauId, assignedToUserId, teamId, notes } = assignDto;
        const bordereau = await this.prisma.bordereau.findUnique({
            where: { id: bordereauId },
        });
        if (!bordereau) {
            throw new common_1.NotFoundException(`Bordereau with ID ${bordereauId} not found`);
        }
        if (assignedToUserId) {
            const user = await this.prisma.user.findUnique({
                where: { id: assignedToUserId },
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${assignedToUserId} not found`);
            }
            this.logger.log(`Assigned bordereau ${bordereauId} to user ${assignedToUserId}`);
        }
        const updatedBordereau = await this.prisma.bordereau.update({
            where: { id: bordereauId },
            data: {
                statut: { set: client_1.Statut.ASSIGNE },
            },
            include: {
                client: true,
                contract: true,
            },
        });
        return bordereau_response_dto_1.BordereauResponseDto.fromEntity(updatedBordereau);
    }
    async autoAssignBordereau(bordereauId) {
        try {
            const availableUsers = await this.prisma.user.findMany({
                where: {
                    role: 'GESTIONNAIRE',
                    active: true,
                },
            });
            if (availableUsers.length === 0) {
                this.logger.warn('No available users found for auto-assignment');
                return;
            }
            const workloads = await Promise.all(availableUsers.map(async (user) => {
                const count = await this.prisma.bordereau.count({
                    where: { assignedToUserId: user.id, statut: { not: 'CLOTURE' } },
                });
                return { user, count };
            }));
            workloads.sort((a, b) => a.count - b.count);
            const selectedUser = workloads[0].user;
            await this.assignBordereau({
                bordereauId,
                assignedToUserId: selectedUser.id,
                notes: 'Auto-assigned based on lowest workload',
            });
            this.logger.log(`Auto-assigned bordereau ${bordereauId} to user ${selectedUser.id}`);
        }
        catch (error) {
            this.logger.error(`Error auto-assigning bordereau ${bordereauId}: ${error.message}`);
        }
    }
    async getApproachingDeadlines() {
        const bordereaux = await this.prisma.bordereau.findMany({
            where: {
                statut: {
                    notIn: [client_1.Statut.CLOTURE, client_1.Statut.TRAITE],
                },
            },
            include: {
                client: true,
                contract: true,
            },
        });
        const today = new Date();
        return bordereaux.filter(bordereau => {
            const receptionDate = new Date(bordereau.dateReception);
            const daysElapsed = Math.floor((today.getTime() - receptionDate.getTime()) / (1000 * 60 * 60 * 24));
            const daysRemaining = bordereau.delaiReglement - daysElapsed;
            return daysRemaining <= 3 && daysRemaining > 0;
        }).map(bordereau => bordereau_response_dto_1.BordereauResponseDto.fromEntity(bordereau));
    }
    async getOverdueBordereaux() {
        const bordereaux = await this.prisma.bordereau.findMany({
            where: {
                statut: {
                    notIn: [client_1.Statut.CLOTURE, client_1.Statut.TRAITE],
                },
            },
            include: {
                client: true,
                contract: true,
            },
        });
        const today = new Date();
        return bordereaux.filter(bordereau => {
            const receptionDate = new Date(bordereau.dateReception);
            const daysElapsed = Math.floor((today.getTime() - receptionDate.getTime()) / (1000 * 60 * 60 * 24));
            const daysRemaining = bordereau.delaiReglement - daysElapsed;
            return daysRemaining <= 0;
        }).map(bordereau => bordereau_response_dto_1.BordereauResponseDto.fromEntity(bordereau));
    }
    async getBordereauKPIs() {
        const bordereaux = await this.prisma.bordereau.findMany();
        const today = new Date();
        const statusCounts = {};
        let overdueCount = 0;
        let totalScanDuration = 0;
        let scanCount = 0;
        let totalProcessingDuration = 0;
        let processingCount = 0;
        const kpis = bordereaux.map(bordereau => {
            const receptionDate = new Date(bordereau.dateReception);
            const daysElapsed = Math.floor((today.getTime() - receptionDate.getTime()) / (1000 * 60 * 60 * 24));
            const daysRemaining = bordereau.delaiReglement - daysElapsed;
            let scanDuration = null;
            if (bordereau.dateDebutScan && bordereau.dateFinScan) {
                scanDuration = Math.floor((new Date(bordereau.dateFinScan).getTime() - new Date(bordereau.dateDebutScan).getTime()) /
                    (1000 * 60 * 60 * 24));
                totalScanDuration += scanDuration;
                scanCount++;
            }
            let totalDuration = null;
            if (bordereau.dateCloture) {
                totalDuration = Math.floor((new Date(bordereau.dateCloture).getTime() - receptionDate.getTime()) /
                    (1000 * 60 * 60 * 24));
                totalProcessingDuration += totalDuration;
                processingCount++;
            }
            let statusColor = 'GREEN';
            if (daysRemaining <= 0)
                statusColor = 'RED';
            else if (daysRemaining <= 3)
                statusColor = 'ORANGE';
            statusCounts[bordereau.statut] = (statusCounts[bordereau.statut] || 0) + 1;
            if (daysRemaining <= 0)
                overdueCount++;
            return {
                id: bordereau.id,
                reference: bordereau.reference,
                statut: bordereau.statut,
                daysElapsed,
                daysRemaining,
                scanDuration,
                totalDuration,
                isOverdue: daysRemaining <= 0,
                statusColor,
            };
        });
        kpis.push({
            id: 'SUMMARY',
            reference: 'SUMMARY',
            statut: 'ALL',
            daysElapsed: bordereaux.length,
            daysRemaining: overdueCount,
            scanDuration: scanCount ? Math.round(totalScanDuration / scanCount) : null,
            totalDuration: processingCount ? Math.round(totalProcessingDuration / processingCount) : null,
            isOverdue: overdueCount,
            statusColor: 'GREEN',
            byStatus: statusCounts,
        });
        return kpis;
    }
    async exportCSV() {
        const bordereaux = await this.findAll();
        const fields = ['id', 'reference', 'statut', 'dateReception', 'dateCloture', 'delaiReglement', 'nombreBS'];
        const csvRows = [fields.join(',')];
        for (const b of bordereaux) {
            csvRows.push(fields.map(f => (b[f] !== undefined ? '"' + String(b[f]).replace(/"/g, '""') + '"' : '')).join(','));
        }
        return csvRows.join('\n');
    }
    async exportExcel() {
        const bordereaux = await this.findAll();
        const fields = ['id', 'reference', 'statut', 'dateReception', 'dateCloture', 'delaiReglement', 'nombreBS'];
        const rows = [fields];
        for (const b of bordereaux) {
            rows.push(fields.map(f => b[f] !== undefined ? b[f] : ''));
        }
        const content = rows.map(r => r.join('\t')).join('\n');
        return Buffer.from(content, 'utf-8');
    }
    async exportPDF() {
        const bordereaux = await this.findAll();
        let content = 'Bordereaux List\n\n';
        for (const b of bordereaux) {
            content += `ID: ${b.id} | Ref: ${b.reference} | Statut: ${b.statut} | Date Reception: ${b.dateReception}\n`;
        }
        return Buffer.from(content, 'utf-8');
    }
    async startScan(id) {
        const bordereau = await this.prisma.bordereau.update({
            where: { id },
            data: {
                statut: { set: client_1.Statut.SCAN_EN_COURS },
                dateDebutScan: new Date(),
            },
            include: {
                client: true,
                contract: true,
            },
        });
        return bordereau_response_dto_1.BordereauResponseDto.fromEntity(bordereau);
    }
    async completeScan(id) {
        const bordereau = await this.prisma.bordereau.update({
            where: { id },
            data: {
                statut: { set: client_1.Statut.SCAN_TERMINE },
                dateFinScan: new Date(),
            },
            include: {
                client: true,
                contract: true,
            },
        });
        return bordereau_response_dto_1.BordereauResponseDto.fromEntity(bordereau);
    }
    async markAsProcessed(id) {
        const bordereau = await this.prisma.bordereau.update({
            where: { id },
            data: {
                statut: { set: client_1.Statut.TRAITE },
            },
            include: {
                client: true,
                contract: true,
            },
        });
        return bordereau_response_dto_1.BordereauResponseDto.fromEntity(bordereau);
    }
    async closeBordereau(id) {
        const bordereau = await this.prisma.bordereau.update({
            where: { id },
            data: {
                statut: { set: client_1.Statut.CLOTURE },
                dateCloture: new Date(),
            },
            include: {
                client: true,
                contract: true,
            },
        });
        return bordereau_response_dto_1.BordereauResponseDto.fromEntity(bordereau);
    }
    async getBSList(bordereauId) {
        return this.prisma.bulletinSoin.findMany({
            where: { bordereauId },
            include: { owner: true },
        });
    }
    async createBS(bordereauId, dto) {
        const bs = await this.prisma.bulletinSoin.create({
            data: {
                bordereauId,
                numBs: dto.numBs,
                etat: dto.etat,
                ownerId: dto.ownerId,
                processedAt: dto.processedAt,
                codeAssure: dto.codeAssure,
                nomAssure: dto.nomAssure,
                nomBeneficiaire: dto.nomBeneficiaire,
                nomSociete: dto.nomSociete,
                matricule: dto.matricule,
                dateSoin: dto.dateSoin,
                montant: dto.montant,
                acte: dto.acte,
                nomPrestation: dto.nomPrestation,
                nomBordereau: dto.nomBordereau,
                lien: dto.lien,
                dateCreation: dto.dateCreation,
                dateMaladie: dto.dateMaladie,
                totalPec: dto.totalPec,
                observationGlobal: dto.observationGlobal,
            },
            include: { owner: true },
        });
        await this.updateBordereauStatusFromBS(bordereauId);
        return bs;
    }
    async updateBS(bsId, dto) {
        const existing = await this.prisma.bulletinSoin.findUnique({ where: { id: bsId } });
        if (!existing)
            throw new Error('BS not found.');
        if (dto.etat && !['IN_PROGRESS', 'VALIDATED', 'REJECTED'].includes(dto.etat)) {
            throw new Error('Invalid BS status transition.');
        }
        const updateData = {};
        if (dto.etat)
            updateData.etat = dto.etat;
        if (dto.ownerId)
            updateData.ownerId = dto.ownerId;
        if (dto.observationGlobal)
            updateData.observationGlobal = dto.observationGlobal;
        const bs = await this.prisma.bulletinSoin.update({
            where: { id: bsId },
            data: updateData,
            include: { owner: true },
        });
        if (dto.etat && dto.etat !== existing.etat) {
            await this.prisma.actionLog.create({
                data: {
                    bordereauId: bs.bordereauId,
                    action: 'BS_STATUS_CHANGE',
                    timestamp: new Date(),
                    details: { bsId, from: existing.etat, to: dto.etat },
                },
            });
        }
        await this.updateBordereauStatusFromBS(bs.bordereauId);
        return bs;
    }
    async updateBordereauStatusFromBS(bordereauId) {
        const bsList = await this.prisma.bulletinSoin.findMany({ where: { bordereauId } });
        const total = bsList.length;
        const validated = bsList.filter(bs => bs.etat === bs_dto_1.BSStatus.VALIDATED).length;
        let newStatus = client_1.Statut.EN_ATTENTE;
        if (validated === 0 && total > 0) {
            newStatus = client_1.Statut.EN_ATTENTE;
        }
        else if (validated < total) {
            newStatus = client_1.Statut.EN_DIFFICULTE;
        }
        else if (validated === total && total > 0) {
            newStatus = client_1.Statut.CLOTURE;
        }
        await this.prisma.bordereau.update({
            where: { id: bordereauId },
            data: { statut: { set: newStatus } },
        });
        return { total, validated, progress: total ? validated / total : 0 };
    }
    async getDocuments(bordereauId) {
        return this.prisma.document.findMany({ where: { bordereauId } });
    }
    async getVirement(bordereauId) {
        return this.prisma.virement.findUnique({ where: { bordereauId } });
    }
    async getAlerts(bordereauId) {
        return this.prisma.alertLog.findMany({ where: { bordereauId } });
    }
    async uploadDocument(bordereauId, documentData) {
        const file = documentData.file;
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        if (!documentData.uploadedById)
            throw new common_1.BadRequestException('uploadedById is required');
        const bordereau = await this.prisma.bordereau.findUnique({ where: { id: bordereauId } });
        if (!bordereau)
            throw new common_1.NotFoundException('Bordereau not found');
        const user = await this.prisma.user.findUnique({ where: { id: documentData.uploadedById } });
        if (!user)
            throw new common_1.NotFoundException('Uploader user not found');
        const uploadDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadDir))
            fs.mkdirSync(uploadDir, { recursive: true });
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const uniqueFilename = `${base}-${uniqueSuffix}${ext}`;
        const filePath = path.join(uploadDir, uniqueFilename);
        fs.writeFileSync(filePath, file.buffer);
        const relativePath = path.relative(path.join(__dirname, '../..'), filePath);
        const document = await this.prisma.document.create({
            data: {
                name: documentData.name || file.originalname,
                type: documentData.type || file.mimetype || 'unknown',
                path: relativePath,
                uploadedById: documentData.uploadedById,
                bordereauId,
            },
        });
        await this.logAction(bordereauId, 'UPLOAD_DOCUMENT');
        return document;
    }
    async analyzeReclamationsAI() {
        const complaints = await this.prisma.reclamation.findMany();
        const { data } = await axios_1.default.post('http://localhost:8001/analyze', complaints);
        return data;
    }
    async getReclamationSuggestions(id) {
        const complaint = await this.prisma.reclamation.findUnique({ where: { id } });
        const { data } = await axios_1.default.post('http://localhost:8001/suggestions', { complaint });
        return data;
    }
    async getTeamRecommendations() {
        try {
            const teams = [];
            const workload = await this.prisma.bordereau.groupBy({ by: ['teamId'], _count: { id: true } });
            const { data } = await axios_1.default.post('http://localhost:8001/recommendations', { teams, workload });
            return data;
        }
        catch (error) {
            this.logger.error('AI microservice error (getTeamRecommendations):', error.message);
            return { message: 'AI microservice unavailable', error: error.message };
        }
    }
    async logAction(bordereauId, action) {
        await this.prisma.actionLog.create({
            data: {
                bordereauId,
                action,
                timestamp: new Date(),
            },
        });
    }
    async findUnassigned() {
        const bordereaux = await this.prisma.bordereau.findMany({
            where: {
                assignedToUserId: null,
                statut: { not: client_1.Statut.CLOTURE },
            },
            include: { client: true, contract: true },
        });
        return bordereaux.map((bordereau) => bordereau_response_dto_1.BordereauResponseDto.fromEntity(bordereau));
    }
    async findByTeam(teamId) {
        const bordereaux = await this.prisma.bordereau.findMany({
            where: {
                teamId,
                statut: { not: client_1.Statut.CLOTURE },
            },
            include: { client: true, contract: true },
        });
        return bordereaux.map(bordereau => bordereau_response_dto_1.BordereauResponseDto.fromEntity(bordereau));
    }
    async findByUser(userId) {
        const bordereaux = await this.prisma.bordereau.findMany({
            where: {
                assignedToUserId: userId,
                statut: { not: client_1.Statut.CLOTURE },
            },
            include: { client: true, contract: true },
        });
        return bordereaux.map(bordereau => bordereau_response_dto_1.BordereauResponseDto.fromEntity(bordereau));
    }
    async returnBordereau(id, reason) {
        const bordereau = await this.prisma.bordereau.update({
            where: { id },
            data: {
                statut: { set: client_1.Statut.EN_DIFFICULTE },
                assignedToUserId: null,
            },
            include: { client: true, contract: true },
        });
        await this.auditLogService.logBordereauEvent(id, 'RETURNED', undefined, { reason });
        await this.alertsService.triggerAlert({
            type: 'RECLAMATION',
            bsId: id,
        });
        return bordereau_response_dto_1.BordereauResponseDto.fromEntity(bordereau);
    }
    async forecastBordereaux(days = 7) {
        const since = new Date();
        since.setDate(since.getDate() - 90);
        const bordereaux = await this.prisma.bordereau.findMany({
            where: { dateReception: { gte: since } },
        });
        if (!bordereaux || bordereaux.length === 0)
            return { forecast: 0, dailyAverage: 0 };
        const daysSpan = Math.max(1, (new Date().getTime() - since.getTime()) / (1000 * 60 * 60 * 24));
        const dailyAverage = bordereaux.length / daysSpan;
        return {
            forecast: Math.round(dailyAverage * days),
            dailyAverage: Number(dailyAverage.toFixed(2)),
        };
    }
    async estimateStaffing(days = 7, avgPerStaffPerDay = 5) {
        const { forecast } = await this.forecastBordereaux(days);
        const staffNeeded = Math.ceil(forecast / avgPerStaffPerDay);
        return { forecast, staffNeeded };
    }
    async getPredictResourcesAI(payload) {
        try {
            const { data } = await axios_1.default.post('http://localhost:8001/predict_resources', payload);
            return data;
        }
        catch (error) {
            return { message: 'AI microservice unavailable', error: error.message };
        }
    }
    async analyzeComplaintsAI() {
        return { message: 'AI complaint analysis not implemented yet.' };
    }
    async updateThresholds(id, thresholds) {
        return this.prisma.contract.update({
            where: { id },
            data: { thresholds },
        });
    }
    async getAIRecommendations() {
        const bordereaux = await this.prisma.bordereau.findMany({
            where: { statut: { not: 'CLOTURE' } },
            include: { client: true, contract: true },
        });
        const now = new Date();
        const recommendations = bordereaux.map(b => {
            let score = 0;
            const daysSinceReception = b.dateReception ? (now.getTime() - new Date(b.dateReception).getTime()) / (1000 * 60 * 60 * 24) : 0;
            let slaThreshold = 5;
            if (b.contract && typeof b.contract.delaiReglement === 'number')
                slaThreshold = b.contract.delaiReglement;
            else if (b.client && typeof b.client.reglementDelay === 'number')
                slaThreshold = b.client.reglementDelay;
            if (daysSinceReception > slaThreshold)
                score += 2;
            else if (daysSinceReception > slaThreshold - 2)
                score += 1;
            const bWithMontant = b;
            if (bWithMontant.montant && bWithMontant.montant > 10000)
                score += 1;
            return { id: b.id, reference: b.reference, score, daysSinceReception, slaThreshold };
        });
        recommendations.sort((a, b) => b.score - a.score);
        return { message: 'AI prioritization complete.', recommendations };
    }
    async searchBordereauxAndDocuments(query) {
        const bordereaux = await this.prisma.bordereau.findMany({
            where: {
                OR: [
                    { reference: { contains: query, mode: 'insensitive' } },
                    { documents: { some: {
                                OR: [
                                    { name: { contains: query, mode: 'insensitive' } },
                                    { type: { contains: query, mode: 'insensitive' } },
                                    { path: { contains: query, mode: 'insensitive' } },
                                ]
                            } } },
                ],
            },
            include: { documents: true, client: true, contract: true },
        });
        return bordereaux;
    }
};
exports.BordereauxService = BordereauxService;
exports.BordereauxService = BordereauxService = BordereauxService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, alerts_service_1.AlertsService])
], BordereauxService);
//# sourceMappingURL=bordereaux.service.js.map