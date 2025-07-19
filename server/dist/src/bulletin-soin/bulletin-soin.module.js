"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulletinSoinModule = void 0;
const common_1 = require("@nestjs/common");
const bulletin_soin_service_1 = require("./bulletin-soin.service");
const bulletin_soin_controller_1 = require("./bulletin-soin.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const ged_module_1 = require("../ged/ged.module");
const ocr_module_1 = require("../ocr/ocr.module");
const auth_module_1 = require("../auth/auth.module");
const alerts_module_1 = require("../alerts/alerts.module");
let BulletinSoinModule = class BulletinSoinModule {
};
exports.BulletinSoinModule = BulletinSoinModule;
exports.BulletinSoinModule = BulletinSoinModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, ged_module_1.GedModule, ocr_module_1.OcrModule, auth_module_1.AuthModule, alerts_module_1.AlertsModule],
        controllers: [bulletin_soin_controller_1.BulletinSoinController],
        providers: [bulletin_soin_service_1.BulletinSoinService],
        exports: [bulletin_soin_service_1.BulletinSoinService],
    })
], BulletinSoinModule);
//# sourceMappingURL=bulletin-soin.module.js.map