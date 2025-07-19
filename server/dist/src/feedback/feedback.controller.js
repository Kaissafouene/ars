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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const prisma_service_1 = require("../prisma/prisma.service");
const feedback_dto_1 = require("./feedback.dto");
let FeedbackController = class FeedbackController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitFeedback(body, req) {
        const { message, page } = body;
        if (!message || !page) {
            throw new common_1.BadRequestException('Message and page are required');
        }
        await this.prisma.feedback.create({
            data: {
                userId: req.user.id,
                message,
                page,
            },
        });
        return { success: true };
    }
};
exports.FeedbackController = FeedbackController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [feedback_dto_1.FeedbackDto, Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "submitFeedback", null);
exports.FeedbackController = FeedbackController = __decorate([
    (0, common_1.Controller)('feedback'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FeedbackController);
//# sourceMappingURL=feedback.controller.js.map