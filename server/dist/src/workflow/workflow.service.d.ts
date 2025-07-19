import { NotificationService } from '../ged/notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowTask, WorkflowAssignment } from './interfaces/workflow.interface';
import { BordereauxService } from '../bordereaux/bordereaux.service';
import { AlertsService } from '../alerts/alerts.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { AssignTaskDto } from './dto/assign-task.dto';
import { WorkflowKpiDto } from './dto/workflow-kpi.dto';
import { WorkflowPriorityDto } from './dto/workflow-priority.dto';
export declare class WorkflowService {
    private prisma;
    private bordereauxService;
    private alertsService;
    private analyticsService;
    private notificationService;
    private readonly logger;
    constructor(prisma: PrismaService, bordereauxService: BordereauxService, alertsService: AlertsService, analyticsService: AnalyticsService, notificationService: NotificationService);
    getAssignmentHistory(assignmentId: string): Promise<{
        id: string;
        updatedAt: Date;
        assignmentId: string;
        updatedByUserId: string | null;
        prevStatus: string | null;
        newStatus: string | null;
        prevNotes: string | null;
        newNotes: string | null;
        slaMet: boolean | null;
    }[]>;
    setTaskPriority(dto: WorkflowPriorityDto): Promise<{
        success: boolean;
    }>;
    getAllAssignments(): Promise<{
        assigneeName: string | undefined;
        user: {
            password: string;
            id: string;
            email: string;
            fullName: string;
            role: string;
            department: string | null;
            active: boolean;
            createdAt: Date;
        };
        id: string;
        notes: string | null;
        status: string;
        taskId: string;
        taskType: string;
        assigneeId: string;
        assignedAt: Date;
        completedAt: Date | null;
    }[]>;
    getAssignmentById(id: string): Promise<{
        assigneeName: string | undefined;
        user: {
            password: string;
            id: string;
            email: string;
            fullName: string;
            role: string;
            department: string | null;
            active: boolean;
            createdAt: Date;
        };
        id: string;
        notes: string | null;
        status: string;
        taskId: string;
        taskType: string;
        assigneeId: string;
        assignedAt: Date;
        completedAt: Date | null;
    }>;
    updateAssignment(id: string, data: any, updatedByUserId?: string): Promise<{
        assigneeName: string | undefined;
        user: {
            password: string;
            id: string;
            email: string;
            fullName: string;
            role: string;
            department: string | null;
            active: boolean;
            createdAt: Date;
        };
        id: string;
        notes: string | null;
        status: string;
        taskId: string;
        taskType: string;
        assigneeId: string;
        assignedAt: Date;
        completedAt: Date | null;
    }>;
    autoAssignTasks(): Promise<void>;
    private getPendingTasks;
    private mapVirementToTask;
    private mapBordereauToTask;
    private mapBSToTask;
    private mapReclamationToTask;
    private getAvailableUsers;
    private getUserCapacity;
    private findBestAssignee;
    assignTask(dto: AssignTaskDto): Promise<WorkflowAssignment>;
    getDailyPriorities(teamId?: string): Promise<WorkflowTask[]>;
    monitorSlaCompliance(): Promise<void>;
    getWorkflowKpis(query: WorkflowKpiDto): Promise<{
        processedByUser: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "clientId"[]> & {
            _count: {
                id: number;
            };
        })[];
        slaCompliant: number;
    }>;
    visualizeWorkflow(bordereauId: string): Promise<{
        stages: {
            name: string;
            status: string;
            date: Date | null;
        }[];
        history: {
            action: string;
            user: string;
            date: Date;
            fromStatus: string | null;
            toStatus: string | null;
        }[];
    }>;
}
