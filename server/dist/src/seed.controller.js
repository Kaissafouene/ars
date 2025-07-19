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
exports.SeedController = void 0;
const common_1 = require("@nestjs/common");
const bordereaux_service_1 = require("./bordereaux/bordereaux.service");
let SeedController = class SeedController {
    bordereauxService;
    constructor(bordereauxService) {
        this.bordereauxService = bordereauxService;
    }
    async seedAll() {
        try {
            const bordereaux = await this.bordereauxService.seedTestData();
            const complaints = await this.bordereauxService.seedComplaints();
            return { bordereaux, complaints };
        }
        catch (error) {
            console.error('Seeding error:', error);
            return { error: error.message, stack: error.stack };
        }
    }
};
exports.SeedController = SeedController;
__decorate([
    (0, common_1.Post)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedController.prototype, "seedAll", null);
exports.SeedController = SeedController = __decorate([
    (0, common_1.Controller)('seed'),
    __metadata("design:paramtypes", [bordereaux_service_1.BordereauxService])
], SeedController);
//# sourceMappingURL=seed.controller.js.map