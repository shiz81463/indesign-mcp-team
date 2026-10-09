import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class BookHandler implements IHandler {
    readonly name = "book";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private escape;
    private list;
    private open;
    private getDocuments;
    private synchronize;
}
//# sourceMappingURL=BookHandler.d.ts.map