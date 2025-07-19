import { WorkflowService } from './workflow.service';
export declare class WorkflowScheduler {
    private workflowService;
    private readonly logger;
    constructor(workflowService: WorkflowService);
    handleAutoAssign(): Promise<void>;
    handleSlaMonitoring(): Promise<void>;
    sendDailyPriorities(): Promise<void>;
}
