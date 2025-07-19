"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GedModule = void 0;
const common_1 = require("@nestjs/common");
const ged_service_1 = require("./ged.service");
const ged_controller_1 = require("./ged.controller");
const prisma_service_1 = require("../prisma/prisma.service");
const notification_service_1 = require("./notification.service");
const integration_module_1 = require("../integrations/integration.module");
let GedModule = class GedModule {
};
exports.GedModule = GedModule;
exports.GedModule = GedModule = __decorate([
    (0, common_1.Module)({
        imports: [integration_module_1.IntegrationModule],
        controllers: [ged_controller_1.GedController],
        providers: [ged_service_1.GedService, prisma_service_1.PrismaService, notification_service_1.NotificationService],
        exports: [ged_service_1.GedService, notification_service_1.NotificationService],
    })
], GedModule);
//# sourceMappingURL=ged.module.js.map