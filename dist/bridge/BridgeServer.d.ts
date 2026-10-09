import { EventEmitter } from 'events';
import type { BridgeStatus } from '../types/index.js';
import { ScriptExecutor } from './ScriptExecutor.js';
export interface BridgeServerOptions {
    port: number;
    host: string;
    maxPayload: number;
    timeout: number;
    healthCheckIntervalMs?: number;
    staleTimeoutMs?: number;
}
export declare class BridgeServer {
    private wss;
    private httpServer;
    private executor;
    private options;
    private connections;
    private healthCheckTimer;
    private lastActivity;
    private _connected;
    /** Unsolicited plugin-pushed events, e.g. 'document_changed' */
    readonly events: EventEmitter;
    constructor(options: BridgeServerOptions, executor: ScriptExecutor);
    /** Whether at least one WebSocket connection is open */
    get connected(): boolean;
    start(): Promise<void>;
    stop(): Promise<void>;
    getStatus(): BridgeStatus;
    /** Number of active WebSocket connections */
    get connectionCount(): number;
    private startHealthChecks;
    private stopHealthChecks;
    private runHealthCheck;
    private broadcast;
}
//# sourceMappingURL=BridgeServer.d.ts.map