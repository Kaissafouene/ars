"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const contracts_module_1 = require("./contracts/contracts.module");
const bordereaux_module_1 = require("./bordereaux/bordereaux.module");
const traitement_module_1 = require("./traitement/traitement.module");
const reclamations_module_1 = require("./reclamations/reclamations.module");
const ged_module_1 = require("./ged/ged.module");
const gec_module_1 = require("./gec/gec.module");
const finance_module_1 = require("./finance/finance.module");
const ocr_module_1 = require("./ocr/ocr.module");
const analytics_module_1 = require("./analytics/analytics.module");
const alerts_module_1 = require("./alerts/alerts.module");
const shared_module_1 = require("./shared/shared.module");
const config_module_1 = require("./config/config.module");
const client_module_1 = require("./client/client.module");
const workflow_module_1 = require("./workflow/workflow.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const integration_module_1 = require("./integrations/integration.module");
const seed_controller_1 = require("./seed.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, users_module_1.UsersModule, contracts_module_1.ContractsModule, bordereaux_module_1.BordereauxModule, traitement_module_1.TraitementModule, reclamations_module_1.ReclamationsModule, ged_module_1.GedModule, gec_module_1.GecModule, finance_module_1.FinanceModule, ocr_module_1.OcrModule, analytics_module_1.AnalyticsModule, alerts_module_1.AlertsModule, shared_module_1.SharedModule, config_module_1.ConfigModule,
            dashboard_module_1.DashboardModule,
            integration_module_1.IntegrationModule,
            client_module_1.ClientModule,
            workflow_module_1.WorkflowModule
        ],
        controllers: [app_controller_1.AppController, seed_controller_1.SeedController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map