import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class ExportHandler implements IHandler {
    readonly name = "export";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private escape;
    private export;
    private batchFolder;
    private preflight;
    private getSwatches;
    private getFonts;
    private getMasterSpreads;
    private getTables;
    private getXmlTags;
    private executeCode;
    private scriptRun;
}
//# sourceMappingURL=ExportHandler.d.ts.map