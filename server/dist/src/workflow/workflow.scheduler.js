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
var WorkflowScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const workflow_service_1 = require("./workflow.service");
let WorkflowScheduler = WorkflowScheduler_1 = class WorkflowScheduler {
    workflowService;
    logger = new common_1.Logger(WorkflowScheduler_1.name);
    constructor(workflowService) {
        this.workflowService = workflowService;
    }
    async handleAutoAssign() {
        this.logger.debug('Running auto-assignment');
        await this.workflowService.autoAssignTasks();
    }
    async handleSlaMonitoring() {
        this.logger.debug('Monitoring SLA compliance');
        await this.workflowService.monitorSlaCompliance();
    }
    async sendDailyPriorities() {
        this.logger.debug('Sending daily priorities');
    }
};
exports.WorkflowScheduler = WorkflowScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WorkflowScheduler.prototype, "handleAutoAssign", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WorkflowScheduler.prototype, "handleSlaMonitoring", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_8AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WorkflowScheduler.prototype, "sendDailyPriorities", null);
exports.WorkflowScheduler = WorkflowScheduler = WorkflowScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [workflow_service_1.WorkflowService])
], WorkflowScheduler);
//# sourceMappingURL=workflow.scheduler.js.map