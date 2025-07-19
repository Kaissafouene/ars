"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BordereauResponseDto = exports.StatusColor = void 0;
var StatusColor;
(function (StatusColor) {
    StatusColor["GREEN"] = "GREEN";
    StatusColor["ORANGE"] = "ORANGE";
    StatusColor["RED"] = "RED";
})(StatusColor || (exports.StatusColor = StatusColor = {}));
class BordereauResponseDto {
    id;
    reference;
    clientId;
    contractId;
    dateReception;
    dateDebutScan;
    dateFinScan;
    dateReceptionSante;
    dateCloture;
    dateDepotVirement;
    dateExecutionVirement;
    delaiReglement;
    statut;
    nombreBS;
    createdAt;
    updatedAt;
    daysElapsed;
    daysRemaining;
    statusColor;
    scanDuration;
    totalDuration;
    isOverdue;
    assignedTo;
    client;
    contract;
    constructor(partial) {
        Object.assign(this, partial);
    }
    static fromEntity(bordereau, includeKPIs = true) {
        const response = new BordereauResponseDto({
            ...bordereau,
            dateReception: bordereau.dateReception,
            dateDebutScan: bordereau.dateDebutScan || null,
            dateFinScan: bordereau.dateFinScan || null,
            dateReceptionSante: bordereau.dateReceptionSante || null,
            dateCloture: bordereau.dateCloture || null,
            dateDepotVirement: bordereau.dateDepotVirement || null,
            dateExecutionVirement: bordereau.dateExecutionVirement || null,
            createdAt: bordereau.createdAt,
            updatedAt: bordereau.updatedAt,
            client: bordereau.client,
            contract: bordereau.contract,
        });
        if (includeKPIs) {
            const today = new Date();
            const receptionDate = new Date(bordereau.dateReception);
            const daysElapsed = Math.floor((today.getTime() - receptionDate.getTime()) / (1000 * 60 * 60 * 24));
            const daysRemaining = bordereau.delaiReglement - daysElapsed;
            let statusColor = StatusColor.GREEN;
            if (daysRemaining <= 0) {
                statusColor = StatusColor.RED;
            }
            else if (daysRemaining <= 3) {
                statusColor = StatusColor.ORANGE;
            }
            let scanDuration = null;
            if (bordereau.dateDebutScan && bordereau.dateFinScan) {
                scanDuration = Math.floor((new Date(bordereau.dateFinScan).getTime() - new Date(bordereau.dateDebutScan).getTime()) /
                    (1000 * 60 * 60 * 24));
            }
            let totalDuration = null;
            if (bordereau.dateCloture) {
                totalDuration = Math.floor((new Date(bordereau.dateCloture).getTime() - receptionDate.getTime()) /
                    (1000 * 60 * 60 * 24));
            }
            response.daysElapsed = daysElapsed;
            response.daysRemaining = daysRemaining;
            response.statusColor = statusColor;
            response.scanDuration = scanDuration;
            response.totalDuration = totalDuration;
            response.isOverdue = daysRemaining <= 0;
        }
        return response;
    }
}
exports.BordereauResponseDto = BordereauResponseDto;
//# sourceMappingURL=bordereau-response.dto.js.map