"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPasswordComplex = isPasswordComplex;
exports.recordFailedAttempt = recordFailedAttempt;
exports.isLockedOut = isLockedOut;
exports.resetLockout = resetLockout;
function isPasswordComplex(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
}
const lockoutMap = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
function recordFailedAttempt(email) {
    const entry = lockoutMap.get(email) || { attempts: 0, lockedUntil: null };
    entry.attempts += 1;
    if (entry.attempts >= MAX_ATTEMPTS) {
        entry.lockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
    }
    lockoutMap.set(email, entry);
    return entry.lockedUntil !== null;
}
function isLockedOut(email) {
    const entry = lockoutMap.get(email);
    if (!entry)
        return false;
    if (entry.lockedUntil && entry.lockedUntil > new Date())
        return true;
    if (entry.lockedUntil && entry.lockedUntil <= new Date()) {
        lockoutMap.delete(email);
        return false;
    }
    return false;
}
function resetLockout(email) {
    lockoutMap.delete(email);
}
//# sourceMappingURL=password.utils.js.map