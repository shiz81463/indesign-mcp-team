import { ScriptExecutor } from './ScriptExecutor.js';
import type { BridgeResponse, BridgeStatus } from '../types/index.js';
/**
 * Windows backend: drives InDesign via COM automation (cscript + VBScript
 * DoScript) instead of the UXP WebSocket plugin. Opt-in through config; the
 * default macOS-friendly UXP path is untouched. Requests are executed FIFO by
 * one persistent cscript process, so stdout lines map 1:1 to submissions.
 */
export declare class ComScriptExecutor extends ScriptExecutor {
    private proc?;
    private buffer;
    private queue;
    private vbsPath;
    private readonly timeoutMs;
    constructor(defaultTimeout?: number, options?: {
        cscriptPath?: string;
        vbsPath?: string;
    });
    private cscriptPath;
    private ensureProcess;
    execute(code: string, timeout?: number, debug?: boolean): Promise<BridgeResponse>;
    getStatus(): BridgeStatus;
    stop(): Promise<void>;
    private onStdout;
    private settle;
    private removePending;
    private failAllPending;
}
//# sourceMappingURL=ComScriptExecutor.d.ts.map