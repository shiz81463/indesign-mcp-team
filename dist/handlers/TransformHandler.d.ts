import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class TransformHandler implements IHandler {
    readonly name = "transform";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private align;
    private distribute;
    private rotate;
    private scale;
    private flip;
}
//# sourceMappingURL=TransformHandler.d.ts.map