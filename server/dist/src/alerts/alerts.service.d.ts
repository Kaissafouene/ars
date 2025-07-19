import { PrismaService } from '../prisma/prisma.service';
import { AlertsQueryDto } from './dto/alerts-query.dto';
import { OutlookService } from '../integrations/outlook.service';
export declare class AlertsService {
    private prisma;
    private readonly outlook;
    triggerAlert(arg0: {
        type: string;
        bsId: string;
    }): void;
    constructor(prisma: PrismaService, outlook: OutlookService);
    getSlaPredictionAI(items: any[]): Promise<any>;
    private checkAlertsRole;
    getAlertsDashboard(query: AlertsQueryDto, user: any): Promise<{
        bordereau: {
            courriers: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                bordereauId: string | null;
                type: import(".prisma/client").$Enums.CourrierType;
                status: import(".prisma/client").$Enums.CourrierStatus;
                subject: string;
                body: string;
                templateUsed: string;
                sentAt: Date | null;
                responseAt: Date | null;
                uploadedById: string;
            }[];
            client: {
                id: string;
                createdAt: Date;
                name: string;
                reglementDelay: number;
                reclamationDelay: number;
                updatedAt: Date;
                slaConfig: import("@prisma/client/runtime/library").JsonValue | null;
            };
            contract: {
                id: string;
                createdAt: Date;
                clientId: string;
                clientName: string;
                delaiReglement: number;
                delaiReclamation: number;
                escalationThreshold: number | null;
                documentPath: string;
                assignedManagerId: string;
                startDate: Date;
                endDate: Date;
                signature: string | null;
                updatedAt: Date;
                version: number;
                thresholds: import("@prisma/client/runtime/library").JsonValue | null;
            };
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
            } | null;
        } & {
            id: string;
            createdAt: Date;
            clientId: string;
            delaiReglement: number;
            updatedAt: Date;
            contractId: string;
            reference: string;
            dateReception: Date;
            dateDebutScan: Date | null;
            dateFinScan: Date | null;
            dateReceptionSante: Date | null;
            dateCloture: Date | null;
            dateDepotVirement: Date | null;
            dateExecutionVirement: Date | null;
            statut: import(".prisma/client").$Enums.Statut;
            nombreBS: number;
            currentHandlerId: string | null;
            teamId: string | null;
            assignedToUserId: string | null;
            prestataireId: string | null;
            priority: number;
        };
        alertLevel: "green" | "orange" | "red";
        reason: string;
        slaThreshold: number;
        daysSinceReception: number;
    }[]>;
    getTeamOverloadAlerts(user: any): Promise<{
        team: {
            role: string;
            createdAt: Date;
            id: string;
            email: string;
            password: string;
            fullName: string;
        };
        count: number;
        alert: string;
        reason: string;
    }[]>;
    getReclamationAlerts(user: any): Promise<{
        reclamation: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            bordereauId: string | null;
            type: import(".prisma/client").$Enums.CourrierType;
            status: import(".prisma/client").$Enums.CourrierStatus;
            subject: string;
            body: string;
            templateUsed: string;
            sentAt: Date | null;
            responseAt: Date | null;
            uploadedById: string;
        };
        alert: string;
        reason: string;
        status: import(".prisma/client").$Enums.CourrierStatus;
    }[]>;
    getDelayPredictions(user: any): Promise<{
        slope: number;
        intercept: number;
        nextWeekForecast: number;
        recommendation: string;
    }>;
    notify(role: string, message: string, alert?: any): Promise<{
        role: string;
        message: string;
        sent: boolean;
    }>;
    notifyRole(role: string, alert: any): Promise<void>;
    getAlertHistory(query: any, user: any): Promise<({
        user: {
            password: string;
            id: string;
            email: string;
            fullName: string;
            role: string;
            department: string | null;
            active: boolean;
            createdAt: Date;
        } | null;
        bordereau: {
            id: string;
            createdAt: Date;
            clientId: string;
            delaiReglement: number;
            updatedAt: Date;
            contractId: string;
            reference: string;
            dateReception: Date;
            dateDebutScan: Date | null;
            dateFinScan: Date | null;
            dateReceptionSante: Date | null;
            dateCloture: Date | null;
            dateDepotVirement: Date | null;
            dateExecutionVirement: Date | null;
            statut: import(".prisma/client").$Enums.Statut;
            nombreBS: number;
            currentHandlerId: string | null;
            teamId: string | null;
            assignedToUserId: string | null;
            prestataireId: string | null;
            priority: number;
        } | null;
        document: {
            id: string;
            name: string;
            bordereauId: string | null;
            type: string;
            status: import(".prisma/client").$Enums.DocumentStatus | null;
            uploadedById: string;
            path: string;
            uploadedAt: Date;
            ocrResult: import("@prisma/client/runtime/library").JsonValue | null;
            hash: string | null;
            ocrText: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        documentId: string | null;
        bordereauId: string | null;
        userId: string | null;
        alertType: string;
        alertLevel: string;
        message: string;
        notifiedRoles: string[];
        resolved: boolean;
        resolvedAt: Date | null;
    })[]>;
    resolveAlert(alertId: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        documentId: string | null;
        bordereauId: string | null;
        userId: string | null;
        alertType: string;
        alertLevel: string;
        message: string;
        notifiedRoles: string[];
        resolved: boolean;
        resolvedAt: Date | null;
    }>;
    getPriorityList(user: any): Promise<{
        bordereau: {
            courriers: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                bordereauId: string | null;
                type: import(".prisma/client").$Enums.CourrierType;
                status: import(".prisma/client").$Enums.CourrierStatus;
                subject: string;
                body: string;
                templateUsed: string;
                sentAt: Date | null;
                responseAt: Date | null;
                uploadedById: string;
            }[];
            client: {
                id: string;
                createdAt: Date;
                name: string;
                reglementDelay: number;
                reclamationDelay: number;
                updatedAt: Date;
                slaConfig: import("@prisma/client/runtime/library").JsonValue | null;
            };
            contract: {
                id: string;
                createdAt: Date;
                clientId: string;
                clientName: string;
                delaiReglement: number;
                delaiReclamation: number;
                escalationThreshold: number | null;
                documentPath: string;
                assignedManagerId: string;
                startDate: Date;
                endDate: Date;
                signature: string | null;
                updatedAt: Date;
                version: number;
                thresholds: import("@prisma/client/runtime/library").JsonValue | null;
            };
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
            } | null;
        } & {
            id: string;
            createdAt: Date;
            clientId: string;
            delaiReglement: number;
            updatedAt: Date;
            contractId: string;
            reference: string;
            dateReception: Date;
            dateDebutScan: Date | null;
            dateFinScan: Date | null;
            dateReceptionSante: Date | null;
            dateCloture: Date | null;
            dateDepotVirement: Date | null;
            dateExecutionVirement: Date | null;
            statut: import(".prisma/client").$Enums.Statut;
            nombreBS: number;
            currentHandlerId: string | null;
            teamId: string | null;
            assignedToUserId: string | null;
            prestataireId: string | null;
            priority: number;
        };
        alertLevel: "green" | "orange" | "red";
        reason: string;
        slaThreshold: number;
        daysSinceReception: number;
    }[]>;
    getComparativeAnalytics(user: any): Promise<{
        planned: number;
        actual: number;
        gap: number;
    }>;
}
