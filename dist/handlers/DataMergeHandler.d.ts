import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class DataMergeHandler implements IHandler {
    readonly name = "dataMerge";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private escape;
    private selectDataSource;
    private listFields;
    private mergeRecords;
    private export;
    private removeDataSource;
}
//# sourceMappingURL=DataMergeHandler.d.ts.map