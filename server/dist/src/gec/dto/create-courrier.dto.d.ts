export declare enum CourrierType {
    REGLEMENT = "REGLEMENT",
    RELANCE = "RELANCE",
    RECLAMATION = "RECLAMATION",
    AUTRE = "AUTRE"
}
export declare class CreateCourrierDto {
    subject: string;
    body: string;
    type: CourrierType;
    templateUsed: string;
    bordereauId?: string;
}
