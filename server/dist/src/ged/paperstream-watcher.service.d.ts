import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from './notification.service';
import { OcrService } from '../ocr/ocr.service';
export declare class PaperStreamWatcherService implements OnModuleInit, OnModuleDestroy {
    private prisma;
    private notificationService;
    private ocrService;
    private readonly logger;
    private watcher;
    private readonly watchDir;
    private readonly allowedTypes;
    private readonly maxSize;
    constructor(prisma: PrismaService, notificationService: NotificationService, ocrService: OcrService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private handleFileAdd;
    private computeFileHash;
    private logAction;
}
