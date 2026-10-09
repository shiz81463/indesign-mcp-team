import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class PageHandler implements IHandler {
    readonly name = "page";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private add;
    private delete;
    private duplicate;
    private move;
    private getInfo;
    private listAll;
    private applyMaster;
}
//# sourceMappingURL=PageHandler.d.ts.map