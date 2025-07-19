import { TuniclaimService } from '../integrations/tuniclaim.service';
export declare class SyncTuniclaimJob {
    private tuniclaim;
    private readonly logger;
    constructor(tuniclaim: TuniclaimService);
    handleCron(): Promise<void>;
}
