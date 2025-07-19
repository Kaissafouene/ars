import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<{
        password: string;
        id: string;
        email: string;
        fullName: string;
        role: string;
        department: string | null;
        active: boolean;
        createdAt: Date;
    } | null>;
    create(data: {
        email: string;
        password: string;
        fullName: string;
        role: string;
    }): Promise<{
        password: string;
        id: string;
        email: string;
        fullName: string;
        role: string;
        department: string | null;
        active: boolean;
        createdAt: Date;
    }>;
    findById(id: string): Promise<{
        password: string;
        id: string;
        email: string;
        fullName: string;
        role: string;
        department: string | null;
        active: boolean;
        createdAt: Date;
    } | null>;
    findAll(): Promise<{
        password: string;
        id: string;
        email: string;
        fullName: string;
        role: string;
        department: string | null;
        active: boolean;
        createdAt: Date;
    }[]>;
    findByRole(role: string): Promise<{
        password: string;
        id: string;
        email: string;
        fullName: string;
        role: string;
        department: string | null;
        active: boolean;
        createdAt: Date;
    }[]>;
    update(id: string, data: Partial<{
        email: string;
        password: string;
        fullName: string;
        role: string;
    }>): Promise<{
        password: string;
        id: string;
        email: string;
        fullName: string;
        role: string;
        department: string | null;
        active: boolean;
        createdAt: Date;
    }>;
    delete(id: string): Promise<{
        password: string;
        id: string;
        email: string;
        fullName: string;
        role: string;
        department: string | null;
        active: boolean;
        createdAt: Date;
    }>;
    disableUser(id: string): Promise<{
        password: string;
        id: string;
        email: string;
        fullName: string;
        role: string;
        department: string | null;
        active: boolean;
        createdAt: Date;
    }>;
    resetPassword(id: string, newPassword: string): Promise<{
        password: string;
        id: string;
        email: string;
        fullName: string;
        role: string;
        department: string | null;
        active: boolean;
        createdAt: Date;
    }>;
    getAuditLogsForUser(userId: string): Promise<any>;
    logAction(userId: string, action: string, details?: any): Promise<void>;
}
