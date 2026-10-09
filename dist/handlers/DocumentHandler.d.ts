import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SessionManager } from '../core/SessionManager.js';
export declare class DocumentHandler implements IHandler {
    readonly name = "document";
    private executor;
    private sessionManager;
    private sessionId;
    constructor(executor: ScriptExecutor, sessionManager?: SessionManager);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private trackDocInfo;
    private create;
    private open;
    private save;
    private close;
    private getInfo;
    private listOpen;
    private getPageStories;
    private getStoryPages;
}
//# sourceMappingURL=DocumentHandler.d.ts.map