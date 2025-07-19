"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReclamationsModule = void 0;
const common_1 = require("@nestjs/common");
const reclamations_service_1 = require("./reclamations.service");
const reclamations_controller_1 = require("./reclamations.controller");
const prisma_service_1 = require("../prisma/prisma.service");
const notification_service_1 = require("./notification.service");
const integration_module_1 = require("../integrations/integration.module");
let ReclamationsModule = class ReclamationsModule {
};
exports.ReclamationsModule = ReclamationsModule;
exports.ReclamationsModule = ReclamationsModule = __decorate([
    (0, common_1.Module)({
        imports: [integration_module_1.IntegrationModule],
        controllers: [reclamations_controller_1.ReclamationsController],
        providers: [reclamations_service_1.ReclamationsService, prisma_service_1.PrismaService, notification_service_1.NotificationService],
    })
], ReclamationsModule);
//# sourceMappingURL=reclamations.module.js.map