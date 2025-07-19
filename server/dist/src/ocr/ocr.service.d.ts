import { PrismaService } from '../prisma/prisma.service';
import { OcrRequestDto } from './dto/ocr-request.dto';
import { OcrResponseDto } from './dto/ocr-response.dto';
export declare class OcrService {
    private prisma;
    extractText(documentUrl: string): Promise<string>;
    private readonly logger;
    constructor(prisma: PrismaService);
    private checkOcrRole;
    processOcr(file: Express.Multer.File, dto: OcrRequestDto, user: any): Promise<OcrResponseDto>;
    parseFields(rawText: string): {
        reference: string | undefined;
        client: string | undefined;
        date: string | undefined;
        montant: number | undefined;
    };
    parseDate(dateStr: string): string;
    getOcrResult(documentId: string, user: any): Promise<import("@prisma/client/runtime/library").JsonValue>;
    patchOcrResult(documentId: string, correction: any, user: any): Promise<any>;
    getOcrLogs(user: any): Promise<({
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
        processedBy: {
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
        error: string | null;
        id: string;
        documentId: string;
        status: string;
        userId: string;
        processedById: string;
        ocrAt: Date;
    })[]>;
}
