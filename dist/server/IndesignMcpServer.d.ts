import type { AppConfig } from '../utils/configLoader.js';
export declare class IndesignMcpServer {
    private mcpServer;
    private executor;
    private sessionManager;
    private changeTracker;
    private bridgeServer;
    private expressBridgeServer;
    private config;
    constructor(config: AppConfig);
    start(): Promise<void>;
    shutdown(): Promise<void>;
}
//# sourceMappingURL=IndesignMcpServer.d.ts.map