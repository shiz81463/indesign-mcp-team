import type { IHandler, ToolDefinition } from '../types/index.js';
import type { ScriptExecutor } from '../bridge/ScriptExecutor.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export declare class EffectHandler implements IHandler {
    readonly name = "effect";
    private executor;
    constructor(executor: ScriptExecutor);
    get tools(): ToolDefinition[];
    register(server: McpServer): void;
    private escape;
    private applyDropShadow;
    private applyFeather;
    private applyTransparency;
    private applyGradientFeather;
}
//# sourceMappingURL=EffectHandler.d.ts.map