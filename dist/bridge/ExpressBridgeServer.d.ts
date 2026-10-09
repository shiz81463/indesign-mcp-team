import type { ScriptExecutor } from './ScriptExecutor.js';
export interface ExpressBridgeOptions {
    port: number;
    host: string;
    token: string;
}
export declare class ExpressBridgeServer {
    private app;
    private httpServer;
    private executor;
    private options;
    constructor(options: ExpressBridgeOptions, executor: ScriptExecutor);
    start(): Promise<void>;
    stop(): Promise<void>;
}
//# sourceMappingURL=ExpressBridgeServer.d.ts.map