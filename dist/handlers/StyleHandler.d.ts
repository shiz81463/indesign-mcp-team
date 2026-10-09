import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class StyleHandler implements IHandler {
    readonly name = "style";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private escape;
    private listParagraph;
    private listCharacter;
    private listObject;
    private createParagraph;
    private createCharacter;
    private duplicate;
    private delete;
}
//# sourceMappingURL=StyleHandler.d.ts.map