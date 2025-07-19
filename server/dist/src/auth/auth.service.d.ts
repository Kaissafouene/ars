import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private jwtService;
    private usersService;
    private prisma;
    constructor(jwtService: JwtService, usersService: UsersService, prisma: PrismaService);
    validateUser(email: string, password: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: string;
        department: string | null;
        active: boolean;
        createdAt: Date;
    }>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            role: any;
        };
    }>;
    register(data: {
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
    initiatePasswordReset(email: string): Promise<void>;
    confirmPasswordReset(token: string, newPassword: string): Promise<void>;
}
