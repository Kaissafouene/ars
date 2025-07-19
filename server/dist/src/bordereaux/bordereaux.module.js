"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BordereauxModule = void 0;
const common_1 = require("@nestjs/common");
const bordereaux_service_1 = require("./bordereaux.service");
const bordereaux_controller_1 = require("./bordereaux.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const alerts_module_1 = require("../alerts/alerts.module");
const audit_log_module_1 = require("./audit-log.module");
const seed_controller_1 = require("../seed.controller");
let BordereauxModule = class BordereauxModule {
};
exports.BordereauxModule = BordereauxModule;
exports.BordereauxModule = BordereauxModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, alerts_module_1.AlertsModule, audit_log_module_1.AuditLogModule],
        controllers: [bordereaux_controller_1.BordereauxController, seed_controller_1.SeedController],
        providers: [bordereaux_service_1.BordereauxService],
        exports: [bordereaux_service_1.BordereauxService],
    })
], BordereauxModule);
//# sourceMappingURL=bordereaux.module.js.map