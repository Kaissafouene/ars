"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBulletinSoinDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_bulletin_soin_dto_1 = require("./create-bulletin-soin.dto");
class UpdateBulletinSoinDto extends (0, mapped_types_1.PartialType)(create_bulletin_soin_dto_1.CreateBulletinSoinDto) {
    etat;
    ownerId;
    observationGlobal;
}
exports.UpdateBulletinSoinDto = UpdateBulletinSoinDto;
//# sourceMappingURL=update-bulletin-soin.dto.js.map