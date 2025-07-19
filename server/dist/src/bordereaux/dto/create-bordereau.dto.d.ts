import { Statut } from './statut.enum';
export declare class CreateBordereauDto {
    reference: string;
    dateReception: string;
    clientId: string;
    contractId: string;
    dateDebutScan?: string;
    dateFinScan?: string;
    dateReceptionSante?: string;
    dateCloture?: string;
    dateDepotVirement?: string;
    dateExecutionVirement?: string;
    delaiReglement: number;
    statut?: Statut;
    nombreBS: number;
}
