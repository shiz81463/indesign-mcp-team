import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class GrepHandler implements IHandler {
    readonly name = "grep";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private escape;
    private grepFind;
    private grepReplace;
    private findFormat;
    private replaceFormat;
}
//# sourceMappingURL=GrepHandler.d.ts.map