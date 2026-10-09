import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class NoteHandler implements IHandler {
    readonly name = "note";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private escape;
    private addFootnote;
    private listFootnotes;
    private footnoteOptions;
    private addEndnote;
}
//# sourceMappingURL=NoteHandler.d.ts.map