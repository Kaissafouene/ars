import { BordereauxService } from './bordereaux/bordereaux.service';
export declare class SeedController {
    private readonly bordereauxService;
    constructor(bordereauxService: BordereauxService);
    seedAll(): Promise<{
        bordereaux: any;
        complaints: any;
        error?: undefined;
        stack?: undefined;
    } | {
        error: any;
        stack: any;
        bordereaux?: undefined;
        complaints?: undefined;
    }>;
}
