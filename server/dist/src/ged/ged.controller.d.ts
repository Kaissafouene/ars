import { GedService } from './ged.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { SearchDocumentDto } from './dto/search-document.dto';
export declare class GedController {
    private readonly gedService;
    constructor(gedService: GedService);
    uploadDocument(file: Express.Multer.File, body: CreateDocumentDto, req: any): Promise<{
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
    seedDemo(req: any): Promise<{
        message: string;
    }>;
    searchDocuments(query: SearchDocumentDto, req: any): Promise<({
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
    getDocumentStats(req: any): Promise<{
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
    getSlaBreaches(req: any): Promise<{
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
    getSlaStatus(req: any): Promise<{
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
    getDocumentAudit(id: string, req: any): Promise<any>;
    assignDocument(id: string, body: {
        assignedToUserId?: string;
        teamId?: string;
    }, req: any): Promise<{
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
    updateDocumentStatus(id: string, body: {
        status: string;
    }, req: any): Promise<any>;
    tagDocument(id: string, tags: {
        type?: string;
        bordereauId?: string;
    }, req: any): Promise<{
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
    deleteDocument(id: string, req: any): Promise<{
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
    getDocument(id: string, req: any): Promise<{
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
}
