import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(req: any): Promise<any>;
    getUser(id: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: string;
        department: string | null;
        active: boolean;
        createdAt: Date;
    } | null>;
    createUser(body: {
        email: string;
        password: string;
        fullName: string;
        role: string;
    }): Promise<{
        password: undefined;
        id: string;
        email: string;
        fullName: string;
        role: string;
        department: string | null;
        active: boolean;
        createdAt: Date;
    }>;
    updateUser(id: string, body: Partial<{
        email: string;
        password: string;
        fullName: string;
        role: string;
    }>): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: string;
        department: string | null;
        active: boolean;
        createdAt: Date;
    }>;
    deleteUser(id: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: string;
        department: string | null;
        active: boolean;
        createdAt: Date;
    }>;
    getUserAuditLogs(id: string): Promise<any>;
    disableUser(id: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: string;
        department: string | null;
        active: boolean;
        createdAt: Date;
    }>;
    resetUserPassword(id: string, body: {
        password: string;
    }): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: string;
        department: string | null;
        active: boolean;
        createdAt: Date;
    }>;
}
