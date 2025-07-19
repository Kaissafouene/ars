import { PrismaService } from '../prisma/prisma.service';
import { AssignTraitementDto } from './dto/assign-traitement.dto';
import { UpdateTraitementStatusDto } from './dto/update-traitement-status.dto';
import { SearchTraitementDto } from './dto/search-traitement.dto';
export declare class TraitementService {
    private prisma;
    constructor(prisma: PrismaService);
    private checkRole;
    globalInbox(query: SearchTraitementDto, user: any): Promise<({
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
    personalInbox(user: any, query: SearchTraitementDto): Promise<({
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
    assignTraitement(dto: AssignTraitementDto, user: any): Promise<{
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
    updateStatus(dto: UpdateTraitementStatusDto, user: any): Promise<{
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
    kpi(user: any): Promise<{
        total: number;
        traite: number;
        enDifficulte: number;
        avgDelay: number | null;
    }>;
    aiRecommendations(user: any): Promise<{
        enDifficulte: number;
        recommendation: string;
    }>;
    exportStats(user: any): Promise<{
        filePath: string;
    }>;
    exportStatsPdf(user: any): Promise<{
        filePath: any;
    }>;
    history(bordereauId: string, user: any): Promise<({
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
    exportHistoryExcel(bordereauId: string, user: any): Promise<{
        filePath: any;
    }>;
    exportHistoryPdf(bordereauId: string, user: any): Promise<{
        filePath: any;
    }>;
}
