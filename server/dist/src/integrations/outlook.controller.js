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
exports.OutlookController = void 0;
const common_1 = require("@nestjs/common");
const outlook_service_1 = require("./outlook.service");
let OutlookController = class OutlookController {
    outlook;
    constructor(outlook) {
        this.outlook = outlook;
    }
    getAuthUrl(redirectUri) {
        return { url: this.outlook.getAuthUrl(redirectUri) };
    }
    async exchangeCode(body) {
        return this.outlook.exchangeCodeForToken(body.code, body.redirectUri);
    }
    status() {
        return { connected: this.outlook.isConnected() };
    }
    async sendTest(body) {
        return this.outlook.sendMail(body.to, body.subject, body.text);
    }
};
exports.OutlookController = OutlookController;
__decorate([
    (0, common_1.Get)('auth-url'),
    __param(0, (0, common_1.Query)('redirectUri')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OutlookController.prototype, "getAuthUrl", null);
__decorate([
    (0, common_1.Post)('exchange'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OutlookController.prototype, "exchangeCode", null);
__decorate([
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OutlookController.prototype, "status", null);
__decorate([
    (0, common_1.Post)('send-test'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OutlookController.prototype, "sendTest", null);
exports.OutlookController = OutlookController = __decorate([
    (0, common_1.Controller)('outlook'),
    __metadata("design:paramtypes", [outlook_service_1.OutlookService])
], OutlookController);
//# sourceMappingURL=outlook.controller.js.map