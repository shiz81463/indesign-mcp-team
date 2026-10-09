export interface WrapOptions {
    debug?: boolean;
    undoGroupActive?: boolean;
}
/**
 * Shared ExtendScript wrapping used by every executor backend (UXP WebSocket,
 * Windows COM). Produces the full script string: JSON polyfill + DOM shims +
 * optional debug/error-report wrapper + undo-mode preferences, all sanitized.
 */
export declare function wrapExtendScript(code: string, options?: WrapOptions): string;
//# sourceMappingURL=wrapExtendScript.d.ts.map