"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowModule = void 0;
const common_1 = require("@nestjs/common");
const workflow_service_1 = require("./workflow.service");
const workflow_controller_1 = require("./workflow.controller");
const prisma_service_1 = require("../prisma/prisma.service");
const bordereaux_module_1 = require("../bordereaux/bordereaux.module");
const alerts_module_1 = require("../alerts/alerts.module");
const analytics_module_1 = require("../analytics/analytics.module");
const schedule_1 = require("@nestjs/schedule");
const ged_module_1 = require("../ged/ged.module");
let WorkflowModule = class WorkflowModule {
};
exports.WorkflowModule = WorkflowModule;
exports.WorkflowModule = WorkflowModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            bordereaux_module_1.BordereauxModule,
            alerts_module_1.AlertsModule,
            analytics_module_1.AnalyticsModule,
            ged_module_1.GedModule
        ],
        controllers: [workflow_controller_1.WorkflowController],
        providers: [workflow_service_1.WorkflowService, prisma_service_1.PrismaService],
        exports: [workflow_service_1.WorkflowService]
    })
], WorkflowModule);
//# sourceMappingURL=workflow.module.js.map