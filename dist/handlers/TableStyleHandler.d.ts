import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class TableStyleHandler implements IHandler {
    readonly name = "tableStyle";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private escape;
    private createTableStyle;
    private listTableStyles;
    private createCellStyle;
    private listCellStyles;
}
//# sourceMappingURL=TableStyleHandler.d.ts.map