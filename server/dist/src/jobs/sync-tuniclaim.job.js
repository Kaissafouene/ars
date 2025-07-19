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
var SyncTuniclaimJob_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncTuniclaimJob = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const tuniclaim_service_1 = require("../integrations/tuniclaim.service");
let SyncTuniclaimJob = SyncTuniclaimJob_1 = class SyncTuniclaimJob {
    tuniclaim;
    logger = new common_1.Logger(SyncTuniclaimJob_1.name);
    constructor(tuniclaim) {
        this.tuniclaim = tuniclaim;
    }
    async handleCron() {
        this.logger.log('Starting Tuniclaim sync...');
        const result = await this.tuniclaim.syncBs();
        this.logger.log(`Tuniclaim sync complete: ${result.imported} imported, ${result.errors} errors`);
    }
};
exports.SyncTuniclaimJob = SyncTuniclaimJob;
__decorate([
    (0, schedule_1.Cron)('0 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SyncTuniclaimJob.prototype, "handleCron", null);
exports.SyncTuniclaimJob = SyncTuniclaimJob = SyncTuniclaimJob_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tuniclaim_service_1.TuniclaimService])
], SyncTuniclaimJob);
//# sourceMappingURL=sync-tuniclaim.job.js.map