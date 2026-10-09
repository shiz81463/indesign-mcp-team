import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class IndexHandler implements IHandler {
    readonly name = "index";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private escape;
    private addEntry;
    private generate;
    private listTopics;
    private createTopic;
}
//# sourceMappingURL=IndexHandler.d.ts.map