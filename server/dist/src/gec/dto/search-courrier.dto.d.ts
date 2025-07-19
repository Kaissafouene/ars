import { CourrierType } from './create-courrier.dto';
export declare enum CourrierStatus {
    DRAFT = "DRAFT",
    SENT = "SENT",
    FAILED = "FAILED",
    PENDING_RESPONSE = "PENDING_RESPONSE",
    RESPONDED = "RESPONDED"
}
export declare class SearchCourrierDto {
    type?: CourrierType;
    status?: CourrierStatus;
    clientId?: string;
    bordereauId?: string;
    createdAfter?: string;
    createdBefore?: string;
}
