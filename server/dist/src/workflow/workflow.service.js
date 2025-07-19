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
var WorkflowService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowService = void 0;
const common_1 = require("@nestjs/common");
const notification_service_1 = require("../ged/notification.service");
const prisma_service_1 = require("../prisma/prisma.service");
const workflow_constants_1 = require("./workflow.constants");
const bordereaux_service_1 = require("../bordereaux/bordereaux.service");
const alerts_service_1 = require("../alerts/alerts.service");
const analytics_service_1 = require("../analytics/analytics.service");
let WorkflowService = WorkflowService_1 = class WorkflowService {
    prisma;
    bordereauxService;
    alertsService;
    analyticsService;
    notificationService;
    logger = new common_1.Logger(WorkflowService_1.name);
    constructor(prisma, bordereauxService, alertsService, analyticsService, notificationService) {
        this.prisma = prisma;
        this.bordereauxService = bordereauxService;
        this.alertsService = alertsService;
        this.analyticsService = analyticsService;
        this.notificationService = notificationService;
    }
    async getAssignmentHistory(assignmentId) {
        return this.prisma.workflowAssignmentHistory.findMany({
            where: { assignmentId },
            orderBy: { updatedAt: 'asc' }
        });
    }
    async setTaskPriority(dto) {
        const { taskId, priority } = dto;
        let updated = false;
        const bord = await this.prisma.bordereau.updateMany({ where: { id: taskId }, data: { priority } });
        if (bord.count > 0)
            updated = true;
        const bs = await this.prisma.bulletinSoin.updateMany({ where: { id: taskId }, data: { priority } });
        if (bs.count > 0)
            updated = true;
        const rec = await this.prisma.reclamation.updateMany({ where: { id: taskId }, data: { priority } });
        if (rec.count > 0)
            updated = true;
        const vir = await this.prisma.virement.updateMany({ where: { id: taskId }, data: { priority } });
        if (vir.count > 0)
            updated = true;
        if (!updated)
            throw new Error('Task not found');
        return { success: true };
    }
    async getAllAssignments() {
        const assignments = await this.prisma.workflowAssignment.findMany({
            include: { user: true }
        });
        return assignments.map(a => ({
            ...a,
            assigneeName: a.user ? a.user.fullName : undefined
        }));
    }
    async getAssignmentById(id) {
        const assignment = await this.prisma.workflowAssignment.findUnique({
            where: { id },
            include: { user: true }
        });
        if (!assignment)
            throw new Error('Assignment not found');
        return {
            ...assignment,
            assigneeName: assignment.user ? assignment.user.fullName : undefined
        };
    }
    async updateAssignment(id, data, updatedByUserId) {
        const prev = await this.prisma.workflowAssignment.findUnique({ where: { id } });
        const assignment = await this.prisma.workflowAssignment.update({
            where: { id },
            data,
            include: { user: true }
        });
        await this.prisma.workflowAssignmentHistory.create({
            data: {
                assignmentId: id,
                updatedByUserId: updatedByUserId || null,
                updatedAt: new Date(),
                prevStatus: prev?.status,
                newStatus: assignment.status,
                prevNotes: prev?.notes,
                newNotes: assignment.notes
            }
        });
        if (assignment.status === 'COMPLETED') {
            let dueDate;
            if (assignment.taskType === 'BORDEREAU_SCAN') {
                const bord = await this.prisma.bordereau.findUnique({ where: { id: assignment.taskId } });
                if (bord)
                    dueDate = new Date(new Date(bord.dateReception).getTime() + workflow_constants_1.SLA_TIMEFRAMES.SCAN * 60 * 60 * 1000);
            }
            else if (assignment.taskType === 'BS_VALIDATION') {
                const bs = await this.prisma.bulletinSoin.findUnique({ where: { id: assignment.taskId } });
                if (bs)
                    dueDate = new Date(new Date(bs.dateCreation).getTime() + workflow_constants_1.SLA_TIMEFRAMES.VALIDATION * 60 * 60 * 1000);
            }
            else if (assignment.taskType === 'RECLAMATION') {
                const rec = await this.prisma.reclamation.findUnique({ where: { id: assignment.taskId } });
                if (rec)
                    dueDate = new Date(new Date(rec.createdAt).getTime() + workflow_constants_1.SLA_TIMEFRAMES.RECLAMATION * 60 * 60 * 1000);
            }
            else if (assignment.taskType === 'VIREMENT') {
                const vir = await this.prisma.virement.findUnique({ where: { id: assignment.taskId } });
                if (vir)
                    dueDate = new Date(new Date(vir.dateDepot).getTime() + workflow_constants_1.SLA_TIMEFRAMES.PAYMENT * 60 * 60 * 1000);
            }
            if (dueDate && assignment.completedAt) {
                const metSla = assignment.completedAt <= dueDate;
                await this.prisma.workflowAssignmentHistory.create({
                    data: {
                        assignmentId: id,
                        updatedByUserId: updatedByUserId || null,
                        updatedAt: new Date(),
                        prevStatus: assignment.status,
                        newStatus: assignment.status,
                        slaMet: metSla
                    }
                });
            }
        }
        return {
            ...assignment,
            assigneeName: assignment.user ? assignment.user.fullName : undefined
        };
    }
    async autoAssignTasks() {
        const pendingTasks = await this.getPendingTasks();
        const availableUsers = await this.getAvailableUsers();
        let aiAssignments = {};
        try {
            const analyticsService = this.analyticsService;
            const aiResponse = await analyticsService.getPrioritiesAI(pendingTasks);
            if (aiResponse && Array.isArray(aiResponse.priorities)) {
                aiAssignments = Object.fromEntries(aiResponse.priorities.map((p) => [p.id, p.assigneeId]));
            }
        }
        catch (err) {
            this.logger.warn('AI assignment failed, falling back to local logic: ' + err.message);
        }
        for (const task of pendingTasks) {
            let assigneeId = aiAssignments[task.id];
            if (!assigneeId) {
                const assignee = this.findBestAssignee(task, availableUsers);
                assigneeId = assignee?.id;
            }
            if (assigneeId) {
                await this.assignTask({
                    taskId: task.id,
                    taskType: task.type,
                    assigneeId
                });
                this.logger.log(`Assigned task ${task.id} to ${assigneeId}`);
            }
        }
    }
    async getPendingTasks() {
        const [bordereaux, bsList, reclamations, virements] = await Promise.all([
            this.prisma.bordereau.findMany({
                where: { statut: { notIn: ['CLOTURE', 'TRAITE'] } },
                include: { client: true, virement: true }
            }),
            this.prisma.bulletinSoin.findMany({
                where: { etat: { not: 'VALIDATED' } }
            }),
            this.prisma.reclamation.findMany({
                where: { status: { not: 'RESOLVED' } }
            }),
            this.prisma.virement.findMany({
                where: { confirmed: false },
                include: { bordereau: true }
            })
        ]);
        return [
            ...bordereaux.map(b => this.mapBordereauToTask(b)),
            ...bsList.map(bs => this.mapBSToTask(bs)),
            ...reclamations.map(r => this.mapReclamationToTask(r)),
            ...virements.map(v => this.mapVirementToTask(v))
        ].sort((a, b) => b.priority - a.priority);
    }
    mapVirementToTask(v) {
        const now = new Date();
        const depositDate = new Date(v.dateDepot);
        const elapsedHours = (now.getTime() - depositDate.getTime()) / (1000 * 60 * 60);
        let priority = workflow_constants_1.WORKFLOW_PRIORITY.MEDIUM;
        if (elapsedHours > workflow_constants_1.SLA_TIMEFRAMES.PAYMENT * 0.75)
            priority = workflow_constants_1.WORKFLOW_PRIORITY.HIGH;
        if (elapsedHours > workflow_constants_1.SLA_TIMEFRAMES.PAYMENT)
            priority = workflow_constants_1.WORKFLOW_PRIORITY.CRITICAL;
        return {
            id: v.id,
            type: 'VIREMENT',
            reference: v.referenceBancaire,
            status: v.confirmed ? 'COMPLETED' : 'PENDING',
            priority,
            dueDate: new Date(depositDate.getTime() + workflow_constants_1.SLA_TIMEFRAMES.PAYMENT * 60 * 60 * 1000),
            assignedTo: v.confirmedById,
            team: v.bordereau?.teamId,
            createdAt: v.createdAt,
            updatedAt: v.updatedAt || v.createdAt,
        };
    }
    mapBordereauToTask(bordereau) {
        const now = new Date();
        const receptionDate = new Date(bordereau.dateReception);
        const elapsedHours = (now.getTime() - receptionDate.getTime()) / (1000 * 60 * 60);
        let priority = workflow_constants_1.WORKFLOW_PRIORITY.MEDIUM;
        if (elapsedHours > workflow_constants_1.SLA_TIMEFRAMES.SCAN * 0.75)
            priority = workflow_constants_1.WORKFLOW_PRIORITY.HIGH;
        if (elapsedHours > workflow_constants_1.SLA_TIMEFRAMES.SCAN)
            priority = workflow_constants_1.WORKFLOW_PRIORITY.CRITICAL;
        return {
            id: bordereau.id,
            type: 'BORDEREAU_SCAN',
            reference: bordereau.reference,
            status: bordereau.statut,
            priority,
            dueDate: new Date(receptionDate.getTime() + workflow_constants_1.SLA_TIMEFRAMES.SCAN * 60 * 60 * 1000),
            assignedTo: bordereau.currentHandlerId,
            team: bordereau.teamId,
            createdAt: bordereau.createdAt,
            updatedAt: bordereau.updatedAt
        };
    }
    mapBSToTask(bs) {
        return {
            id: bs.id,
            type: 'BS_VALIDATION',
            reference: bs.numBs,
            status: bs.etat,
            priority: workflow_constants_1.WORKFLOW_PRIORITY.MEDIUM,
            dueDate: new Date(bs.dateCreation.getTime() + workflow_constants_1.SLA_TIMEFRAMES.VALIDATION * 60 * 60 * 1000),
            assignedTo: bs.ownerId,
            team: undefined,
            createdAt: bs.createdAt,
            updatedAt: bs.updatedAt,
        };
    }
    mapReclamationToTask(r) {
        return {
            id: r.id,
            type: 'RECLAMATION',
            reference: r.type,
            status: r.status,
            priority: workflow_constants_1.WORKFLOW_PRIORITY.HIGH,
            dueDate: new Date(r.createdAt.getTime() + workflow_constants_1.SLA_TIMEFRAMES.RECLAMATION * 60 * 60 * 1000),
            assignedTo: r.assignedToId,
            team: undefined,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
        };
    }
    async getAvailableUsers() {
        const users = await this.prisma.user.findMany({
            where: {
                role: { in: ['SCAN', 'GESTIONNAIRE', 'CHEF_EQUIPE'] }
            },
            include: {
                bordereaux: {
                    where: { statut: { notIn: ['CLOTURE', 'TRAITE'] } }
                }
            }
        });
        return users.map(user => ({
            ...user,
            currentLoad: user.bordereaux.length,
            capacity: this.getUserCapacity(user.role)
        }));
    }
    getUserCapacity(role) {
        const capacities = {
            SCAN: 30,
            GESTIONNAIRE: 20,
            CHEF_EQUIPE: 10
        };
        return capacities[role] || 15;
    }
    findBestAssignee(task, users) {
        const capableUsers = users.filter(u => (task.type === 'BORDEREAU_SCAN' && u.role === 'SCAN') ||
            (task.type === 'BS_VALIDATION' && u.role === 'GESTIONNAIRE') ||
            (task.type === 'RECLAMATION' && ['GESTIONNAIRE', 'CHEF_EQUIPE'].includes(u.role)) ||
            (task.type === 'VIREMENT' && u.role === 'FINANCE'));
        return capableUsers
            .filter(u => u.currentLoad < u.capacity)
            .sort((a, b) => a.currentLoad - b.currentLoad)[0];
    }
    async assignTask(dto) {
        let assignment;
        switch (dto.taskType) {
            case 'BORDEREAU_SCAN':
                await this.bordereauxService.assignBordereau({
                    bordereauId: dto.taskId,
                    assignedToUserId: dto.assigneeId
                });
                break;
            case 'BS_VALIDATION':
                break;
            case 'RECLAMATION':
                break;
            case 'VIREMENT':
                await this.prisma.virement.update({
                    where: { id: dto.taskId },
                    data: {
                        confirmedById: dto.assigneeId,
                    }
                });
                break;
            default:
                throw new Error(`Unknown task type: ${dto.taskType}`);
        }
        assignment = await this.prisma.workflowAssignment.create({
            data: {
                taskId: dto.taskId,
                taskType: dto.taskType,
                assigneeId: dto.assigneeId,
                assignedAt: new Date(),
                status: 'PENDING'
            }
        });
        return assignment;
    }
    async getDailyPriorities(teamId) {
        let where = {};
        if (teamId) {
            where = { teamId };
        }
        const tasks = await this.getPendingTasks();
        return tasks
            .filter(t => !teamId || t.team === teamId)
            .sort((a, b) => {
            if (a.priority !== b.priority)
                return b.priority - a.priority;
            return a.dueDate.getTime() - b.dueDate.getTime();
        });
    }
    async monitorSlaCompliance() {
        const tasks = await this.getPendingTasks();
        const now = new Date();
        for (const task of tasks) {
            if (now > task.dueDate) {
                let escalationLevel = 0;
                let notifyUserIds = [];
                if (task.assignedTo) {
                    const user = await this.prisma.user.findUnique({ where: { id: task.assignedTo } });
                    if (user) {
                        if (user.role === 'SCAN' || user.role === 'GESTIONNAIRE') {
                            escalationLevel = 1;
                        }
                        else if (user.role === 'CHEF_EQUIPE') {
                            const superAdmin = await this.prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } });
                            if (superAdmin)
                                notifyUserIds.push(superAdmin.id);
                            escalationLevel = 2;
                        }
                    }
                }
                const alertPayload = { type: 'SLA_BREACH', escalationLevel, notifyUserIds };
                if (task.type === 'BS_VALIDATION')
                    alertPayload.bsId = task.id;
                if (task.type === 'BORDEREAU_SCAN')
                    alertPayload.bordereauId = task.id;
                if (task.type === 'RECLAMATION')
                    alertPayload.reclamationId = task.id;
                if (task.type === 'VIREMENT')
                    alertPayload.virementId = task.id;
                await this.alertsService.triggerAlert(alertPayload);
                if (notifyUserIds && notifyUserIds.length > 0) {
                    for (const userId of notifyUserIds) {
                        await this.notificationService.notify('sla_alert', {
                            userId,
                            message: `Alerte SLA : tâche en retard ou escaladée pour l'utilisateur ${userId}`,
                            ...alertPayload
                        });
                    }
                }
                if (task.assignedTo) {
                    const user = await this.prisma.user.findUnique({
                        where: { id: task.assignedTo }
                    });
                    if (user && user.role !== 'CHEF_EQUIPE') {
                        await this.autoAssignTasks();
                    }
                }
            }
        }
    }
    async getWorkflowKpis(query) {
        return this.analyticsService.getPerformance({
            teamId: query.teamId,
            fromDate: query.dateFrom ? query.dateFrom.toISOString() : undefined,
            toDate: query.dateTo ? query.dateTo.toISOString() : undefined,
        }, { role: 'CHEF_EQUIPE' });
    }
    async visualizeWorkflow(bordereauId) {
        const bordereau = await this.prisma.bordereau.findUnique({
            where: { id: bordereauId },
            include: {
                documents: true,
                courriers: true,
                virement: true,
                traitementHistory: {
                    orderBy: { createdAt: 'asc' },
                    include: { user: true }
                }
            }
        });
        if (!bordereau) {
            throw new Error('Bordereau not found');
        }
        return {
            stages: [
                {
                    name: 'Reception',
                    status: 'COMPLETED',
                    date: bordereau.dateReception
                },
                {
                    name: 'Scan',
                    status: bordereau.dateFinScan ? 'COMPLETED' :
                        bordereau.dateDebutScan ? 'IN_PROGRESS' : 'PENDING',
                    date: bordereau.dateFinScan || bordereau.dateDebutScan
                },
            ],
            history: bordereau.traitementHistory.map(h => ({
                action: h.action,
                user: h.user.fullName,
                date: h.createdAt,
                fromStatus: h.fromStatus,
                toStatus: h.toStatus
            }))
        };
    }
};
exports.WorkflowService = WorkflowService;
exports.WorkflowService = WorkflowService = WorkflowService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bordereaux_service_1.BordereauxService,
        alerts_service_1.AlertsService,
        analytics_service_1.AnalyticsService,
        notification_service_1.NotificationService])
], WorkflowService);
//# sourceMappingURL=workflow.service.js.map