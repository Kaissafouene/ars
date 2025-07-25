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
exports.IntegrationModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const tuniclaim_service_1 = require("./tuniclaim.service");
const prisma_service_1 = require("../prisma/prisma.service");
const outlook_service_1 = require("./outlook.service");
let IntegrationModule = class IntegrationModule {
    tuniclaim;
    constructor(tuniclaim) {
        this.tuniclaim = tuniclaim;
        setInterval(() => this.tuniclaim.syncBordereaux(), 60 * 60 * 1000);
    }
};
exports.IntegrationModule = IntegrationModule;
exports.IntegrationModule = IntegrationModule = __decorate([
    (0, common_1.Module)({
        imports: [schedule_1.ScheduleModule.forRoot()],
        providers: [tuniclaim_service_1.TuniclaimService, prisma_service_1.PrismaService, outlook_service_1.OutlookService],
        exports: [tuniclaim_service_1.TuniclaimService, outlook_service_1.OutlookService],
    }),
    __metadata("design:paramtypes", [tuniclaim_service_1.TuniclaimService])
], IntegrationModule);
//# sourceMappingURL=integration.module.js.map