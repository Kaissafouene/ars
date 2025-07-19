export declare class CreateContractDto {
    clientId: string;
    clientName: string;
    delaiReglement: number;
    delaiReclamation: number;
    escalationThreshold?: number;
    documentPath?: string;
    assignedManagerId: string;
    startDate: string;
    endDate: string;
    signatureDate?: string;
}
