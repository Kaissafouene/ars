import { PrismaService } from '../prisma/prisma.service';
export declare class AuditLogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    logBordereauEvent(bordereauId: string, action: string, userId?: string, details?: any): Promise<void>;
    getBordereauHistory(bordereauId: string): Promise<{
        id: string;
        createdAt: Date;
        bordereauId: string;
        userId: string | null;
        action: string;
        details: string | null;
    }[]>;
}
