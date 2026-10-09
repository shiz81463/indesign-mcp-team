import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class TocHandler implements IHandler {
    readonly name = "toc";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private escape;
    private createStyle;
    private generate;
    private listStyles;
    private update;
}
//# sourceMappingURL=TocHandler.d.ts.map