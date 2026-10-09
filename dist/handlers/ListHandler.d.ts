import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class ListHandler implements IHandler {
    readonly name = "list";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private escape;
    private define;
    private applyToParagraph;
    private applyToSelection;
    private removeFromParagraph;
    private list;
    private restartNumbering;
}
//# sourceMappingURL=ListHandler.d.ts.map