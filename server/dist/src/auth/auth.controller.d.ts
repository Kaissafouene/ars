import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            role: any;
        };
    }>;
    register(body: {
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
    logout(req: any): Promise<{
        message: string;
    }>;
    passwordResetRequest(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    passwordResetConfirm(body: {
        token: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
}
