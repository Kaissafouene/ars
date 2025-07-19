"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
const user_role_enum_1 = require("./user-role.enum");
const password_utils_1 = require("./password.utils");
const crypto_1 = require("crypto");
const date_fns_1 = require("date-fns");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    jwtService;
    usersService;
    prisma;
    constructor(jwtService, usersService, prisma) {
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.prisma = prisma;
    }
    async validateUser(email, password) {
        if ((0, password_utils_1.isLockedOut)(email)) {
            throw new common_1.ForbiddenException('Account locked due to too many failed attempts. Try again later.');
        }
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            (0, password_utils_1.resetLockout)(email);
            const { password, ...result } = user;
            await this.usersService.logAction(user.id, 'LOGIN_SUCCESS');
            return result;
        }
        const locked = (0, password_utils_1.recordFailedAttempt)(email);
        if (user)
            await this.usersService.logAction(user.id, 'LOGIN_FAIL');
        if (locked)
            throw new common_1.ForbiddenException('Account locked due to too many failed attempts.');
        throw new common_1.UnauthorizedException('Invalid credentials');
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        let expiresIn = process.env.JWT_EXPIRES_IN || '1d';
        if (expiresIn.startsWith('"') && expiresIn.endsWith('"')) {
            expiresIn = expiresIn.slice(1, -1);
        }
        return {
            access_token: this.jwtService.sign(payload, { expiresIn }),
            user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role }
        };
    }
    async register(data) {
        (0, user_role_enum_1.assertValidRole)(data.role);
        if (!(0, password_utils_1.isPasswordComplex)(data.password)) {
            throw new common_1.BadRequestException('Password does not meet complexity requirements.');
        }
        const existing = await this.usersService.findByEmail(data.email);
        if (existing) {
            throw new common_1.BadRequestException('A user with this email already exists.');
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.usersService.create({ ...data, password: hashedPassword });
        await this.usersService.logAction(user.id, 'REGISTER');
        return user;
    }
    async initiatePasswordReset(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            return;
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const expiresAt = (0, date_fns_1.addMinutes)(new Date(), 30);
        await this.prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token,
                expiresAt,
            }
        });
        await this.usersService.logAction(user.id, 'PASSWORD_RESET_REQUEST', { token });
    }
    async confirmPasswordReset(token, newPassword) {
        const reset = await this.prisma.passwordResetToken.findUnique({ where: { token } });
        if (!reset || reset.used || reset.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired token');
        }
        if (!(0, password_utils_1.isPasswordComplex)(newPassword)) {
            throw new common_1.BadRequestException('Password does not meet complexity requirements.');
        }
        const hashed = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: reset.userId },
            data: { password: hashed }
        });
        await this.prisma.passwordResetToken.update({
            where: { token },
            data: { used: true }
        });
        await this.usersService.logAction(reset.userId, 'PASSWORD_RESET');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map