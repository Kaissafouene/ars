import { PrismaService } from '../prisma/prisma.service';
import { OutlookService } from './outlook.service';
export declare class TuniclaimService {
    private prisma;
    private outlook;
    syncBordereaux(): Promise<void>;
    private readonly logger;
    private readonly baseUrl;
    constructor(prisma: PrismaService, outlook: OutlookService);
    lastSync: string | null;
    lastResult: {
        imported: number;
        errors: number;
    } | null;
    fetchBsList(): Promise<any[]>;
    fetchBsDetails(bsId: string): Promise<any>;
    syncBs(): Promise<{
        imported: number;
        errors: number;
        error?: string;
    }>;
    getLastSyncLog(): Promise<any>;
    getSyncLogs(limit?: number): Promise<any>;
    private getDefaultManagerId;
    private resolveClientId;
    private resolveContractId;
}
