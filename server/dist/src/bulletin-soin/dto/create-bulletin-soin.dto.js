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
exports.CreateBulletinSoinDto = void 0;
const bulletin_soin_entity_1 = require("../entities/bulletin-soin.entity");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateBulletinSoinDto {
    numBs;
    codeAssure;
    nomAssure;
    dateMaladie;
    items;
    nomBeneficiaire;
    nomSociete;
    nomPrestation;
    nomBordereau;
    lien;
    dateCreation;
    totalPec;
    observationGlobal;
    etat;
    ownerId;
}
exports.CreateBulletinSoinDto = CreateBulletinSoinDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBulletinSoinDto.prototype, "numBs", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBulletinSoinDto.prototype, "codeAssure", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBulletinSoinDto.prototype, "nomAssure", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateBulletinSoinDto.prototype, "dateMaladie", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => bulletin_soin_entity_1.BulletinSoinItem),
    __metadata("design:type", Array)
], CreateBulletinSoinDto.prototype, "items", void 0);
//# sourceMappingURL=create-bulletin-soin.dto.js.map