export declare enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    CHEF_EQUIPE = "CHEF_EQUIPE",
    GESTIONNAIRE = "GESTIONNAIRE",
    CUSTOMER_SERVICE = "CUSTOMER_SERVICE",
    FINANCE = "FINANCE",
    SCAN_TEAM = "SCAN_TEAM",
    BO = "BO",
    MANAGER = "MANAGER",
    ADMINISTRATEUR = "ADMINISTRATEUR"
}
export declare function assertValidRole(role: string): asserts role is UserRole;
