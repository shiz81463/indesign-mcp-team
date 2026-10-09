import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class LayerHandler implements IHandler {
    readonly name = "layer";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private escape;
    private createLayer;
    private listLayers;
    private reorderLayer;
    private setLayerProperties;
    private deleteLayer;
}
//# sourceMappingURL=LayerHandler.d.ts.map