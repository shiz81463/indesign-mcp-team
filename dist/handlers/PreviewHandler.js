import { z } from 'zod';
import { readFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { withLogging, withErrorHandling, compose } from '../utils/middleware.js';
export const defaultPreviewIo = {
    readFile: (path) => readFileSync(path),
    unlink: (path) => {
        try {
            unlinkSync(path);
        }
        catch {
            // best effort
        }
    },
    makeTempPath: (ext) => join(tmpdir(), `indesign-preview-${randomUUID()}.${ext}`),
};
const previewParams = z.object({
    pageIndex: z.number().int().min(0).default(0),
    format: z.enum(['png', 'jpeg']).default('png'),
    resolutionPpi: z.number().int().min(72).max(600).default(150),
});
/**
 * Renders a page to an image and returns it as an MCP image content block so
 * agents can see their work. The ExtendScript side only exports to a temp
 * path chosen by Node; reading bytes happens here (bridge and InDesign share
 * a filesystem), which avoids implementing base64 inside ExtendScript.
 */
export class PreviewHandler {
    name = 'preview';
    executor;
    io;
    constructor(executor, io = defaultPreviewIo) {
        this.executor = executor;
        this.io = io;
    }
    register(server) {
        for (const tool of this.tools) {
            server.tool(tool.name, tool.description, tool.inputSchema, tool.handler);
        }
    }
    get tools() {
        return [
            {
                name: 'preview_document',
                description: 'Render a page of the active document as an image (PNG or JPEG) so you can visually inspect layout, colors and typography',
                inputSchema: {
                    pageIndex: previewParams.shape.pageIndex,
                    format: previewParams.shape.format,
                    resolutionPpi: previewParams.shape.resolutionPpi,
                },
                handler: compose(withLogging('preview_document'), withErrorHandling())(this.preview.bind(this)),
            },
        ];
    }
    async preview(args) {
        const params = previewParams.parse(args);
        const isJpeg = params.format === 'jpeg';
        const tempPath = this.io.makeTempPath(isJpeg ? 'jpg' : 'png');
        const mimeType = isJpeg ? 'image/jpeg' : 'image/png';
        const prefLine = isJpeg
            ? `app.jpegExportPreferences.exportResolution = ${params.resolutionPpi};`
            : `app.pngExportPreferences.exportResolution = ${params.resolutionPpi};`;
        // InDesign 2026 DOM: Page has no exportFile — export the DOCUMENT with a
        // pageString taken from the target page's own name (section-aware).
        const code = `
      var __doc = app.activeDocument;
      var __page = __doc.pages[${params.pageIndex}];
      ${prefLine}
      app.${isJpeg ? 'jpeg' : 'png'}ExportPreferences.pageString = __page.name;
      __doc.exportFile(ExportFormat.${isJpeg ? 'JPEG_FORMAT' : 'PNG_FORMAT'}, File(${JSON.stringify(tempPath)}));
      'ok';
    `;
        try {
            await this.executor.execute(code);
            const bytes = this.io.readFile(tempPath);
            return {
                content: [
                    { type: 'image', data: bytes.toString('base64'), mimeType },
                ],
            };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return {
                content: [{ type: 'text', text: `preview failed: ${message}` }],
                isError: true,
            };
        }
        finally {
            this.io.unlink(tempPath);
        }
    }
}
//# sourceMappingURL=PreviewHandler.js.map