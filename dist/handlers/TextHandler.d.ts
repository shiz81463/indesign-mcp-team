import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class TextHandler implements IHandler {
    readonly name = "text";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private escape;
    /** Normalize \n (and \r\n) to ExtendScript's paragraph break \r — InDesign
     *  2026 does NOT create paragraphs from \n in `contents = "..."`. */
    private normalizeParagraphs;
    private addFrame;
    private setContent;
    private getContent;
    private getStories;
    private applyParagraphStyle;
    private findReplace;
    private getTextFrames;
}
//# sourceMappingURL=TextHandler.d.ts.map