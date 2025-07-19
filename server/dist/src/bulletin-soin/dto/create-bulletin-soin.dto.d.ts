import { BulletinSoinItem } from '../entities/bulletin-soin.entity';
export declare class CreateBulletinSoinDto {
    numBs: string;
    codeAssure: string;
    nomAssure: string;
    dateMaladie: Date;
    items: BulletinSoinItem[];
    nomBeneficiaire: string;
    nomSociete: string;
    nomPrestation: string;
    nomBordereau: string;
    lien: string;
    dateCreation: Date;
    totalPec: number;
    observationGlobal: string;
    etat: string;
    ownerId?: number;
}
