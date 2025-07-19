import { WorkflowService } from './workflow.service';
import { AssignTaskDto } from './dto/assign-task.dto';
import { WorkflowKpiDto } from './dto/workflow-kpi.dto';
export declare class WorkflowController {
    private readonly workflowService;
    constructor(workflowService: WorkflowService);
    autoAssignTasks(): Promise<{
        success: boolean;
        message: string;
    }>;
    setTaskPriority(dto: import('./dto/workflow-priority.dto').WorkflowPriorityDto): Promise<{
        success: boolean;
    }>;
    getAssignmentHistory(id: string): Promise<{
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
    assignTask(dto: AssignTaskDto): Promise<import("./interfaces/workflow.interface").WorkflowAssignment>;
    getPriorities(teamId?: string): Promise<import("./interfaces/workflow.interface").WorkflowTask[]>;
    getKpis(query: WorkflowKpiDto): Promise<{
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
    getAssignments(): Promise<{
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
    getAssignment(id: string): Promise<{
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
    createAssignment(dto: AssignTaskDto): Promise<import("./interfaces/workflow.interface").WorkflowAssignment>;
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
}
