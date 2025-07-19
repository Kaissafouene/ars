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
exports.UpdateBSDto = exports.CreateBSDto = exports.ALLOWED_BS_STATUSES = exports.BSStatus = void 0;
const class_validator_1 = require("class-validator");
var BSStatus;
(function (BSStatus) {
    BSStatus["IN_PROGRESS"] = "IN_PROGRESS";
    BSStatus["VALIDATED"] = "VALIDATED";
    BSStatus["REJECTED"] = "REJECTED";
})(BSStatus || (exports.BSStatus = BSStatus = {}));
exports.ALLOWED_BS_STATUSES = [BSStatus.IN_PROGRESS, BSStatus.VALIDATED, BSStatus.REJECTED];
class CreateBSDto {
    bordereauId;
    ownerId;
    status;
    processedAt;
    documentId;
    numBs;
    etat;
    nomAssure;
    nomBeneficiaire;
    nomSociete;
    codeAssure;
    matricule;
    dateSoin;
    montant;
    acte;
    nomPrestation;
    nomBordereau;
    lien;
    dateCreation;
    dateMaladie;
    totalPec;
    observationGlobal;
}
exports.CreateBSDto = CreateBSDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBSDto.prototype, "bordereauId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBSDto.prototype, "ownerId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(BSStatus),
    __metadata("design:type", String)
], CreateBSDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBSDto.prototype, "processedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBSDto.prototype, "documentId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBSDto.prototype, "nomPrestation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBSDto.prototype, "nomBordereau", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBSDto.prototype, "lien", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBSDto.prototype, "dateCreation", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBSDto.prototype, "dateMaladie", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBSDto.prototype, "totalPec", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBSDto.prototype, "observationGlobal", void 0);
class UpdateBSDto {
    etat(etat) {
        throw new Error('Method not implemented.');
    }
    status;
    processedAt;
    documentId;
    nomPrestation;
    nomBordereau;
    lien;
    dateCreation;
    dateMaladie;
    totalPec;
    observationGlobal;
}
exports.UpdateBSDto = UpdateBSDto;
__decorate([
    (0, class_validator_1.IsEnum)(BSStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBSDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateBSDto.prototype, "processedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateBSDto.prototype, "documentId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBSDto.prototype, "nomPrestation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBSDto.prototype, "nomBordereau", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBSDto.prototype, "lien", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateBSDto.prototype, "dateCreation", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateBSDto.prototype, "dateMaladie", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateBSDto.prototype, "totalPec", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBSDto.prototype, "observationGlobal", void 0);
//# sourceMappingURL=bs.dto.js.map