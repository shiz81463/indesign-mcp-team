import { z } from 'zod';
import { formatResponse } from '../utils/errorHandler.js';
import { withLogging, withErrorHandling, compose } from '../utils/middleware.js';
import { escapeExtendScriptString } from "../utils/stringUtils.js";
export class MasterHandler {
    name = 'master';
    executor;
    constructor(executor) {
        this.executor = executor;
    }
    get tools() {
        return [
            {
                name: 'master_create',
                description: 'Create a new master spread with a given name and page count',
                inputSchema: {
                    name: z.string().min(1),
                    pageCount: z.number().int().min(1).max(10).default(1),
                },
                handler: compose(withLogging('master_create'), withErrorHandling())(this.create.bind(this)),
            },
            {
                name: 'master_duplicate',
                description: 'Duplicate an existing master spread',
                inputSchema: { name: z.string().min(1), newName: z.string().min(1) },
                handler: compose(withLogging('master_duplicate'), withErrorHandling())(this.duplicate.bind(this)),
            },
            {
                name: 'master_apply',
                description: 'Apply a master spread to a specific page',
                inputSchema: {
                    pageIndex: z.number().int().min(0),
                    masterName: z.string().min(1),
                },
                handler: compose(withLogging('master_apply'), withErrorHandling())(this.apply.bind(this)),
            },
            {
                name: 'master_delete',
                description: 'Delete a master spread by name',
                inputSchema: { name: z.string().min(1) },
                handler: compose(withLogging('master_delete'), withErrorHandling())(this.delete.bind(this)),
            },
            {
                name: 'master_list',
                description: 'List all master spreads with page count',
                inputSchema: {},
                handler: compose(withLogging('master_list'), withErrorHandling())(this.list.bind(this)),
            },
            {
                name: 'master_getPages',
                description: 'List all pages on a master spread',
                inputSchema: { name: z.string().min(1) },
                handler: compose(withLogging('master_getPages'), withErrorHandling())(this.getPages.bind(this)),
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
    async create(args, _extra) {
        const params = z.object({ name: z.string(), pageCount: z.number().int().min(1).max(10).default(1) }).parse(args);
        const escName = this.escape(params.name);
        const code = `
      var master = app.activeDocument.masterSpreads.add();
      master.name = "${escName}";
      JSON.stringify({ name: master.name, pageCount: master.pages.length });
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async duplicate(args, _extra) {
        const params = z.object({ name: z.string(), newName: z.string() }).parse(args);
        const escName = this.escape(params.name);
        const escNew = this.escape(params.newName);
        const code = `
      var src = app.activeDocument.masterSpreads.item("${escName}");
      if (!src.isValid) { throw new Error("Master spread '${escName}' not found"); }
      var dup = src.duplicate();
      dup.name = "${escNew}";
      JSON.stringify({ name: dup.name, pageCount: dup.pages.length });
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async apply(args, _extra) {
        const params = z.object({ pageIndex: z.number().int().min(0), masterName: z.string() }).parse(args);
        const escName = this.escape(params.masterName);
        const code = `
      var master = app.activeDocument.masterSpreads.item("${escName}");
      if (!master.isValid) { throw new Error("Master spread '${escName}' not found"); }
      app.activeDocument.pages[${params.pageIndex}].appliedMaster = master;
      "applied";
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async delete(args, _extra) {
        const params = z.object({ name: z.string() }).parse(args);
        const escName = this.escape(params.name);
        const code = `
      var master = app.activeDocument.masterSpreads.item("${escName}");
      if (!master.isValid) { throw new Error("Master spread '${escName}' not found"); }
      master.remove();
      "deleted";
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async list(_args, _extra) {
        const code = `
      var masters = app.activeDocument.masterSpreads;
      var result = [];
      for (var i = 0; i < masters.length; i++) {
        var m = masters[i];
        result.push({ name: m.name, pageCount: m.pages.length });
      }
      JSON.stringify(result);
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async getPages(args, _extra) {
        const params = z.object({ name: z.string() }).parse(args);
        const escName = this.escape(params.name);
        const code = `
      var master = app.activeDocument.masterSpreads.item("${escName}");
      if (!master.isValid) { throw new Error("Master spread '${escName}' not found"); }
      var result = [];
      for (var i = 0; i < master.pages.length; i++) {
        var p = master.pages[i];
        result.push({
          index: i,
          name: p.name,
          bounds: [p.bounds[0], p.bounds[1], p.bounds[2], p.bounds[3]]
        });
      }
      JSON.stringify(result);
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
}
//# sourceMappingURL=MasterHandler.js.map