export declare function isPasswordComplex(password: string): boolean;
export declare function recordFailedAttempt(email: string): boolean;
export declare function isLockedOut(email: string): boolean;
export declare function resetLockout(email: string): void;
