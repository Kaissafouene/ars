import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { SearchDocumentDto } from './dto/search-document.dto';
import { Document, User } from '@prisma/client';
import { NotificationService } from './notification.service';
export declare class GedService {
    private prisma;
    private notificationService;
    constructor(prisma: PrismaService, notificationService: NotificationService);
    getSlaBreaches(user: User): Promise<{
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
    }[]>;
    getSlaStatus(user: User): Promise<{
        slaStatus: string;
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
    }[]>;
    getDocumentAudit(id: string, user: User): Promise<any>;
    assignDocument(id: string, body: {
        assignedToUserId?: string;
        teamId?: string;
    }, user: User): Promise<{
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
    }>;
    getDocumentStats(user: User): Promise<{
        total: number;
        byType: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.DocumentGroupByOutputType, "type"[]> & {
            _count: {
                type: number;
            };
        })[];
        recent: {
            id: string;
            name: string;
            type: string;
            uploadedAt: Date;
        }[];
    }>;
    updateDocumentStatus(id: string, status: string, user: User): Promise<any>;
    uploadDocument(file: Express.Multer.File, dto: CreateDocumentDto, user: User): Promise<Document>;
    searchDocuments(query: SearchDocumentDto, user: User): Promise<({
        bordereau: ({
            prestataire: {
                id: string;
                name: string;
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
        }) | null;
        uploader: {
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
    })[]>;
    getDocumentById(id: string, user: User): Promise<{
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
        uploader: {
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
    }>;
    tagDocument(id: string, tags: {
        type?: string;
        bordereauId?: string;
    }, user: User): Promise<{
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
    }>;
    deleteDocument(id: string, user: User): Promise<{
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
    }>;
}
