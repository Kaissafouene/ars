import { PrismaService } from '../prisma/prisma.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { SearchContractDto } from './dto/search-contract.dto';
import * as ExcelJS from 'exceljs';
export declare class ContractsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private checkRole;
    isClientExists(clientId: string): Promise<boolean>;
    hasContractOverlap(clientId: string, startDate: string, endDate: string): Promise<boolean>;
    createContract(dto: CreateContractDto, file: Express.Multer.File, user: any): Promise<{
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
    updateContract(id: string, dto: UpdateContractDto, user: any): Promise<{
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
    deleteContract(id: string, user: any): Promise<{
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
    getContract(id: string, user: any): Promise<({
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
    searchContracts(query: SearchContractDto, user: any): Promise<({
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
    getContractHistory(id: string, user: any): Promise<({
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
    exportContractsExcel(query: SearchContractDto, user: any): Promise<{
        file: ExcelJS.Buffer;
        filename: string;
        contentType: string;
    }>;
    exportContractsPdf(query: SearchContractDto, user: any): Promise<unknown>;
    checkSlaBreaches(): Promise<{
        breached: any[];
    }>;
    getContractStatistics(user: any): Promise<{
        total: number;
        active: number;
        expired: number;
        expiringSoon: number;
        slaCompliant: number;
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
