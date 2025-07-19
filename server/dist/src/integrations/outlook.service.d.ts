export declare class OutlookService {
    private accessToken;
    private refreshToken;
    getAuthUrl(redirectUri: string): string;
    exchangeCodeForToken(code: string, redirectUri: string): Promise<any>;
    sendMail(to: string, subject: string, text: string): Promise<any>;
    refreshAccessToken(redirectUri: string): Promise<any>;
    isConnected(): boolean;
}
