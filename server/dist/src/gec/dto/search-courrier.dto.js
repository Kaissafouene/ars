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
exports.SearchCourrierDto = exports.CourrierStatus = void 0;
const class_validator_1 = require("class-validator");
const create_courrier_dto_1 = require("./create-courrier.dto");
var CourrierStatus;
(function (CourrierStatus) {
    CourrierStatus["DRAFT"] = "DRAFT";
    CourrierStatus["SENT"] = "SENT";
    CourrierStatus["FAILED"] = "FAILED";
    CourrierStatus["PENDING_RESPONSE"] = "PENDING_RESPONSE";
    CourrierStatus["RESPONDED"] = "RESPONDED";
})(CourrierStatus || (exports.CourrierStatus = CourrierStatus = {}));
class SearchCourrierDto {
    type;
    status;
    clientId;
    bordereauId;
    createdAfter;
    createdBefore;
}
exports.SearchCourrierDto = SearchCourrierDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(create_courrier_dto_1.CourrierType),
    __metadata("design:type", String)
], SearchCourrierDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CourrierStatus),
    __metadata("design:type", String)
], SearchCourrierDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchCourrierDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchCourrierDto.prototype, "bordereauId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SearchCourrierDto.prototype, "createdAfter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SearchCourrierDto.prototype, "createdBefore", void 0);
//# sourceMappingURL=search-courrier.dto.js.map