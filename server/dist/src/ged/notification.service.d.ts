import { OutlookService } from '../integrations/outlook.service';
export declare class NotificationService {
    private readonly outlook;
    constructor(outlook: OutlookService);
    notify(event: string, payload: any): Promise<void>;
}
