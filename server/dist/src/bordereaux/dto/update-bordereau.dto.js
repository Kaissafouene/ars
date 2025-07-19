"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBordereauDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_bordereau_dto_1 = require("./create-bordereau.dto");
class UpdateBordereauDto extends (0, mapped_types_1.PartialType)(create_bordereau_dto_1.CreateBordereauDto) {
}
exports.UpdateBordereauDto = UpdateBordereauDto;
//# sourceMappingURL=update-bordereau.dto.js.map