"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLA_TIMEFRAMES = exports.TASK_TYPES = exports.WORKFLOW_PRIORITY = void 0;
exports.WORKFLOW_PRIORITY = {
    CRITICAL: 3,
    HIGH: 2,
    MEDIUM: 1,
    LOW: 0
};
exports.TASK_TYPES = {
    BORDEREAU_SCAN: 'BORDEREAU_SCAN',
    BS_VALIDATION: 'BS_VALIDATION',
    RECLAMATION: 'RECLAMATION',
    VIREMENT: 'VIREMENT'
};
exports.SLA_TIMEFRAMES = {
    SCAN: 24,
    VALIDATION: 48,
    RECLAMATION: 72,
    PAYMENT: 96
};
//# sourceMappingURL=workflow.constants.js.map