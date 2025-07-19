import { TraitementService } from './traitement.service';
import { AssignTraitementDto } from './dto/assign-traitement.dto';
import { UpdateTraitementStatusDto } from './dto/update-traitement-status.dto';
import { SearchTraitementDto } from './dto/search-traitement.dto';
export declare class TraitementController {
    private readonly traitementService;
    constructor(traitementService: TraitementService);
    globalInbox(query: SearchTraitementDto, req: any): Promise<({
        currentHandler: {
            password: string;
            id: string;
            email: string;
            fullName: string;
            role: string;
            department: string | null;
            active: boolean;
            createdAt: Date;
        } | null;
        team: {
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
    })[]>;
    personalInbox(query: SearchTraitementDto, req: any): Promise<({
        currentHandler: {
            password: string;
            id: string;
            email: string;
            fullName: string;
            role: string;
            department: string | null;
            active: boolean;
            createdAt: Date;
        } | null;
        team: {
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
    })[]>;
    assignTraitement(dto: AssignTraitementDto, req: any): Promise<{
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
    }>;
    updateStatus(dto: UpdateTraitementStatusDto, req: any): Promise<{
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
    }>;
    kpi(req: any): Promise<{
        total: number;
        traite: number;
        enDifficulte: number;
        avgDelay: number | null;
    }>;
    aiRecommendations(req: any): Promise<{
        enDifficulte: number;
        recommendation: string;
    }>;
    exportStats(req: any): Promise<{
        filePath: string;
    }>;
    exportStatsPdf(req: any): Promise<{
        filePath: any;
    }>;
    history(bordereauId: string, req: any): Promise<({
        user: {
            password: string;
            id: string;
            email: string;
            fullName: string;
            role: string;
            department: string | null;
            active: boolean;
            createdAt: Date;
        };
        assignedTo: {
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
        bordereauId: string;
        assignedToId: string | null;
        userId: string;
        action: string;
        fromStatus: string | null;
        toStatus: string | null;
    })[]>;
    exportHistoryExcel(bordereauId: string, req: any, res: any): Promise<void>;
    exportHistoryPdf(bordereauId: string, req: any, res: any): Promise<void>;
}
