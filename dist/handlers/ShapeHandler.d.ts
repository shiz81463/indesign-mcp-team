import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class ShapeHandler implements IHandler {
    readonly name = "shape";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private escape;
    private createRectangle;
    private createEllipse;
    private createPolygon;
    private createLine;
    private modifyShape;
    private deleteShape;
}
//# sourceMappingURL=ShapeHandler.d.ts.map