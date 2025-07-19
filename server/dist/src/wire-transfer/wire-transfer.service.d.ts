import { PrismaService } from '../prisma/prisma.service';
import { Society, Member, DonneurDOrdre, WireTransferBatch, WireTransfer, WireTransferBatchStatus } from '@prisma/client';
export declare class WireTransferService {
    private prisma;
    previewBatch(file: Express.Multer.File, body: any): Promise<{
        success: boolean;
        transfers: any[];
        errors: any[];
    }>;
    uploadAndProcessBatch(file: Express.Multer.File, body: any): Promise<{
        success: boolean;
        errors: any[];
        batch?: undefined;
    } | {
        success: boolean;
        batch: {
            transfers: {
                error: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                reference: string;
                status: string;
                donneurId: string;
                amount: number;
                memberId: string;
                batchId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.WireTransferBatchStatus;
            societyId: string;
            donneurId: string;
            fileName: string | null;
            fileType: string | null;
            archived: boolean;
        };
        errors?: undefined;
    }>;
    generateBatchPdf(batchId: string): Promise<Buffer>;
    generateBatchTxt(batchId: string): Promise<Buffer>;
    archiveBatch(batchId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.WireTransferBatchStatus;
        societyId: string;
        donneurId: string;
        fileName: string | null;
        fileType: string | null;
        archived: boolean;
    }>;
    getDashboardStats(): Promise<{
        total: number;
        archived: number;
        processed: number;
        pending: number;
    }>;
    getDashboardAnalytics(query: any, user: any): Promise<{
        analytics: {
            id: string;
            society: string;
            donneur: string;
            status: import(".prisma/client").$Enums.WireTransferBatchStatus;
            delayHours: number;
            color: string;
            createdAt: Date;
            updatedAt: Date;
            totalAmount: number;
            transfersCount: number;
            fileName: string | null;
        }[];
        kpis: {
            total: number;
            pending: number;
            processed: number;
            archived: number;
            avgDelay: number;
        };
    }>;
    exportDashboardAnalyticsExcel(query: any, user: any): Promise<any>;
    exportDashboardAnalyticsPdf(query: any, user: any): Promise<Buffer<ArrayBufferLike>>;
    getAlerts(user?: any): Promise<{
        errorTransfers: ({
            member: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                cin: string | null;
                societyId: string;
                rib: string;
                address: string | null;
            };
            batch: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.WireTransferBatchStatus;
                societyId: string;
                donneurId: string;
                fileName: string | null;
                fileType: string | null;
                archived: boolean;
            };
        } & {
            error: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            reference: string;
            status: string;
            donneurId: string;
            amount: number;
            memberId: string;
            batchId: string;
        })[];
        delayedBatches: ({
            transfers: {
                error: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                reference: string;
                status: string;
                donneurId: string;
                amount: number;
                memberId: string;
                batchId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.WireTransferBatchStatus;
            societyId: string;
            donneurId: string;
            fileName: string | null;
            fileType: string | null;
            archived: boolean;
        })[];
    }>;
    constructor(prisma: PrismaService);
    createSociety(data: Partial<Society>): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        code: string;
    }>;
    getSocieties(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        code: string;
    }[]>;
    getSociety(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        code: string;
    }>;
    updateSociety(id: string, data: Partial<Society>): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        code: string;
    }>;
    deleteSociety(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        code: string;
    }>;
    createMember(data: Partial<Member>): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        cin: string | null;
        societyId: string;
        rib: string;
        address: string | null;
    }>;
    getMembers(societyId?: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        cin: string | null;
        societyId: string;
        rib: string;
        address: string | null;
    }[]>;
    getMember(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        cin: string | null;
        societyId: string;
        rib: string;
        address: string | null;
    }>;
    updateMember(id: string, data: Partial<Member>): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        cin: string | null;
        societyId: string;
        rib: string;
        address: string | null;
    }>;
    deleteMember(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        cin: string | null;
        societyId: string;
        rib: string;
        address: string | null;
    }>;
    createDonneur(data: Partial<DonneurDOrdre>): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        societyId: string;
        rib: string;
    }>;
    getDonneurs(societyId?: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        societyId: string;
        rib: string;
    }[]>;
    getDonneur(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        societyId: string;
        rib: string;
    }>;
    updateDonneur(id: string, data: Partial<DonneurDOrdre>): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        societyId: string;
        rib: string;
    }>;
    deleteDonneur(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        societyId: string;
        rib: string;
    }>;
    createBatch(data: Partial<WireTransferBatch>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.WireTransferBatchStatus;
        societyId: string;
        donneurId: string;
        fileName: string | null;
        fileType: string | null;
        archived: boolean;
    }>;
    getBatches(societyId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.WireTransferBatchStatus;
        societyId: string;
        donneurId: string;
        fileName: string | null;
        fileType: string | null;
        archived: boolean;
    }[]>;
    getBatch(id: string): Promise<{
        society: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            code: string;
        };
        history: {
            id: string;
            status: import(".prisma/client").$Enums.WireTransferBatchStatus;
            batchId: string;
            changedBy: string | null;
            changedAt: Date;
        }[];
        donneur: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            societyId: string;
            rib: string;
        };
        transfers: {
            error: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            reference: string;
            status: string;
            donneurId: string;
            amount: number;
            memberId: string;
            batchId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.WireTransferBatchStatus;
        societyId: string;
        donneurId: string;
        fileName: string | null;
        fileType: string | null;
        archived: boolean;
    }>;
    updateBatch(id: string, data: Partial<WireTransferBatch>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.WireTransferBatchStatus;
        societyId: string;
        donneurId: string;
        fileName: string | null;
        fileType: string | null;
        archived: boolean;
    }>;
    deleteBatch(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.WireTransferBatchStatus;
        societyId: string;
        donneurId: string;
        fileName: string | null;
        fileType: string | null;
        archived: boolean;
    }>;
    createTransfer(data: Partial<WireTransfer>): Promise<{
        error: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        reference: string;
        status: string;
        donneurId: string;
        amount: number;
        memberId: string;
        batchId: string;
    }>;
    getTransfers(batchId?: string): Promise<{
        error: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        reference: string;
        status: string;
        donneurId: string;
        amount: number;
        memberId: string;
        batchId: string;
    }[]>;
    getTransfer(id: string): Promise<{
        member: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            cin: string | null;
            societyId: string;
            rib: string;
            address: string | null;
        };
        history: {
            error: string | null;
            id: string;
            status: string;
            changedBy: string | null;
            changedAt: Date;
            transferId: string;
        }[];
        donneur: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            societyId: string;
            rib: string;
        };
        batch: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.WireTransferBatchStatus;
            societyId: string;
            donneurId: string;
            fileName: string | null;
            fileType: string | null;
            archived: boolean;
        };
    } & {
        error: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        reference: string;
        status: string;
        donneurId: string;
        amount: number;
        memberId: string;
        batchId: string;
    }>;
    updateTransfer(id: string, data: Partial<WireTransfer>): Promise<{
        error: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        reference: string;
        status: string;
        donneurId: string;
        amount: number;
        memberId: string;
        batchId: string;
    }>;
    deleteTransfer(id: string): Promise<{
        error: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        reference: string;
        status: string;
        donneurId: string;
        amount: number;
        memberId: string;
        batchId: string;
    }>;
    addBatchHistory(batchId: string, status: WireTransferBatchStatus, changedBy?: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.WireTransferBatchStatus;
        batchId: string;
        changedBy: string | null;
        changedAt: Date;
    }>;
    addTransferHistory(transferId: string, status: string, error?: string, changedBy?: string): Promise<{
        error: string | null;
        id: string;
        status: string;
        changedBy: string | null;
        changedAt: Date;
        transferId: string;
    }>;
    getBatchHistory(batchId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.WireTransferBatchStatus;
        batchId: string;
        changedBy: string | null;
        changedAt: Date;
    }[]>;
    getTransferHistory(transferId: string): Promise<{
        error: string | null;
        id: string;
        status: string;
        changedBy: string | null;
        changedAt: Date;
        transferId: string;
    }[]>;
}
