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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async create(data) {
        const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            throw new Error('A user with this email already exists.');
        }
        const user = await this.prisma.user.create({ data });
        await this.logAction(user.id, 'USER_CREATE', { data: { ...data, password: undefined } });
        return user;
    }
    async findById(id) {
        return this.prisma.user.findUnique({ where: { id } });
    }
    async findAll() {
        return this.prisma.user.findMany();
    }
    async findByRole(role) {
        return this.prisma.user.findMany({ where: { role } });
    }
    async update(id, data) {
        const user = await this.prisma.user.update({
            where: { id },
            data,
        });
        await this.logAction(id, 'USER_UPDATE', { data: { ...data, password: undefined } });
        return user;
    }
    async delete(id) {
        const user = await this.prisma.user.delete({
            where: { id },
        });
        await this.logAction(id, 'USER_DELETE');
        return user;
    }
    async disableUser(id) {
        const user = await this.prisma.user.update({
            where: { id },
            data: { active: false },
        });
        await this.logAction(id, 'USER_DISABLE');
        return user;
    }
    async resetPassword(id, newPassword) {
        const bcrypt = require('bcrypt');
        const hashed = await bcrypt.hash(newPassword, 10);
        const user = await this.prisma.user.update({
            where: { id },
            data: { password: hashed },
        });
        await this.logAction(id, 'USER_PASSWORD_RESET');
        return user;
    }
    async getAuditLogsForUser(userId) {
        return this.prisma.auditLog.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' },
        });
    }
    async logAction(userId, action, details) {
        await this.prisma.auditLog.create({
            data: { userId, action, details, timestamp: new Date() }
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map