export class InDesignError extends Error {
    code;
    originalError;
    constructor(message, code = 'INDESIGN_ERROR', originalError) {
        super(message);
        this.name = 'InDesignError';
        this.code = code;
        this.originalError = originalError;
    }
}
function parseResult(raw) {
    if (typeof raw === 'string') {
        try {
            return JSON.parse(raw);
        }
        catch {
            return raw;
        }
    }
    return raw;
}
function isExtendScriptError(obj) {
    return (typeof obj === 'object' &&
        obj !== null &&
        obj.__extendscript_error === true);
}
export function formatResponse(data) {
    const parsed = parseResult(data);
    if (isExtendScriptError(parsed)) {
        const parts = [`ExtendScript error: ${parsed.message}`, `Line: ${parsed.line}`];
        if (parsed.fileName)
            parts.push(`File: ${parsed.fileName}`);
        if (parsed.stack)
            parts.push(`Stack:\n${parsed.stack}`);
        return {
            content: [{ type: 'text', text: parts.join('\n') }],
            isError: true,
        };
    }
    return {
        content: [{ type: 'text', text: JSON.stringify(parsed ?? 'ok') }],
    };
}
export function formatErrorResponse(error) {
    const message = error instanceof Error ? error.message : error;
    return {
        content: [{ type: 'text', text: message }],
        isError: true,
    };
}
//# sourceMappingURL=errorHandler.js.map