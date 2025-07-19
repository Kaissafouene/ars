"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModule = void 0;
const common_1 = require("@nestjs/common");
const dashboard_controller_1 = require("./dashboard.controller");
const dashboard_service_1 = require("./dashboard.service");
const traitement_service_1 = require("../traitement/traitement.service");
const bordereaux_service_1 = require("../bordereaux/bordereaux.service");
const reclamations_service_1 = require("../reclamations/reclamations.service");
const alerts_service_1 = require("../alerts/alerts.service");
const analytics_service_1 = require("../analytics/analytics.service");
const prisma_service_1 = require("../prisma/prisma.service");
const integration_module_1 = require("../integrations/integration.module");
const notification_service_1 = require("../reclamations/notification.service");
const reclamations_module_1 = require("../reclamations/reclamations.module");
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [integration_module_1.IntegrationModule, reclamations_module_1.ReclamationsModule],
        controllers: [dashboard_controller_1.DashboardController],
        providers: [
            dashboard_service_1.DashboardService,
            traitement_service_1.TraitementService,
            bordereaux_service_1.BordereauxService,
            reclamations_service_1.ReclamationsService,
            alerts_service_1.AlertsService,
            analytics_service_1.AnalyticsService,
            prisma_service_1.PrismaService,
            notification_service_1.NotificationService,
        ],
        exports: [dashboard_service_1.DashboardService],
    })
], DashboardModule);
//# sourceMappingURL=dashboard.module.js.map