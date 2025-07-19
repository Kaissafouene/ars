import { OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit {
    private _syncLog;
    private _auditLog;
    actionLog: any;
    get auditLog(): any;
    set auditLog(value: any);
    private _passwordResetToken;
    get passwordResetToken(): any;
    set passwordResetToken(value: any);
    get syncLog(): any;
    set syncLog(value: any);
    onModuleInit(): Promise<void>;
    enableShutdownHooks(app: INestApplication): Promise<void>;
}
