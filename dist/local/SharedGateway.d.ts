import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
type Dispatch = <T>(operation: () => Promise<T>) => Promise<T>;
export declare function serialDispatcher(): Dispatch;
export declare function forwardingServer(backend: Client, dispatch: Dispatch): Server;
export declare function startSharedGateway(backend: Client, port: number): Promise<{
    url: string;
    close(): Promise<void>;
}>;
export {};
//# sourceMappingURL=SharedGateway.d.ts.map