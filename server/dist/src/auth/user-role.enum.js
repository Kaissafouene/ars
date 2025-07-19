"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
exports.assertValidRole = assertValidRole;
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["CHEF_EQUIPE"] = "CHEF_EQUIPE";
    UserRole["GESTIONNAIRE"] = "GESTIONNAIRE";
    UserRole["CUSTOMER_SERVICE"] = "CUSTOMER_SERVICE";
    UserRole["FINANCE"] = "FINANCE";
    UserRole["SCAN_TEAM"] = "SCAN_TEAM";
    UserRole["BO"] = "BO";
    UserRole["MANAGER"] = "MANAGER";
    UserRole["ADMINISTRATEUR"] = "ADMINISTRATEUR";
})(UserRole || (exports.UserRole = UserRole = {}));
function assertValidRole(role) {
    if (!Object.values(UserRole).includes(role)) {
        throw new Error(`Invalid role: ${role}`);
    }
}
//# sourceMappingURL=user-role.enum.js.map