/**
 * Response chunker for large InDesign results.
 *
 * Inspired by Blender MCP's response chunking pattern.
 * InDesign documents can have hundreds of pages, thousands of items.
 * Without chunking, JSON responses exceed MCP message size limits.
 */
import type { ToolResult } from '../types/index.js';
export interface ChunkerOptions {
    maxChunkSize?: number;
    maxItemsPerPage?: number;
}
/**
 * Splits a large array into pages of manageable size.
 * Useful for handlers returning page lists, item collections, etc.
 */
export declare function paginateArray<T>(items: T[], options?: ChunkerOptions): {
    page: number;
    total: number;
    pageSize: number;
    data: T[];
}[];
/**
 * Chunks a large JSON-serializable value into multiple ToolResult entries.
 * If the value is an array with > maxItemsPerPage items, paginates it.
 * If the serialized string exceeds maxChunkSize, splits it into parts.
 */
export declare function chunkResponse(data: unknown, options?: ChunkerOptions): ToolResult;
/**
 * Creates a success ToolResult with optional chunking.
 *
 * When data is a large array, paginates the inner array directly so each
 * chunk carries the full { ok, data, _chunk } envelope.
 */
export declare function okResponse(data: unknown, options?: ChunkerOptions): ToolResult;
/**
 * Creates an error ToolResult.
 */
export declare function errorResponse(message: string): ToolResult;
//# sourceMappingURL=responseChunker.d.ts.map