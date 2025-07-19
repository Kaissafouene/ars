export declare enum BSStatus {
    IN_PROGRESS = "IN_PROGRESS",
    VALIDATED = "VALIDATED",
    REJECTED = "REJECTED"
}
export declare const ALLOWED_BS_STATUSES: BSStatus[];
export declare class CreateBSDto {
    bordereauId: string;
    ownerId: string;
    status: BSStatus;
    processedAt?: string;
    documentId?: string;
    numBs: string;
    etat: string;
    nomAssure: string;
    nomBeneficiaire: string;
    nomSociete: string;
    codeAssure: string;
    matricule: any;
    dateSoin: any;
    montant: any;
    acte: any;
    nomPrestation: string;
    nomBordereau: string;
    lien: string;
    dateCreation: string;
    dateMaladie: string;
    totalPec: number;
    observationGlobal: string;
}
export declare class UpdateBSDto {
    etat(etat: any): void;
    status?: BSStatus;
    processedAt?: string;
    documentId?: string;
    nomPrestation: string;
    nomBordereau: string;
    lien: string;
    dateCreation: string;
    dateMaladie: string;
    totalPec: number;
    observationGlobal: string;
}
