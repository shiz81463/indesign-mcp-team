import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class InteractiveHandler implements IHandler {
    readonly name = "interactive";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private escape;
    private listHyperlinks;
    private addHyperlink;
    private deleteHyperlink;
    private listButtons;
    private listAnchors;
}
//# sourceMappingURL=InteractiveHandler.d.ts.map