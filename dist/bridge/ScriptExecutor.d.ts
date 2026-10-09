import { EventEmitter } from 'events';
import type { BridgeResponse, BridgeStatus } from '../types/index.js';
export declare class ScriptExecutor extends EventEmitter {
    private pending;
    private defaultTimeout;
    private _undoGroupActive;
    private _connected;
    constructor(defaultTimeout?: number);
    /**
     * Called by the BridgeServer when a plugin client connects or disconnects.
     * Connection state is independent from the pending request queue.
     */
    setConnected(connected: boolean): void;
    get undoGroupActive(): boolean;
    startUndoGroup(): void;
    endUndoGroup(): void;
    execute(code: string, timeout?: number, debug?: boolean): Promise<BridgeResponse>;
    handleResponse(response: BridgeResponse): void;
    getStatus(): BridgeStatus;
    cancelAll(): void;
}
//# sourceMappingURL=ScriptExecutor.d.ts.map