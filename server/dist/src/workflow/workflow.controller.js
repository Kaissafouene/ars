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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowController = void 0;
const common_1 = require("@nestjs/common");
const workflow_service_1 = require("./workflow.service");
const assign_task_dto_1 = require("./dto/assign-task.dto");
const workflow_kpi_dto_1 = require("./dto/workflow-kpi.dto");
const swagger_1 = require("@nestjs/swagger");
let WorkflowController = class WorkflowController {
    workflowService;
    constructor(workflowService) {
        this.workflowService = workflowService;
    }
    async autoAssignTasks() {
        await this.workflowService.autoAssignTasks();
        return { success: true, message: 'AI-based assignment triggered.' };
    }
    async setTaskPriority(dto) {
        return this.workflowService.setTaskPriority(dto);
    }
    async getAssignmentHistory(id) {
        return this.workflowService.getAssignmentHistory(id);
    }
    async assignTask(dto) {
        return this.workflowService.assignTask(dto);
    }
    async getPriorities(teamId) {
        return this.workflowService.getDailyPriorities(teamId);
    }
    async getKpis(query) {
        return this.workflowService.getWorkflowKpis(query);
    }
    async visualizeWorkflow(bordereauId) {
        return this.workflowService.visualizeWorkflow(bordereauId);
    }
    async getAssignments() {
        return this.workflowService.getAllAssignments();
    }
    async getAssignment(id) {
        return this.workflowService.getAssignmentById(id);
    }
    async createAssignment(dto) {
        return this.workflowService.assignTask(dto);
    }
    async updateAssignment(id, data, updatedByUserId) {
        return this.workflowService.updateAssignment(id, data, updatedByUserId);
    }
};
exports.WorkflowController = WorkflowController;
__decorate([
    (0, common_1.Post)('auto-assign'),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger AI-based auto-assignment of tasks (admin/team lead only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "autoAssignTasks", null);
__decorate([
    (0, common_1.Put)('priority'),
    (0, swagger_1.ApiOperation)({ summary: 'Manually override the priority of a workflow task (admin only)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "setTaskPriority", null);
__decorate([
    (0, common_1.Get)('assignments/history/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit history for a workflow assignment' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "getAssignmentHistory", null);
__decorate([
    (0, common_1.Post)('assign'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign a task to a user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_task_dto_1.AssignTaskDto]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "assignTask", null);
__decorate([
    (0, common_1.Get)('priorities'),
    (0, swagger_1.ApiOperation)({ summary: 'Get prioritized tasks for a team' }),
    __param(0, (0, common_1.Query)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "getPriorities", null);
__decorate([
    (0, common_1.Get)('kpis'),
    (0, swagger_1.ApiOperation)({ summary: 'Get workflow KPIs' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [workflow_kpi_dto_1.WorkflowKpiDto]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "getKpis", null);
__decorate([
    (0, common_1.Get)('visualize/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Visualize workflow for a bordereau' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "visualizeWorkflow", null);
__decorate([
    (0, common_1.Get)('assignments'),
    (0, swagger_1.ApiOperation)({ summary: 'List all workflow assignments' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "getAssignments", null);
__decorate([
    (0, common_1.Get)('assignments/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a workflow assignment by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "getAssignment", null);
__decorate([
    (0, common_1.Post)('assignments'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a workflow assignment (manual override)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_task_dto_1.AssignTaskDto]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "createAssignment", null);
__decorate([
    (0, common_1.Put)('assignments/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a workflow assignment (status, notes, etc.)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('updatedByUserId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "updateAssignment", null);
exports.WorkflowController = WorkflowController = __decorate([
    (0, swagger_1.ApiTags)('Workflow'),
    (0, common_1.Controller)('workflow'),
    __metadata("design:paramtypes", [workflow_service_1.WorkflowService])
], WorkflowController);
//# sourceMappingURL=workflow.controller.js.map