import { OutlookService } from './outlook.service';
export declare class OutlookController {
    private readonly outlook;
    constructor(outlook: OutlookService);
    getAuthUrl(redirectUri: string): {
        url: string;
    };
    exchangeCode(body: {
        code: string;
        redirectUri: string;
    }): Promise<any>;
    status(): {
        connected: boolean;
    };
    sendTest(body: {
        to: string;
        subject: string;
        text: string;
    }): Promise<any>;
}
