import { FinanceService } from './finance.service';
import { CreateVirementDto } from './dto/create-virement.dto';
import { SearchVirementDto } from './dto/search-virement.dto';
import { Response } from 'express';
export declare class FinanceController {
    private readonly financeService;
    constructor(financeService: FinanceService);
    createVirement(dto: CreateVirementDto, req: any): Promise<{
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
    confirmVirement(id: string, req: any): Promise<{
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
    searchVirements(query: SearchVirementDto, req: any): Promise<({
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
    getVirement(id: string, req: any): Promise<{
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
    exportVirements(format: string, query: SearchVirementDto, req: any, res: Response): Promise<void>;
    autoConfirmVirements(req: any): Promise<{
        autoConfirmed: number;
    }>;
}
