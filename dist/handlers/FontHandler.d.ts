import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class FontHandler implements IHandler {
    readonly name = "font";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private escape;
    private listFonts;
    private findFonts;
    private changeFont;
    private insertGlyph;
    private checkMissingFonts;
}
//# sourceMappingURL=FontHandler.d.ts.map