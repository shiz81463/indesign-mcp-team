import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class UndoHandler implements IHandler {
    readonly name = "undo";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private undo;
    private redo;
    private undoHistory;
    private beginUndoGroup;
    private endUndoGroup;
}
//# sourceMappingURL=UndoHandler.d.ts.map