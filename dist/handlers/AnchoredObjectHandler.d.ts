import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class AnchoredObjectHandler implements IHandler {
    readonly name = "anchoredObject";
    private executor;
    constructor(executor: ScriptExecutor);
    private escape;
    private anchoredPositionMap;
    private anchorPointMap;
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private create;
    private setPosition;
    private release;
    private getSettings;
    private setProperties;
}
//# sourceMappingURL=AnchoredObjectHandler.d.ts.map