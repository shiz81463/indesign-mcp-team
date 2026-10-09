import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ChangeTracker } from '../core/ChangeTracker.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class ChangesHandler implements IHandler {
    private readonly tracker;
    readonly name = "changes";
    constructor(tracker: ChangeTracker);
    register(server: McpServer): void;
    get tools(): ToolDefinition[];
    private getStatus;
}
//# sourceMappingURL=ChangesHandler.d.ts.map