import { PrismaService } from '../prisma/prisma.service';
import { CreateBulletinSoinDto } from './dto/create-bulletin-soin.dto';
import { UpdateBulletinSoinDto } from './dto/update-bulletin-soin.dto';
import { AssignBulletinSoinDto } from './dto/assign-bulletin-soin.dto';
import { ExpertiseInfoDto } from './dto/expertise-info.dto';
import { BsLogDto } from './dto/bs-log.dto';
import { BsQueryDto } from './dto/bs-query.dto';
import { Prisma } from '@prisma/client';
import { AlertsService } from '../alerts/alerts.service';
import { OcrService } from '../ocr/ocr.service';
import { ReconciliationReport } from './reconciliation.types';
export declare class BulletinSoinService {
    private prisma;
    private readonly alertsService;
    private readonly ocrService;
    constructor(prisma: PrismaService, alertsService: AlertsService, ocrService: OcrService);
    getPaymentStatus(bsId: string): Promise<{
        status: string;
        virement: null;
    } | {
        status: string;
        virement: {
            id: string;
            createdAt: Date;
            priority: number;
            bordereauId: string;
            montant: number;
            referenceBancaire: string;
            dateDepot: Date;
            dateExecution: Date;
            confirmed: boolean;
            confirmedById: string | null;
            confirmedAt: Date | null;
        };
    }>;
    getBsForVirement(virementId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: number;
        bordereauId: string;
        ownerId: string | null;
        processedAt: Date | null;
        nomPrestation: string;
        nomBordereau: string;
        lien: string;
        dateCreation: Date;
        dateMaladie: Date;
        totalPec: number;
        observationGlobal: string;
        montant: number | null;
        ocrText: string | null;
        numBs: string;
        codeAssure: string;
        nomAssure: string;
        nomBeneficiaire: string;
        nomSociete: string;
        etat: string;
        matricule: string | null;
        dateSoin: Date | null;
        acte: string | null;
        processedById: string | null;
        dueDate: Date | null;
        virementId: string | null;
        deletedAt: Date | null;
    }[]>;
    markBsAsPaid(bsId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: number;
        bordereauId: string;
        ownerId: string | null;
        processedAt: Date | null;
        nomPrestation: string;
        nomBordereau: string;
        lien: string;
        dateCreation: Date;
        dateMaladie: Date;
        totalPec: number;
        observationGlobal: string;
        montant: number | null;
        ocrText: string | null;
        numBs: string;
        codeAssure: string;
        nomAssure: string;
        nomBeneficiaire: string;
        nomSociete: string;
        etat: string;
        matricule: string | null;
        dateSoin: Date | null;
        acte: string | null;
        processedById: string | null;
        dueDate: Date | null;
        virementId: string | null;
        deletedAt: Date | null;
    }>;
    reconcilePaymentsWithAccounting(): Promise<ReconciliationReport>;
    exportBsListToExcel(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: number;
        bordereauId: string;
        ownerId: string | null;
        processedAt: Date | null;
        nomPrestation: string;
        nomBordereau: string;
        lien: string;
        dateCreation: Date;
        dateMaladie: Date;
        totalPec: number;
        observationGlobal: string;
        montant: number | null;
        ocrText: string | null;
        numBs: string;
        codeAssure: string;
        nomAssure: string;
        nomBeneficiaire: string;
        nomSociete: string;
        etat: string;
        matricule: string | null;
        dateSoin: Date | null;
        acte: string | null;
        processedById: string | null;
        dueDate: Date | null;
        virementId: string | null;
        deletedAt: Date | null;
    }[]>;
    analyseCharge(): Promise<{
        id: string;
        fullName: string;
        inProgress: number;
        risk: "HIGH" | "MEDIUM" | "LOW";
    }[]>;
    getBsWithReclamations(): Promise<{
        reclamations: {
            id: string;
            department: string | null;
            createdAt: Date;
            clientId: string;
            updatedAt: Date;
            contractId: string | null;
            priority: number;
            documentId: string | null;
            bordereauId: string | null;
            type: string;
            severity: string;
            status: string;
            description: string;
            assignedToId: string | null;
            createdById: string;
            evidencePath: string | null;
            processId: string | null;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: number;
        bordereauId: string;
        ownerId: string | null;
        processedAt: Date | null;
        nomPrestation: string;
        nomBordereau: string;
        lien: string;
        dateCreation: Date;
        dateMaladie: Date;
        totalPec: number;
        observationGlobal: string;
        montant: number | null;
        ocrText: string | null;
        numBs: string;
        codeAssure: string;
        nomAssure: string;
        nomBeneficiaire: string;
        nomSociete: string;
        etat: string;
        matricule: string | null;
        dateSoin: Date | null;
        acte: string | null;
        processedById: string | null;
        dueDate: Date | null;
        virementId: string | null;
        deletedAt: Date | null;
    }[]>;
    calculateDueDate(dateCreation: Date, contractId?: string): Promise<Date>;
    suggestRebalancing(): Promise<{
        bsId: string;
        from: string;
        to: string;
    }[]>;
    estimateEscalationRisk(bsId: string): Promise<{
        risk: string;
    }>;
    sendNotification({ to, subject, text, }: {
        to: string;
        subject: string;
        text: string;
    }): Promise<any>;
    notifySlaAlerts(): Promise<void>;
    notifyAssignment(bsId: string, userId: string): Promise<void>;
    notifyOverload(gestionnaireId: string, riskLevel: 'HIGH' | 'MEDIUM' | 'LOW'): Promise<void>;
    create(dto: CreateBulletinSoinDto): Promise<{
        items: {
            id: string;
            message: string;
            bulletinSoinId: string;
            nomProduit: string;
            quantite: number;
            commentaire: string;
            nomChapitre: string;
            nomPrestataire: string;
            datePrestation: Date;
            typeHonoraire: string;
            depense: number;
            pec: number;
            participationAdherent: number;
            codeMessage: string;
            acuiteDroite: number;
            acuiteGauche: number;
            nombreCle: string;
            nbJourDepassement: number;
        }[];
        expertises: {
            id: string;
            contrat: string;
            bulletinSoinId: string;
            isFavorable: string;
            matriculeAdherent: string;
            numBS: string;
            cin: string;
            vlodsphere: number | null;
            vpogsphere: number | null;
            prixMonture: number | null;
            codification: string | null;
            natureActe: string | null;
            societe: string | null;
            dents: string | null;
        }[];
        logs: {
            id: string;
            userId: string;
            action: string;
            bsId: string;
            timestamp: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: number;
        bordereauId: string;
        ownerId: string | null;
        processedAt: Date | null;
        nomPrestation: string;
        nomBordereau: string;
        lien: string;
        dateCreation: Date;
        dateMaladie: Date;
        totalPec: number;
        observationGlobal: string;
        montant: number | null;
        ocrText: string | null;
        numBs: string;
        codeAssure: string;
        nomAssure: string;
        nomBeneficiaire: string;
        nomSociete: string;
        etat: string;
        matricule: string | null;
        dateSoin: Date | null;
        acte: string | null;
        processedById: string | null;
        dueDate: Date | null;
        virementId: string | null;
        deletedAt: Date | null;
    }>;
    findAll(query: BsQueryDto, user: any): Promise<{
        items: ({
            items: {
                id: string;
                message: string;
                bulletinSoinId: string;
                nomProduit: string;
                quantite: number;
                commentaire: string;
                nomChapitre: string;
                nomPrestataire: string;
                datePrestation: Date;
                typeHonoraire: string;
                depense: number;
                pec: number;
                participationAdherent: number;
                codeMessage: string;
                acuiteDroite: number;
                acuiteGauche: number;
                nombreCle: string;
                nbJourDepassement: number;
            }[];
            expertises: {
                id: string;
                contrat: string;
                bulletinSoinId: string;
                isFavorable: string;
                matriculeAdherent: string;
                numBS: string;
                cin: string;
                vlodsphere: number | null;
                vpogsphere: number | null;
                prixMonture: number | null;
                codification: string | null;
                natureActe: string | null;
                societe: string | null;
                dents: string | null;
            }[];
            logs: {
                id: string;
                userId: string;
                action: string;
                bsId: string;
                timestamp: Date;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            priority: number;
            bordereauId: string;
            ownerId: string | null;
            processedAt: Date | null;
            nomPrestation: string;
            nomBordereau: string;
            lien: string;
            dateCreation: Date;
            dateMaladie: Date;
            totalPec: number;
            observationGlobal: string;
            montant: number | null;
            ocrText: string | null;
            numBs: string;
            codeAssure: string;
            nomAssure: string;
            nomBeneficiaire: string;
            nomSociete: string;
            etat: string;
            matricule: string | null;
            dateSoin: Date | null;
            acte: string | null;
            processedById: string | null;
            dueDate: Date | null;
            virementId: string | null;
            deletedAt: Date | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string, user: any): Promise<{
        items: {
            id: string;
            message: string;
            bulletinSoinId: string;
            nomProduit: string;
            quantite: number;
            commentaire: string;
            nomChapitre: string;
            nomPrestataire: string;
            datePrestation: Date;
            typeHonoraire: string;
            depense: number;
            pec: number;
            participationAdherent: number;
            codeMessage: string;
            acuiteDroite: number;
            acuiteGauche: number;
            nombreCle: string;
            nbJourDepassement: number;
        }[];
        expertises: {
            id: string;
            contrat: string;
            bulletinSoinId: string;
            isFavorable: string;
            matriculeAdherent: string;
            numBS: string;
            cin: string;
            vlodsphere: number | null;
            vpogsphere: number | null;
            prixMonture: number | null;
            codification: string | null;
            natureActe: string | null;
            societe: string | null;
            dents: string | null;
        }[];
        logs: {
            id: string;
            userId: string;
            action: string;
            bsId: string;
            timestamp: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: number;
        bordereauId: string;
        ownerId: string | null;
        processedAt: Date | null;
        nomPrestation: string;
        nomBordereau: string;
        lien: string;
        dateCreation: Date;
        dateMaladie: Date;
        totalPec: number;
        observationGlobal: string;
        montant: number | null;
        ocrText: string | null;
        numBs: string;
        codeAssure: string;
        nomAssure: string;
        nomBeneficiaire: string;
        nomSociete: string;
        etat: string;
        matricule: string | null;
        dateSoin: Date | null;
        acte: string | null;
        processedById: string | null;
        dueDate: Date | null;
        virementId: string | null;
        deletedAt: Date | null;
    }>;
    update(id: string, dto: UpdateBulletinSoinDto, user: any): Promise<{
        items: {
            id: string;
            message: string;
            bulletinSoinId: string;
            nomProduit: string;
            quantite: number;
            commentaire: string;
            nomChapitre: string;
            nomPrestataire: string;
            datePrestation: Date;
            typeHonoraire: string;
            depense: number;
            pec: number;
            participationAdherent: number;
            codeMessage: string;
            acuiteDroite: number;
            acuiteGauche: number;
            nombreCle: string;
            nbJourDepassement: number;
        }[];
        expertises: {
            id: string;
            contrat: string;
            bulletinSoinId: string;
            isFavorable: string;
            matriculeAdherent: string;
            numBS: string;
            cin: string;
            vlodsphere: number | null;
            vpogsphere: number | null;
            prixMonture: number | null;
            codification: string | null;
            natureActe: string | null;
            societe: string | null;
            dents: string | null;
        }[];
        logs: {
            id: string;
            userId: string;
            action: string;
            bsId: string;
            timestamp: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: number;
        bordereauId: string;
        ownerId: string | null;
        processedAt: Date | null;
        nomPrestation: string;
        nomBordereau: string;
        lien: string;
        dateCreation: Date;
        dateMaladie: Date;
        totalPec: number;
        observationGlobal: string;
        montant: number | null;
        ocrText: string | null;
        numBs: string;
        codeAssure: string;
        nomAssure: string;
        nomBeneficiaire: string;
        nomSociete: string;
        etat: string;
        matricule: string | null;
        dateSoin: Date | null;
        acte: string | null;
        processedById: string | null;
        dueDate: Date | null;
        virementId: string | null;
        deletedAt: Date | null;
    }>;
    remove(id: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: number;
        bordereauId: string;
        ownerId: string | null;
        processedAt: Date | null;
        nomPrestation: string;
        nomBordereau: string;
        lien: string;
        dateCreation: Date;
        dateMaladie: Date;
        totalPec: number;
        observationGlobal: string;
        montant: number | null;
        ocrText: string | null;
        numBs: string;
        codeAssure: string;
        nomAssure: string;
        nomBeneficiaire: string;
        nomSociete: string;
        etat: string;
        matricule: string | null;
        dateSoin: Date | null;
        acte: string | null;
        processedById: string | null;
        dueDate: Date | null;
        virementId: string | null;
        deletedAt: Date | null;
    }>;
    assign(id: string, dto: AssignBulletinSoinDto, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: number;
        bordereauId: string;
        ownerId: string | null;
        processedAt: Date | null;
        nomPrestation: string;
        nomBordereau: string;
        lien: string;
        dateCreation: Date;
        dateMaladie: Date;
        totalPec: number;
        observationGlobal: string;
        montant: number | null;
        ocrText: string | null;
        numBs: string;
        codeAssure: string;
        nomAssure: string;
        nomBeneficiaire: string;
        nomSociete: string;
        etat: string;
        matricule: string | null;
        dateSoin: Date | null;
        acte: string | null;
        processedById: string | null;
        dueDate: Date | null;
        virementId: string | null;
        deletedAt: Date | null;
    }>;
    getOcr(id: string, user: any): Promise<{
        ocrText: string;
    }>;
    getOcrText(bulletinSoinId: string): Promise<string>;
    getExpertise(id: string, user: any): Promise<{
        id: string;
        contrat: string;
        bulletinSoinId: string;
        isFavorable: string;
        matriculeAdherent: string;
        numBS: string;
        cin: string;
        vlodsphere: number | null;
        vpogsphere: number | null;
        prixMonture: number | null;
        codification: string | null;
        natureActe: string | null;
        societe: string | null;
        dents: string | null;
    }[]>;
    upsertExpertise(p0: number, dto: ExpertiseInfoDto, bsId: string, expertiseData: ExpertiseInfoDto): Promise<{
        id: string;
        contrat: string;
        bulletinSoinId: string;
        isFavorable: string;
        matriculeAdherent: string;
        numBS: string;
        cin: string;
        vlodsphere: number | null;
        vpogsphere: number | null;
        prixMonture: number | null;
        codification: string | null;
        natureActe: string | null;
        societe: string | null;
        dents: string | null;
    }>;
    getLogs(id: string, user: any): Promise<{
        id: string;
        userId: string;
        action: string;
        bsId: string;
        timestamp: Date;
    }[]>;
    addLog(id: string, dto: BsLogDto, user: any): Promise<{
        id: string;
        userId: string;
        action: string;
        bsId: string;
        timestamp: Date;
    }>;
    softDelete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: number;
        bordereauId: string;
        ownerId: string | null;
        processedAt: Date | null;
        nomPrestation: string;
        nomBordereau: string;
        lien: string;
        dateCreation: Date;
        dateMaladie: Date;
        totalPec: number;
        observationGlobal: string;
        montant: number | null;
        ocrText: string | null;
        numBs: string;
        codeAssure: string;
        nomAssure: string;
        nomBeneficiaire: string;
        nomSociete: string;
        etat: string;
        matricule: string | null;
        dateSoin: Date | null;
        acte: string | null;
        processedById: string | null;
        dueDate: Date | null;
        virementId: string | null;
        deletedAt: Date | null;
    }>;
    getPerformanceMetrics({ start, end }: {
        start: Date;
        end: Date;
    }): Promise<(Prisma.PickEnumerable<Prisma.BulletinSoinGroupByOutputType, "processedById"[]> & {
        _count: {
            id: number;
        };
    })[]>;
    getSlaAlerts(): Promise<{
        overdue: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            priority: number;
            bordereauId: string;
            ownerId: string | null;
            processedAt: Date | null;
            nomPrestation: string;
            nomBordereau: string;
            lien: string;
            dateCreation: Date;
            dateMaladie: Date;
            totalPec: number;
            observationGlobal: string;
            montant: number | null;
            ocrText: string | null;
            numBs: string;
            codeAssure: string;
            nomAssure: string;
            nomBeneficiaire: string;
            nomSociete: string;
            etat: string;
            matricule: string | null;
            dateSoin: Date | null;
            acte: string | null;
            processedById: string | null;
            dueDate: Date | null;
            virementId: string | null;
            deletedAt: Date | null;
        }[];
        approaching: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            priority: number;
            bordereauId: string;
            ownerId: string | null;
            processedAt: Date | null;
            nomPrestation: string;
            nomBordereau: string;
            lien: string;
            dateCreation: Date;
            dateMaladie: Date;
            totalPec: number;
            observationGlobal: string;
            montant: number | null;
            ocrText: string | null;
            numBs: string;
            codeAssure: string;
            nomAssure: string;
            nomBeneficiaire: string;
            nomSociete: string;
            etat: string;
            matricule: string | null;
            dateSoin: Date | null;
            acte: string | null;
            processedById: string | null;
            dueDate: Date | null;
            virementId: string | null;
            deletedAt: Date | null;
        }[];
    }>;
    suggestAssignment(): Promise<{
        id: string;
        fullName: string;
        inProgress: number;
        overdue: number;
        avgProcessingHours: number | null;
        score: number;
    }[]>;
    suggestPriorities(gestionnaireId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: number;
        bordereauId: string;
        ownerId: string | null;
        processedAt: Date | null;
        nomPrestation: string;
        nomBordereau: string;
        lien: string;
        dateCreation: Date;
        dateMaladie: Date;
        totalPec: number;
        observationGlobal: string;
        montant: number | null;
        ocrText: string | null;
        numBs: string;
        codeAssure: string;
        nomAssure: string;
        nomBeneficiaire: string;
        nomSociete: string;
        etat: string;
        matricule: string | null;
        dateSoin: Date | null;
        acte: string | null;
        processedById: string | null;
        dueDate: Date | null;
        virementId: string | null;
        deletedAt: Date | null;
    }[]>;
}
