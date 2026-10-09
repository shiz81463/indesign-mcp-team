import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export interface PreviewIo {
    readFile: (path: string) => Buffer;
    unlink: (path: string) => void;
    makeTempPath: (ext: string) => string;
}
export declare const defaultPreviewIo: PreviewIo;
/**
 * Renders a page to an image and returns it as an MCP image content block so
 * agents can see their work. The ExtendScript side only exports to a temp
 * path chosen by Node; reading bytes happens here (bridge and InDesign share
 * a filesystem), which avoids implementing base64 inside ExtendScript.
 */
export declare class PreviewHandler implements IHandler {
    readonly name = "preview";
    private executor;
    private io;
    constructor(executor: ScriptExecutor, io?: PreviewIo);
    register(server: McpServer): void;
    get tools(): ToolDefinition[];
    private preview;
}
//# sourceMappingURL=PreviewHandler.d.ts.map