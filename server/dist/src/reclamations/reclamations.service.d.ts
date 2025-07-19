import { PrismaService } from '../prisma/prisma.service';
import { CreateReclamationDto } from './dto/create-reclamation.dto';
import { UpdateReclamationDto } from './dto/update-reclamation.dto';
import { SearchReclamationDto } from './dto/search-reclamation.dto';
import { NotificationService } from './notification.service';
export declare class ReclamationsService {
    private prisma;
    notificationService: NotificationService;
    constructor(prisma: PrismaService, notificationService: NotificationService);
    bulkUpdate(ids: string[], data: any, user: any): Promise<{
        updated: number;
    }>;
    bulkAssign(ids: string[], assignedToId: string, user: any): Promise<{
        updated: number;
    }>;
    getSlaBreaches(user: any): Promise<({
        client: {
            id: string;
            createdAt: Date;
            name: string;
            reglementDelay: number;
            reclamationDelay: number;
            updatedAt: Date;
            slaConfig: import("@prisma/client/runtime/library").JsonValue | null;
        };
        contract: {
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
        } | null;
    } & {
        id: string;
        department: string | null;
        createdAt: Date;
        clientId: string;
        updatedAt: Date;
        contractId: string | null;
        priority: number;
        documentId: string | null;
        bordereauId: string | null;
        type: string;
        severity: string;
        status: string;
        description: string;
        assignedToId: string | null;
        createdById: string;
        evidencePath: string | null;
        processId: string | null;
    })[]>;
    checkSla(user: any): Promise<{
        checked: boolean;
        breaches: number;
    }>;
    getGecDocument(id: string, user: any): Promise<{
        documentUrl: string;
        error?: undefined;
    } | {
        error: string;
        documentUrl?: undefined;
    }>;
    aiPredict(text: string, user: any): Promise<{
        prediction: string;
    }>;
    private checkRole;
    autoAssign(department?: string): Promise<string | undefined>;
    createReclamation(dto: CreateReclamationDto, user: any): Promise<{
        id: string;
        department: string | null;
        createdAt: Date;
        clientId: string;
        updatedAt: Date;
        contractId: string | null;
        priority: number;
        documentId: string | null;
        bordereauId: string | null;
        type: string;
        severity: string;
        status: string;
        description: string;
        assignedToId: string | null;
        createdById: string;
        evidencePath: string | null;
        processId: string | null;
    }>;
    updateReclamation(id: string, dto: UpdateReclamationDto, user: any): Promise<{
        id: string;
        department: string | null;
        createdAt: Date;
        clientId: string;
        updatedAt: Date;
        contractId: string | null;
        priority: number;
        documentId: string | null;
        bordereauId: string | null;
        type: string;
        severity: string;
        status: string;
        description: string;
        assignedToId: string | null;
        createdById: string;
        evidencePath: string | null;
        processId: string | null;
    }>;
    assignReclamation(id: string, assignedToId: string, user: any): Promise<{
        id: string;
        department: string | null;
        createdAt: Date;
        clientId: string;
        updatedAt: Date;
        contractId: string | null;
        priority: number;
        documentId: string | null;
        bordereauId: string | null;
        type: string;
        severity: string;
        status: string;
        description: string;
        assignedToId: string | null;
        createdById: string;
        evidencePath: string | null;
        processId: string | null;
    }>;
    escalateReclamation(id: string, user: any): Promise<{
        id: string;
        department: string | null;
        createdAt: Date;
        clientId: string;
        updatedAt: Date;
        contractId: string | null;
        priority: number;
        documentId: string | null;
        bordereauId: string | null;
        type: string;
        severity: string;
        status: string;
        description: string;
        assignedToId: string | null;
        createdById: string;
        evidencePath: string | null;
        processId: string | null;
    }>;
    getReclamation(id: string, user: any): Promise<({
        process: {
            id: string;
            name: string;
            description: string | null;
        } | null;
        bordereau: {
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
        } | null;
        client: {
            id: string;
            createdAt: Date;
            name: string;
            reglementDelay: number;
            reclamationDelay: number;
            updatedAt: Date;
            slaConfig: import("@prisma/client/runtime/library").JsonValue | null;
        };
        contract: {
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
        } | null;
        document: {
            id: string;
            name: string;
            bordereauId: string | null;
            type: string;
            status: import(".prisma/client").$Enums.DocumentStatus | null;
            uploadedById: string;
            path: string;
            uploadedAt: Date;
            ocrResult: import("@prisma/client/runtime/library").JsonValue | null;
            hash: string | null;
            ocrText: string | null;
        } | null;
        history: ({
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
        } & {
            id: string;
            createdAt: Date;
            description: string | null;
            userId: string;
            action: string;
            fromStatus: string | null;
            toStatus: string | null;
            reclamationId: string;
            isRecurrent: boolean | null;
            aiSuggestions: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
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
        createdBy: {
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
        department: string | null;
        createdAt: Date;
        clientId: string;
        updatedAt: Date;
        contractId: string | null;
        priority: number;
        documentId: string | null;
        bordereauId: string | null;
        type: string;
        severity: string;
        status: string;
        description: string;
        assignedToId: string | null;
        createdById: string;
        evidencePath: string | null;
        processId: string | null;
    }) | null>;
    searchReclamations(query: SearchReclamationDto, user: any): Promise<({
        process: {
            id: string;
            name: string;
            description: string | null;
        } | null;
        bordereau: {
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
        } | null;
        client: {
            id: string;
            createdAt: Date;
            name: string;
            reglementDelay: number;
            reclamationDelay: number;
            updatedAt: Date;
            slaConfig: import("@prisma/client/runtime/library").JsonValue | null;
        };
        contract: {
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
        } | null;
        document: {
            id: string;
            name: string;
            bordereauId: string | null;
            type: string;
            status: import(".prisma/client").$Enums.DocumentStatus | null;
            uploadedById: string;
            path: string;
            uploadedAt: Date;
            ocrResult: import("@prisma/client/runtime/library").JsonValue | null;
            hash: string | null;
            ocrText: string | null;
        } | null;
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
        createdBy: {
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
        department: string | null;
        createdAt: Date;
        clientId: string;
        updatedAt: Date;
        contractId: string | null;
        priority: number;
        documentId: string | null;
        bordereauId: string | null;
        type: string;
        severity: string;
        status: string;
        description: string;
        assignedToId: string | null;
        createdById: string;
        evidencePath: string | null;
        processId: string | null;
    })[]>;
    getReclamationHistory(id: string, user: any): Promise<({
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
    } & {
        id: string;
        createdAt: Date;
        description: string | null;
        userId: string;
        action: string;
        fromStatus: string | null;
        toStatus: string | null;
        reclamationId: string;
        isRecurrent: boolean | null;
        aiSuggestions: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    getCorrelationAI(payload: any): Promise<any>;
    aiAnalysis(user: any): Promise<{
        byType: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ReclamationGroupByOutputType, "type"[]> & {
            _count: {
                id: number;
            };
        })[];
        byClient: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ReclamationGroupByOutputType, "clientId"[]> & {
            _count: {
                id: number;
            };
        })[];
        bySeverity: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ReclamationGroupByOutputType, "severity"[]> & {
            _count: {
                id: number;
            };
        })[];
        byDepartment: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ReclamationGroupByOutputType, "department"[]> & {
            _count: {
                id: number;
            };
        })[];
        byContract: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ReclamationGroupByOutputType, "contractId"[]> & {
            _count: {
                id: number;
            };
        })[];
        byProcess: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ReclamationGroupByOutputType, "processId"[]> & {
            _count: {
                id: number;
            };
        })[];
        rootCause: string;
    }>;
    analytics(user: any): Promise<{
        total: number;
        open: number;
        resolved: number;
        byType: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ReclamationGroupByOutputType, "type"[]> & {
            _count: {
                id: number;
            };
        })[];
        bySeverity: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ReclamationGroupByOutputType, "severity"[]> & {
            _count: {
                id: number;
            };
        })[];
        byDepartment: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ReclamationGroupByOutputType, "department"[]> & {
            _count: {
                id: number;
            };
        })[];
        avgResolution: number;
        minResolution: number;
        maxResolution: number;
        byUser: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ReclamationGroupByOutputType, "assignedToId"[]> & {
            _count: {
                id: number;
            };
        })[];
        byManager: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ReclamationGroupByOutputType, "createdById"[]> & {
            _count: {
                id: number;
            };
        })[];
    }>;
    trend(user: any): Promise<{
        date: Date;
        count: number;
    }[]>;
    convertToTask(id: string, user: any): Promise<{
        taskCreated: boolean;
        reclamationId: string;
    }>;
    autoReplySuggestion(id: string, user: any): Promise<{
        suggestion: null;
    } | {
        suggestion: string;
    }>;
    sendNotification(type: string, reclamation: any): Promise<boolean>;
    generateGecDocument(reclamationId: string, user: any): Promise<boolean>;
}
