import { Statut, User, Contract } from '@prisma/client';
export declare enum StatusColor {
    GREEN = "GREEN",
    ORANGE = "ORANGE",
    RED = "RED"
}
export declare class BordereauResponseDto {
    id: string;
    reference: string;
    clientId: string;
    contractId: string;
    dateReception: Date;
    dateDebutScan?: Date | null;
    dateFinScan?: Date | null;
    dateReceptionSante?: Date | null;
    dateCloture?: Date | null;
    dateDepotVirement?: Date | null;
    dateExecutionVirement?: Date | null;
    delaiReglement: number;
    statut: Statut;
    nombreBS: number;
    createdAt: Date;
    updatedAt: Date;
    daysElapsed?: number;
    daysRemaining?: number;
    statusColor?: StatusColor;
    scanDuration?: number | null;
    totalDuration?: number | null;
    isOverdue?: boolean;
    assignedTo?: string;
    client?: User;
    contract?: Contract;
    constructor(partial: Partial<BordereauResponseDto>);
    static fromEntity(bordereau: any, includeKPIs?: boolean): BordereauResponseDto;
}
