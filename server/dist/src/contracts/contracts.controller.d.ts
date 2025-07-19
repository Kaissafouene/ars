import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { SearchContractDto } from './dto/search-contract.dto';
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    createContract(file: Express.Multer.File, dto: CreateContractDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        clientId: string;
        clientName: string;
        delaiReglement: number;
        delaiReclamation: number;
        escalationThreshold: number | null;
        documentPath: string;
        assignedManagerId: string;
        startDate: Date;
        endDate: Date;
        signature: string | null;
        updatedAt: Date;
        version: number;
        thresholds: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    updateContract(id: string, dto: UpdateContractDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        clientId: string;
        clientName: string;
        delaiReglement: number;
        delaiReclamation: number;
        escalationThreshold: number | null;
        documentPath: string;
        assignedManagerId: string;
        startDate: Date;
        endDate: Date;
        signature: string | null;
        updatedAt: Date;
        version: number;
        thresholds: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    deleteContract(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        clientId: string;
        clientName: string;
        delaiReglement: number;
        delaiReclamation: number;
        escalationThreshold: number | null;
        documentPath: string;
        assignedManagerId: string;
        startDate: Date;
        endDate: Date;
        signature: string | null;
        updatedAt: Date;
        version: number;
        thresholds: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getContract(id: string, req: any): Promise<({
        assignedManager: {
            password: string;
            id: string;
            email: string;
            fullName: string;
            role: string;
            department: string | null;
            active: boolean;
            createdAt: Date;
        };
        history: {
            id: string;
            contractId: string;
            modifiedById: string;
            modifiedAt: Date;
            changes: import("@prisma/client/runtime/library").JsonValue;
        }[];
    } & {
        id: string;
        createdAt: Date;
        clientId: string;
        clientName: string;
        delaiReglement: number;
        delaiReclamation: number;
        escalationThreshold: number | null;
        documentPath: string;
        assignedManagerId: string;
        startDate: Date;
        endDate: Date;
        signature: string | null;
        updatedAt: Date;
        version: number;
        thresholds: import("@prisma/client/runtime/library").JsonValue | null;
    }) | null>;
    searchContracts(query: SearchContractDto, req: any): Promise<({
        assignedManager: {
            password: string;
            id: string;
            email: string;
            fullName: string;
            role: string;
            department: string | null;
            active: boolean;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        clientId: string;
        clientName: string;
        delaiReglement: number;
        delaiReclamation: number;
        escalationThreshold: number | null;
        documentPath: string;
        assignedManagerId: string;
        startDate: Date;
        endDate: Date;
        signature: string | null;
        updatedAt: Date;
        version: number;
        thresholds: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    getContractHistory(id: string, req: any): Promise<({
        modifiedBy: {
            password: string;
            id: string;
            email: string;
            fullName: string;
            role: string;
            department: string | null;
            active: boolean;
            createdAt: Date;
        };
    } & {
        id: string;
        contractId: string;
        modifiedById: string;
        modifiedAt: Date;
        changes: import("@prisma/client/runtime/library").JsonValue;
    })[]>;
    getAllContracts(req: any): Promise<({
        assignedManager: {
            password: string;
            id: string;
            email: string;
            fullName: string;
            role: string;
            department: string | null;
            active: boolean;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        clientId: string;
        clientName: string;
        delaiReglement: number;
        delaiReclamation: number;
        escalationThreshold: number | null;
        documentPath: string;
        assignedManagerId: string;
        startDate: Date;
        endDate: Date;
        signature: string | null;
        updatedAt: Date;
        version: number;
        thresholds: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    exportContractsExcel(req: any, query: SearchContractDto, res: any): Promise<void>;
    exportContractsPdf(req: any, query: SearchContractDto, res: any): Promise<void>;
    getContractStatistics(req: any): Promise<{
        total: number;
        active: number;
        expired: number;
        expiringSoon: number;
        slaCompliant: number;
    }>;
    checkSlaBreaches(): Promise<{
        breached: any[];
    }>;
    associateContractsToBordereaux(): Promise<{
        associated: number;
    }>;
    triggerContractReminders(): Promise<{
        remindersSent: number;
    }>;
    indexContractsForGed(): Promise<{
        indexed: number;
    }>;
    linkContractsToComplaints(): Promise<{
        linked: number;
    }>;
}
