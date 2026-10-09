import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class TableHandler implements IHandler {
    readonly name = "table";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private escape;
    private scope;
    private create;
    private list;
    private addRow;
    private addColumn;
    private deleteRow;
    private deleteColumn;
    private setCell;
    private getInfo;
    private mergeCells;
    private splitCell;
    private setCellFill;
    private setCellStroke;
    private setCellInset;
    private setCellAlignment;
    private setHeaderFooter;
    private setRowColumnSize;
}
//# sourceMappingURL=TableHandler.d.ts.map