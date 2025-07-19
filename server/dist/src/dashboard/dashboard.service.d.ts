import { TraitementService } from '../traitement/traitement.service';
import { BordereauxService } from '../bordereaux/bordereaux.service';
import { ReclamationsService } from '../reclamations/reclamations.service';
import { AlertsService } from '../alerts/alerts.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { TuniclaimService } from '../integrations/tuniclaim.service';
export declare class DashboardService {
    private traitement;
    private bordereaux;
    private reclamations;
    private alerts;
    private analytics;
    private tuniclaim;
    constructor(traitement: TraitementService, bordereaux: BordereauxService, reclamations: ReclamationsService, alerts: AlertsService, analytics: AnalyticsService, tuniclaim: TuniclaimService);
    getKpis(user: any): Promise<{
        totalBordereaux: number;
        bsProcessed: number;
        bsRejected: number;
        pendingReclamations: number;
        slaBreaches: number;
        overdueVirements: number;
    }>;
    getPerformance(user: any): Promise<{
        user: any;
        bsProcessed: any;
        avgTime: number;
    }[]>;
    getSlaStatus(user: any): Promise<{
        type: string;
        status: string;
        value: number;
    }[]>;
    getAlerts(user: any): Promise<{
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
    getCharts(user: any): Promise<{
        trend: {
            date: Date;
            count: number;
        }[];
    }>;
    getOverview(query: any, user: any): Promise<{
        traitementKpi: {
            total: number;
            traite: number;
            enDifficulte: number;
            avgDelay: number | null;
        };
        bordereauKpi: import("../bordereaux/interfaces/kpi.interface").BordereauKPI[];
        reclamationKpi: {
            total: number;
            open: number;
            resolved: number;
            byType: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ReclamationGroupByOutputType, "type"[]> & {
                _count: {
                    id: number;
                };
            })[];
            bySeverity: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ReclamationGroupByOutputType, "severity"[]> & {
                _count: {
                    id: number;
                };
            })[];
            byDepartment: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ReclamationGroupByOutputType, "department"[]> & {
                _count: {
                    id: number;
                };
            })[];
            avgResolution: number;
            minResolution: number;
            maxResolution: number;
            byUser: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ReclamationGroupByOutputType, "assignedToId"[]> & {
                _count: {
                    id: number;
                };
            })[];
            byManager: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ReclamationGroupByOutputType, "createdById"[]> & {
                _count: {
                    id: number;
                };
            })[];
        };
        aiReco: {
            enDifficulte: number;
            recommendation: string;
        };
        alerts: {
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
        }[];
        analytics: {
            bsPerDay: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "createdAt"[]> & {
                _count: {
                    id: number;
                };
            })[];
            avgDelay: number | null;
        };
        trends: {
            date: Date;
            count: number;
        }[];
        filters: {
            period: any;
            teamId: any;
            status: any;
            fromDate: any;
            toDate: any;
        };
        lastUpdated: string;
    }>;
    getAlertsSummary(query: any, user: any): Promise<{
        summary: Record<string, number>;
        total: number;
    }>;
    getSyncStatus(): Promise<{
        lastSync: any;
        imported: any;
        errors: any;
        details: any;
    }>;
    getSyncLogs(limit?: number): Promise<any>;
    syncAndSaveStatus(): Promise<{
        lastSync: any;
        imported: any;
        errors: any;
        details: any;
    }>;
    exportKpis(query: any, user: any): Promise<{
        filePath: string;
    }>;
    getAdvancedKpis(query: any, user: any): Promise<{
        planned: {
            processedByUser: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "clientId"[]> & {
                _count: {
                    id: number;
                };
            })[];
            slaCompliant: number;
        };
        actual: {
            processedByUser: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "clientId"[]> & {
                _count: {
                    id: number;
                };
            })[];
            slaCompliant: number;
        };
        resourceEstimation: number;
        length: number;
        toString(): string;
        toLocaleString(): string;
        toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions & Intl.DateTimeFormatOptions): string;
        pop(): (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }) | undefined;
        push(...items: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]): number;
        concat(...items: ConcatArray<import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }>[]): (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[];
        concat(...items: ((import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }) | ConcatArray<import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }>)[]): (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[];
        join(separator?: string): string;
        reverse(): (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[];
        shift(): (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }) | undefined;
        slice(start?: number, end?: number): (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[];
        sort(compareFn?: ((a: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, b: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }) => number) | undefined): (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[];
        splice(start: number, deleteCount?: number): (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[];
        splice(start: number, deleteCount: number, ...items: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]): (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[];
        unshift(...items: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]): number;
        indexOf(searchElement: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, fromIndex?: number): number;
        lastIndexOf(searchElement: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, fromIndex?: number): number;
        every<S extends import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }>(predicate: (value: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, index: number, array: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]) => value is S, thisArg?: any): this is S[];
        every(predicate: (value: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, index: number, array: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]) => unknown, thisArg?: any): boolean;
        some(predicate: (value: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, index: number, array: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]) => unknown, thisArg?: any): boolean;
        forEach(callbackfn: (value: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, index: number, array: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, index: number, array: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]) => U, thisArg?: any): U[];
        filter<S extends import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }>(predicate: (value: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, index: number, array: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]) => value is S, thisArg?: any): S[];
        filter(predicate: (value: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, index: number, array: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]) => unknown, thisArg?: any): (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[];
        reduce(callbackfn: (previousValue: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, currentValue: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, currentIndex: number, array: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]) => import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }): import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        };
        reduce(callbackfn: (previousValue: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, currentValue: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, currentIndex: number, array: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]) => import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, initialValue: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }): import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        };
        reduce<U>(callbackfn: (previousValue: U, currentValue: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, currentIndex: number, array: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]) => U, initialValue: U): U;
        reduceRight(callbackfn: (previousValue: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, currentValue: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, currentIndex: number, array: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]) => import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }): import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        };
        reduceRight(callbackfn: (previousValue: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, currentValue: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, currentIndex: number, array: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]) => import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, initialValue: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }): import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        };
        reduceRight<U>(callbackfn: (previousValue: U, currentValue: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, currentIndex: number, array: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]) => U, initialValue: U): U;
        find<S extends import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }>(predicate: (value: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, index: number, obj: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]) => value is S, thisArg?: any): S | undefined;
        find(predicate: (value: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, index: number, obj: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]) => unknown, thisArg?: any): (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }) | undefined;
        findIndex(predicate: (value: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, index: number, obj: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]) => unknown, thisArg?: any): number;
        fill(value: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, start?: number, end?: number): (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[];
        copyWithin(target: number, start: number, end?: number): (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[];
        entries(): ArrayIterator<[number, import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }]>;
        keys(): ArrayIterator<number>;
        values(): ArrayIterator<import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }>;
        includes(searchElement: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, fromIndex?: number): boolean;
        flatMap<U, This = undefined>(callback: (this: This, value: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, index: number, array: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]) => U | readonly U[], thisArg?: This | undefined): U[];
        flat<A, D extends number = 1>(this: A, depth?: D | undefined): FlatArray<A, D>[];
        at(index: number): (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }) | undefined;
        findLast<S extends import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }>(predicate: (value: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, index: number, array: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]) => value is S, thisArg?: any): S | undefined;
        findLast(predicate: (value: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, index: number, array: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]) => unknown, thisArg?: any): (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }) | undefined;
        findLastIndex(predicate: (value: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, index: number, array: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]) => unknown, thisArg?: any): number;
        toReversed(): (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[];
        toSorted(compareFn?: ((a: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }, b: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }) => number) | undefined): (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[];
        toSpliced(start: number, deleteCount: number, ...items: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[]): (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[];
        toSpliced(start: number, deleteCount?: number): (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[];
        with(index: number, value: import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }): (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        })[];
        [Symbol.iterator](): ArrayIterator<import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BordereauGroupByOutputType, "statut"[]> & {
            _count: {
                id: number;
            };
        }>;
        [Symbol.unscopables]: {
            [x: number]: boolean | undefined;
            length?: boolean | undefined;
            toString?: boolean | undefined;
            toLocaleString?: boolean | undefined;
            pop?: boolean | undefined;
            push?: boolean | undefined;
            concat?: boolean | undefined;
            join?: boolean | undefined;
            reverse?: boolean | undefined;
            shift?: boolean | undefined;
            slice?: boolean | undefined;
            sort?: boolean | undefined;
            splice?: boolean | undefined;
            unshift?: boolean | undefined;
            indexOf?: boolean | undefined;
            lastIndexOf?: boolean | undefined;
            every?: boolean | undefined;
            some?: boolean | undefined;
            forEach?: boolean | undefined;
            map?: boolean | undefined;
            filter?: boolean | undefined;
            reduce?: boolean | undefined;
            reduceRight?: boolean | undefined;
            find?: boolean | undefined;
            findIndex?: boolean | undefined;
            fill?: boolean | undefined;
            copyWithin?: boolean | undefined;
            entries?: boolean | undefined;
            keys?: boolean | undefined;
            values?: boolean | undefined;
            includes?: boolean | undefined;
            flatMap?: boolean | undefined;
            flat?: boolean | undefined;
            at?: boolean | undefined;
            findLast?: boolean | undefined;
            findLastIndex?: boolean | undefined;
            toReversed?: boolean | undefined;
            toSorted?: boolean | undefined;
            toSpliced?: boolean | undefined;
            with?: boolean | undefined;
            [Symbol.iterator]?: boolean | undefined;
            readonly [Symbol.unscopables]?: boolean | undefined;
        };
    }>;
    getDepartments(user: any): Promise<{
        id: string;
        name: string;
        details: string;
    }[]>;
}
