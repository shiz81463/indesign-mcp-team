import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class XmlHandler implements IHandler {
    readonly name = "xml";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private escape;
    private listTags;
    private addTag;
    private deleteTag;
    private tagPageItem;
    private exportXml;
    private importXml;
}
//# sourceMappingURL=XmlHandler.d.ts.map