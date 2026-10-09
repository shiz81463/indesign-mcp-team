import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class TextAdvancedHandler implements IHandler {
    readonly name = "textAdvanced";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private getFormatting;
    private applyCharStyle;
    private applyFont;
    private textSearch;
    private searchFormatting;
    private escape;
    private linkFrames;
    private unlinkFrames;
    private setColumns;
    private setTextWrap;
    private setDropCap;
    private setKeepOptions;
    private setInsetSpacing;
    private setAutoSize;
    private setVerticalJustification;
    private setFirstBaseline;
    private setIgnoreWrap;
    private setParagraphRuleAbove;
    private setParagraphRuleBelow;
    private setTabs;
    private setHyphenation;
}
//# sourceMappingURL=TextAdvancedHandler.d.ts.map