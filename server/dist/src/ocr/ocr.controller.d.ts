import { OcrService } from './ocr.service';
import { OcrRequestDto } from './dto/ocr-request.dto';
export declare class OcrController {
    private readonly ocrService;
    constructor(ocrService: OcrService);
    processOcr(file: Express.Multer.File, dto: OcrRequestDto, req: any): Promise<import("./dto/ocr-response.dto").OcrResponseDto>;
    getOcrResult(docId: string, req: any): Promise<import("@prisma/client/runtime/library").JsonValue>;
    patchOcrResult(docId: string, correction: any, req: any): Promise<any>;
    getOcrLogs(req: any): Promise<({
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
