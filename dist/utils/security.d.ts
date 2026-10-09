/**
 * Security utilities for input validation and sanitization.
 *
 * Inspired by Premiere Pro MCP's security.ts pattern.
 * Protects against path traversal, injection, and abuse via MCP tool calls.
 */
/**
 * Sanitizes string input to prevent injection attacks.
 */
export declare function sanitizeInput(input: string): string;
/**
 * Validates file paths to prevent path traversal attacks.
 * Returns { valid, normalized?, error? }
 */
export declare function validateFilePath(filePath: string, allowedDirs?: string[]): {
    valid: boolean;
    normalized?: string;
    error?: string;
};
/**
 * Validates a project/document name.
 */
export declare function validateDocumentName(name: string): {
    valid: boolean;
    sanitized?: string;
    error?: string;
};
/**
 * Validates numeric input with optional bounds.
 */
export declare function validateNumber(value: unknown, min?: number, max?: number): {
    valid: boolean;
    value?: number;
    error?: string;
};
/**
 * Validates array input with optional max length.
 */
export declare function validateArray(value: unknown, maxLength?: number): {
    valid: boolean;
    error?: string;
};
/**
 * Validates a color value (hex, rgb, rgba, or named color).
 */
export declare function validateColor(color: string): {
    valid: boolean;
    error?: string;
};
/**
 * Validates an ExtendScript code string — blocks dangerous patterns.
 */
export declare function validateScriptCode(code: string): {
    valid: boolean;
    error?: string;
};
/**
 * Rate limiter to prevent abuse per-identifier.
 */
export declare class RateLimiter {
    private requests;
    private readonly limit;
    private readonly windowMs;
    constructor(limit?: number, windowMs?: number);
    check(identifier: string): boolean;
    private cleanup;
    reset(identifier: string): void;
}
/**
 * Audit logger for security events.
 */
export declare class AuditLogger {
    private logs;
    private readonly maxLogs;
    constructor(maxLogs?: number);
    log(event: string, details?: unknown): void;
    getLogs(count?: number): Array<{
        timestamp: Date;
        event: string;
        details: unknown;
    }>;
    clear(): void;
}
/**
 * Convenience wrapper: returns an error message when the path is unsafe,
 * or null when it passes validation.
 */
export declare function filePathError(filePath: string): string | null;
//# sourceMappingURL=security.d.ts.map