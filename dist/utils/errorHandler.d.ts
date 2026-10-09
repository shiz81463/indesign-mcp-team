import type { ToolResult } from '../types/index.js';
export declare class InDesignError extends Error {
    readonly code: string;
    readonly originalError?: unknown;
    constructor(message: string, code?: string, originalError?: unknown);
}
export declare function formatResponse(data: unknown): ToolResult;
export declare function formatErrorResponse(error: Error | string): ToolResult;
//# sourceMappingURL=errorHandler.d.ts.map