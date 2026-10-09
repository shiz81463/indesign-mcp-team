import { z } from 'zod';
import { formatResponse } from '../utils/errorHandler.js';
import { withLogging, withErrorHandling, compose } from '../utils/middleware.js';
import { escapeExtendScriptString } from "../utils/stringUtils.js";
export class InteractiveHandler {
    name = 'interactive';
    executor;
    constructor(executor) {
        this.executor = executor;
    }
    get tools() {
        return [
            {
                name: 'interactive_listHyperlinks',
                description: 'List all hyperlinks in the active document',
                inputSchema: {},
                handler: compose(withLogging('interactive_listHyperlinks'), withErrorHandling())(this.listHyperlinks.bind(this)),
            },
            {
                name: 'interactive_addHyperlink',
                description: 'Add a hyperlink to a text selection or page item',
                inputSchema: {
                    name: z.string().min(1),
                    url: z.string().url(),
                    pageIndex: z.number().int().min(0),
                    itemIndex: z.number().int().min(0),
                },
                handler: compose(withLogging('interactive_addHyperlink'), withErrorHandling())(this.addHyperlink.bind(this)),
            },
            {
                name: 'interactive_deleteHyperlink',
                description: 'Delete a hyperlink by index',
                inputSchema: { index: z.number().int().min(0) },
                handler: compose(withLogging('interactive_deleteHyperlink'), withErrorHandling())(this.deleteHyperlink.bind(this)),
            },
            {
                name: 'interactive_listButtons',
                description: 'List all buttons in the active document',
                inputSchema: {},
                handler: compose(withLogging('interactive_listButtons'), withErrorHandling())(this.listButtons.bind(this)),
            },
            {
                name: 'interactive_listAnchors',
                description: 'List all cross-reference anchors in the active document',
                inputSchema: {},
                handler: compose(withLogging('interactive_listAnchors'), withErrorHandling())(this.listAnchors.bind(this)),
            },
        ];
    }
    register(server) {
        for (const tool of this.tools) {
            server.tool(tool.name, tool.description, tool.inputSchema, tool.handler);
        }
    }
    escape(str) {
        return escapeExtendScriptString(str);
    }
    async listHyperlinks(_args, _extra) {
        const code = `
      var result = [];
      var hyperlinks = app.activeDocument.hyperlinks;
      for (var i = 0; i < hyperlinks.length; i++) {
        var h = hyperlinks[i];
        result.push({
          index: i,
          name: h.name,
          url: h.destination ? h.destination.destinationURL : ''
        });
      }
      JSON.stringify(result);
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async addHyperlink(args, _extra) {
        const params = z.object({
            name: z.string(),
            url: z.string(),
            pageIndex: z.number().int().min(0),
            itemIndex: z.number().int().min(0),
        }).parse(args);
        const escName = this.escape(params.name);
        const escUrl = this.escape(params.url);
        const code = `
      var dest = app.activeDocument.hyperlinkURLDestinations.add("${escUrl}");
      var src = app.activeDocument.pages[${params.pageIndex}].pageItems[${params.itemIndex}];
      var link = app.activeDocument.hyperlinks.add(src, dest, "${escName}");
      JSON.stringify({ name: link.name, url: "${escUrl}" });
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async deleteHyperlink(args, _extra) {
        const params = z.object({ index: z.number().int().min(0) }).parse(args);
        const code = `
      var link = app.activeDocument.hyperlinks[${params.index}];
      if (!link.isValid) { throw new Error("Hyperlink not found"); }
      link.remove();
      "deleted";
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async listButtons(_args, _extra) {
        const code = `
      var result = [];
      var buttons = app.activeDocument.buttons;
      for (var i = 0; i < buttons.length; i++) {
        var b = buttons[i];
        result.push({ index: i, name: b.name, id: b.id, visible: b.visible });
      }
      JSON.stringify(result);
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async listAnchors(_args, _extra) {
        const code = `
      var result = [];
      var anchors = app.activeDocument.crossReferenceSources;
      for (var i = 0; i < anchors.length; i++) {
        var a = anchors[i];
        result.push({ index: i, name: a.name });
      }
      JSON.stringify(result);
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
}
//# sourceMappingURL=InteractiveHandler.js.map