import { z } from 'zod';
import { formatResponse } from '../utils/errorHandler.js';
import { withLogging, withErrorHandling, compose } from '../utils/middleware.js';
import { escapeExtendScriptString } from "../utils/stringUtils.js";
export class ObjectHandler {
    name = 'object';
    executor;
    constructor(executor) {
        this.executor = executor;
    }
    get tools() {
        return [
            // Image tools (non-overlapping — kept for backward compat)
            {
                name: 'image_list',
                description: 'List all placed images in a page',
                inputSchema: { pageIndex: z.number().int().min(0) },
                handler: compose(withLogging('image_list'), withErrorHandling())(this.listImages.bind(this)),
            },
            {
                name: 'image_getLinks',
                description: 'Get link status for all placed images',
                inputSchema: {},
                handler: compose(withLogging('image_getLinks'), withErrorHandling())(this.getImageLinks.bind(this)),
            },
            // Shape tools
            {
                name: 'shape_create',
                description: 'Create a geometric shape (rectangle, ellipse, polygon, line)',
                inputSchema: {
                    pageIndex: z.number().int().min(0),
                    type: z.enum(['rectangle', 'ellipse', 'polygon', 'line']),
                    bounds: z.object({ top: z.number(), left: z.number(), bottom: z.number(), right: z.number() }),
                    fillColor: z.string().optional(),
                    strokeColor: z.string().optional(),
                    strokeWeight: z.number().min(0).default(1),
                    layerIndex: z.number().int().min(0).optional(),
                },
                handler: compose(withLogging('shape_create'), withErrorHandling())(this.createShape.bind(this)),
            },
            {
                name: 'shape_list',
                description: 'List all shapes on a page',
                inputSchema: { pageIndex: z.number().int().min(0) },
                handler: compose(withLogging('shape_list'), withErrorHandling())(this.listShapes.bind(this)),
            },
            // Group tools
            {
                name: 'group_list',
                description: 'List all groups in a page',
                inputSchema: { pageIndex: z.number().int().min(0) },
                handler: compose(withLogging('group_list'), withErrorHandling())(this.listGroups.bind(this)),
            },
            {
                name: 'group_ungroup',
                description: 'Ungroup a group by index',
                inputSchema: { pageIndex: z.number().int().min(0), groupIndex: z.number().int().min(0) },
                handler: compose(withLogging('group_ungroup'), withErrorHandling())(this.ungroup.bind(this)),
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
    // Image methods
    async listImages(args, _extra) {
        const params = z.object({ pageIndex: z.number().int().min(0) }).parse(args);
        const code = `
      var page = app.activeDocument.pages[${params.pageIndex}];
      var allImages = page.allGraphics;
      var result = [];
      for (var i = 0; i < allImages.length; i++) {
        var img = allImages[i];
        var link = img.imageLink;
        result.push({
          index: i,
          filePath: link ? link.filePath : 'embedded',
          linkStatus: link ? link.status : 'embedded',
          bounds: img.geometricBounds
        });
      }
      JSON.stringify(result);
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async getImageLinks(_args, _extra) {
        const code = `
      var allLinks = app.activeDocument.links;
      var result = [];
      for (var i = 0; i < allLinks.length; i++) {
        result.push({
          filePath: allLinks[i].filePath,
          status: allLinks[i].status,
          embedded: allLinks[i].embedded
        });
      }
      JSON.stringify(result);
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    // Shape methods
    async createShape(args, _extra) {
        const params = z.object({
            pageIndex: z.number().int().min(0),
            type: z.enum(['rectangle', 'ellipse', 'polygon', 'line']),
            bounds: z.object({ top: z.number(), left: z.number(), bottom: z.number(), right: z.number() }),
            fillColor: z.string().optional(),
            strokeColor: z.string().optional(),
            strokeWeight: z.number().min(0).default(1),
            layerIndex: z.number().int().min(0).optional(),
        }).parse(args);
        const { top, left, bottom, right } = params.bounds;
        const shapeMap = {
            rectangle: 'rectangles.add()',
            ellipse: 'ovals.add()',
            polygon: 'polygons.add()',
            line: 'graphicLines.add()',
        };
        const fillStr = params.fillColor ? `shape.fillColor = app.activeDocument.colors.item("${this.escape(params.fillColor)}");` : '';
        const strokeStr = params.strokeColor ? `shape.strokeColor = app.activeDocument.colors.item("${this.escape(params.strokeColor)}");` : '';
        const code = `
      var shape = app.activeDocument.pages[${params.pageIndex}].${shapeMap[params.type]};
      shape.geometricBounds = [${top}, ${left}, ${bottom}, ${right}];
      shape.strokeWeight = ${params.strokeWeight};
      ${fillStr}
      ${strokeStr}
      JSON.stringify({ index: shape.index, type: "${params.type}", bounds: shape.geometricBounds });
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async listShapes(args, _extra) {
        const params = z.object({ pageIndex: z.number().int().min(0) }).parse(args);
        const code = `
      var page = app.activeDocument.pages[${params.pageIndex}];
      var result = [];
      var items = page.allPageItems;
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var itemType = 'unknown';
        if (item.constructor.name === 'Rectangle') itemType = 'rectangle';
        else if (item.constructor.name === 'Oval') itemType = 'ellipse';
        else if (item.constructor.name === 'Polygon') itemType = 'polygon';
        else if (item.constructor.name === 'GraphicLine') itemType = 'line';
        else if (item.constructor.name === 'TextFrame') continue;
        else if (item.constructor.name === 'Group') continue;
        result.push({
          index: i,
          type: itemType,
          bounds: item.geometricBounds,
          strokeWeight: item.strokeWeight
        });
      }
      JSON.stringify(result);
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    // Group methods
    async listGroups(args, _extra) {
        const params = z.object({ pageIndex: z.number().int().min(0) }).parse(args);
        const code = `
      var page = app.activeDocument.pages[${params.pageIndex}];
      var result = [];
      for (var i = 0; i < page.groups.length; i++) {
        result.push({
          index: i,
          name: page.groups[i].name,
          bounds: page.groups[i].geometricBounds
        });
      }
      JSON.stringify(result);
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async ungroup(args, _extra) {
        const params = z.object({ pageIndex: z.number().int().min(0), groupIndex: z.number().int().min(0) }).parse(args);
        const code = `app.activeDocument.pages[${params.pageIndex}].groups[${params.groupIndex}].ungroup(); "ungrouped"`;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
}
//# sourceMappingURL=ObjectHandler.js.map