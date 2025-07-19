"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutlookService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const MS_GRAPH_API = 'https://graph.microsoft.com/v1.0';
let OutlookService = class OutlookService {
    accessToken = null;
    refreshToken = null;
    getAuthUrl(redirectUri) {
        const clientId = process.env.MS_CLIENT_ID;
        const tenant = process.env.MS_TENANT_ID || 'common';
        const scopes = encodeURIComponent('offline_access Mail.Send Mail.Read');
        return `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=query&scope=${scopes}`;
    }
    async exchangeCodeForToken(code, redirectUri) {
        const clientId = process.env.MS_CLIENT_ID;
        const clientSecret = process.env.MS_CLIENT_SECRET;
        const tenant = process.env.MS_TENANT_ID || 'common';
        const url = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
        const params = new URLSearchParams();
        params.append('client_id', clientId);
        params.append('scope', 'offline_access Mail.Send Mail.Read');
        params.append('code', code);
        params.append('redirect_uri', redirectUri);
        params.append('grant_type', 'authorization_code');
        params.append('client_secret', clientSecret);
        const res = await axios_1.default.post(url, params);
        this.accessToken = res.data.access_token;
        this.refreshToken = res.data.refresh_token;
        return res.data;
    }
    async sendMail(to, subject, text) {
        if (!this.accessToken)
            throw new common_1.UnauthorizedException('Outlook not connected');
        const res = await axios_1.default.post(`${MS_GRAPH_API}/me/sendMail`, {
            message: {
                subject,
                body: { contentType: 'Text', content: text },
                toRecipients: [{ emailAddress: { address: to } }],
            },
            saveToSentItems: 'true',
        }, {
            headers: { Authorization: `Bearer ${this.accessToken}` },
        });
        return res.data;
    }
    async refreshAccessToken(redirectUri) {
        const clientId = process.env.MS_CLIENT_ID;
        const clientSecret = process.env.MS_CLIENT_SECRET;
        const tenant = process.env.MS_TENANT_ID || 'common';
        const url = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
        const params = new URLSearchParams();
        params.append('client_id', clientId);
        params.append('scope', 'offline_access Mail.Send Mail.Read');
        params.append('refresh_token', this.refreshToken);
        params.append('redirect_uri', redirectUri);
        params.append('grant_type', 'refresh_token');
        params.append('client_secret', clientSecret);
        const res = await axios_1.default.post(url, params);
        this.accessToken = res.data.access_token;
        this.refreshToken = res.data.refresh_token;
        return res.data;
    }
    isConnected() {
        return !!this.accessToken;
    }
};
exports.OutlookService = OutlookService;
exports.OutlookService = OutlookService = __decorate([
    (0, common_1.Injectable)()
], OutlookService);
//# sourceMappingURL=outlook.service.js.map