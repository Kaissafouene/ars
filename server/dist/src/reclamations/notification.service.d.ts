import { OutlookService } from '../integrations/outlook.service';
export declare class NotificationService {
    private readonly outlook;
    private readonly logger;
    constructor(outlook: OutlookService);
    sendEmail(to: string, subject: string, text: string, html?: string): Promise<boolean>;
}
