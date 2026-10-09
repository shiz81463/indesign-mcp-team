import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class ImageHandler implements IHandler {
    readonly name = "image";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private escape;
    private placeImage;
    private adjustImage;
    private fitImage;
    private relinkImage;
    private imageInfo;
}
//# sourceMappingURL=ImageHandler.d.ts.map