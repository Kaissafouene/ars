"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const outlook_service_1 = require("../integrations/outlook.service");
let NotificationService = class NotificationService {
    outlook;
    constructor(outlook) {
        this.outlook = outlook;
    }
    async notify(event, payload) {
        if (payload?.user?.email) {
            try {
                await this.outlook.sendMail(payload.user.email, `[GED] Notification: ${event}`, JSON.stringify(payload, null, 2));
            }
            catch (err) {
                console.error(`[NOTIFY][${event}] Email failed:`, err);
            }
        }
        console.log(`[NOTIFY][${event}]`, payload);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [outlook_service_1.OutlookService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map