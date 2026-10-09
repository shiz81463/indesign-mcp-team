import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class ColorHandler implements IHandler {
    readonly name = "color";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private escape;
    private createSwatch;
    private listSwatches;
    private deleteSwatch;
    private createGradient;
    private applyColor;
    private listInks;
}
//# sourceMappingURL=ColorHandler.d.ts.map