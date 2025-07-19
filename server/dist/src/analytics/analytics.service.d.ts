import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsKpiDto } from './dto/analytics-kpi.dto';
import { AnalyticsPerformanceDto } from './dto/analytics-performance.dto';
import { AnalyticsExportDto } from './dto/analytics-export.dto';
export declare class AnalyticsService {
    private prisma;
    estimateResources(filters: any, user: any): Promise<number>;
    getPlannedPerformance(filters: any, user: any): Promise<number>;
    getActualPerformance(filters: any, user: any): Promise<number>;
    getFilteredKpis(filters: any, user: any): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
        _count: {
            id: number;
        };
    })[]>;
    constructor(prisma: PrismaService);
    getPrioritiesAI(items: any[]): Promise<any>;
    getReassignmentAI(payload: any): Promise<any>;
    getPerformanceAI(payload: any): Promise<any>;
    getComparePerformanceAI(payload: any): Promise<any>;
    getDiagnosticOptimisationAI(payload: any): Promise<any>;
    getPredictResourcesAI(payload: any): Promise<any>;
    private checkAnalyticsRole;
    getDailyKpis(query: AnalyticsKpiDto, user: any): Promise<{
        bsPerDay: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "createdAt"[]> & {
            _count: {
                id: number;
            };
        })[];
        avgDelay: number | null;
    }>;
    getPerformance(query: AnalyticsPerformanceDto, user: any): Promise<{
        processedByUser: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "clientId"[]> & {
            _count: {
                id: number;
            };
        })[];
        slaCompliant: number;
    }>;
    getAlerts(user: any): Promise<{
        critical: any;
        warning: any;
        ok: any;
    }>;
    getSlaComplianceByUser(user: any, filters?: any): Promise<{
        userId: any;
        total: any;
        slaCompliant: any;
        complianceRate: number;
    }[]>;
    getReclamationPerformance(user: any, filters?: any): Promise<any[]>;
    getClientDashboard(user: any, filters?: any): Promise<{
        clientId: any;
        volume: number;
        slaCompliant: number;
        slaBreaches: number;
        complianceRate: number;
    }>;
    getUserDailyTargetAnalysis(user: any, filters?: any): Promise<{
        userId: any;
        avgPerDay: number;
        target: any;
        meetsTarget: boolean;
    }[]>;
    getPriorityScoring(user: any, filters?: any): Promise<{
        priorityScore: number;
        daysSinceReception: number;
        slaThreshold: number;
        relances: number;
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
    }[]>;
    getComparativeAnalysis(user: any, filters?: any): Promise<{
        period1: {
            total: number;
            sla: number;
        };
        period2: {
            total: number;
            sla: number;
        };
    }>;
    getSlaTrend(user: any, filters?: any): Promise<{
        date: string;
        total: number;
        slaCompliant: number;
        complianceRate: number;
    }[]>;
    getAlertEscalationFlag(user: any): Promise<{
        escalate: boolean;
    }>;
    getEnhancedRecommendations(user: any): Promise<{
        tips: string[];
        forecast: {
            slope: number;
            intercept: number;
            nextWeekForecast: number;
            history: {
                day: number;
                count: number;
            }[];
        };
        neededStaff: number;
        recommendation: string;
    }>;
    getRecommendations(user: any): Promise<{
        forecast: {
            slope: number;
            intercept: number;
            nextWeekForecast: number;
            history: {
                day: number;
                count: number;
            }[];
        };
        neededStaff: number;
        recommendation: string;
    }>;
    getTrends(user: any, period?: 'day' | 'week' | 'month'): Promise<{
        date: Date;
        count: number;
    }[]>;
    getForecast(user: any): Promise<{
        slope: number;
        intercept: number;
        nextWeekForecast: number;
        history: {
            day: number;
            count: number;
        }[];
    }>;
    getThroughputGap(user: any): Promise<{
        planned: number;
        actual: number;
        gap: number;
    }>;
    exportAnalytics(query: AnalyticsExportDto, user: any): Promise<{
        filePath: string;
    }>;
    getTraceability(bordereauId: string, user: any): Promise<({
        documents: {
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
        }[];
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
    }) | null>;
    getCourrierVolume(user: any): Promise<{
        byStatus: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.CourrierGroupByOutputType, "status"[]> & {
            _count: {
                id: number;
            };
        })[];
        byType: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.CourrierGroupByOutputType, "type"[]> & {
            _count: {
                id: number;
            };
        })[];
        byUser: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.CourrierGroupByOutputType, "uploadedById"[]> & {
            _count: {
                id: number;
            };
        })[];
    }>;
    getCourrierSlaBreaches(user: any): Promise<{
        pending: {
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
        lateResponses: {
            id: string;
            subject: string;
            sentAt: Date | null;
            responseAt: Date | null;
        }[];
    }>;
    getCourrierRecurrence(user: any): Promise<{
        relances: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.CourrierGroupByOutputType, "bordereauId"[]> & {
            _count: {
                id: number;
            };
        })[];
        reclamations: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.CourrierGroupByOutputType, "bordereauId"[]> & {
            _count: {
                id: number;
            };
        })[];
    }>;
    getCourrierEscalations(user: any): Promise<{
        escalatedRelances: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.CourrierGroupByOutputType, "bordereauId"[]> & {
            _count: {
                id: number;
            };
        })[];
        failed: {
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
    }>;
}
