import { PrismaService } from '../prisma/prisma.service';
import { CreateVirementDto } from './dto/create-virement.dto';
import { SearchVirementDto } from './dto/search-virement.dto';
import { Virement, User } from '@prisma/client';
import { Response } from 'express';
export declare class FinanceService {
    private prisma;
    constructor(prisma: PrismaService);
    private logAuditAction;
    private checkFinanceRole;
    createVirement(dto: CreateVirementDto, user: User): Promise<Virement>;
    confirmVirement(id: string, user: User): Promise<Virement>;
    searchVirements(query: SearchVirementDto, user: User): Promise<({
        bordereau: {
            client: {
                id: string;
                createdAt: Date;
                name: string;
                reglementDelay: number;
                reclamationDelay: number;
                updatedAt: Date;
                slaConfig: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            id: string;
            createdAt: Date;
            clientId: string;
            delaiReglement: number;
            updatedAt: Date;
            contractId: string;
            reference: string;
            dateReception: Date;
            dateDebutScan: Date | null;
            dateFinScan: Date | null;
            dateReceptionSante: Date | null;
            dateCloture: Date | null;
            dateDepotVirement: Date | null;
            dateExecutionVirement: Date | null;
            statut: import(".prisma/client").$Enums.Statut;
            nombreBS: number;
            currentHandlerId: string | null;
            teamId: string | null;
            assignedToUserId: string | null;
            prestataireId: string | null;
            priority: number;
        };
        confirmedBy: {
            password: string;
            id: string;
            email: string;
            fullName: string;
            role: string;
            department: string | null;
            active: boolean;
            createdAt: Date;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        priority: number;
        bordereauId: string;
        montant: number;
        referenceBancaire: string;
        dateDepot: Date;
        dateExecution: Date;
        confirmed: boolean;
        confirmedById: string | null;
        confirmedAt: Date | null;
    })[]>;
    getVirementById(id: string, user: User): Promise<{
        bordereau: {
            client: {
                id: string;
                createdAt: Date;
                name: string;
                reglementDelay: number;
                reclamationDelay: number;
                updatedAt: Date;
                slaConfig: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            id: string;
            createdAt: Date;
            clientId: string;
            delaiReglement: number;
            updatedAt: Date;
            contractId: string;
            reference: string;
            dateReception: Date;
            dateDebutScan: Date | null;
            dateFinScan: Date | null;
            dateReceptionSante: Date | null;
            dateCloture: Date | null;
            dateDepotVirement: Date | null;
            dateExecutionVirement: Date | null;
            statut: import(".prisma/client").$Enums.Statut;
            nombreBS: number;
            currentHandlerId: string | null;
            teamId: string | null;
            assignedToUserId: string | null;
            prestataireId: string | null;
            priority: number;
        };
        confirmedBy: {
            password: string;
            id: string;
            email: string;
            fullName: string;
            role: string;
            department: string | null;
            active: boolean;
            createdAt: Date;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        priority: number;
        bordereauId: string;
        montant: number;
        referenceBancaire: string;
        dateDepot: Date;
        dateExecution: Date;
        confirmed: boolean;
        confirmedById: string | null;
        confirmedAt: Date | null;
    }>;
    exportVirements(format: string, query: SearchVirementDto, user: User, res: Response): Promise<void>;
    autoConfirmVirements(): Promise<{
        autoConfirmed: number;
    }>;
}
