import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class ResourcesHandler implements IHandler {
    readonly name = "resources";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private escape;
    private listLinks;
    private updateLink;
    private updateAllLinks;
    private embedLink;
    private unembedLink;
    private getLinkInfo;
}
//# sourceMappingURL=ResourcesHandler.d.ts.map