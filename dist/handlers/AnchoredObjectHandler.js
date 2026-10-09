import { z } from 'zod';
import { formatResponse } from '../utils/errorHandler.js';
import { withLogging, withErrorHandling, compose } from '../utils/middleware.js';
import { escapeExtendScriptString } from "../utils/stringUtils.js";
export class AnchoredObjectHandler {
    name = 'anchoredObject';
    executor;
    constructor(executor) {
        this.executor = executor;
    }
    escape(str) {
        return escapeExtendScriptString(str);
    }
    anchoredPositionMap = {
        inline: 'AnchorPosition.INLINE_POSITION',
        aboveLine: 'AnchorPosition.ABOVE_LINE',
        custom: 'AnchorPosition.ANCHORED',
    };
    anchorPointMap = {
        topLeft: "__ANCHOR_POINT('TOP_LEFT')",
        topCenter: "__ANCHOR_POINT('TOP_CENTER')",
        topRight: "__ANCHOR_POINT('TOP_RIGHT')",
        leftCenter: "__ANCHOR_POINT('LEFT_CENTER')",
        center: "__ANCHOR_POINT('CENTER')",
        rightCenter: "__ANCHOR_POINT('RIGHT_CENTER')",
        bottomLeft: "__ANCHOR_POINT('BOTTOM_LEFT')",
        bottomCenter: "__ANCHOR_POINT('BOTTOM_CENTER')",
        bottomRight: "__ANCHOR_POINT('BOTTOM_RIGHT')",
    };
    get tools() {
        return [
            {
                name: 'anchoredObject_create',
                description: 'Create an anchored object at an insertion point or attach to a text frame',
                inputSchema: {
                    storyIndex: z.number().int().min(0),
                    insertionIndex: z.number().int().min(0),
                    contentType: z.enum(['textFrame', 'rectangle', 'oval']),
                    width: z.number().min(0),
                    height: z.number().min(0),
                    anchoredPosition: z.enum(['inline', 'aboveLine', 'custom']).optional().default('custom'),
                    anchorPoint: z.enum(['topLeft', 'topCenter', 'topRight', 'leftCenter', 'center', 'rightCenter', 'bottomLeft', 'bottomCenter', 'bottomRight']).optional().default('topLeft'),
                    xOffset: z.number().optional().default(0),
                    yOffset: z.number().optional().default(0),
                    spaceAbove: z.number().min(0).optional().default(0),
                },
                handler: compose(withLogging('anchoredObject_create'), withErrorHandling())(this.create.bind(this)),
            },
            {
                name: 'anchoredObject_setPosition',
                description: 'Reposition an anchored object',
                inputSchema: {
                    pageIndex: z.number().int().min(0),
                    itemIndex: z.number().int().min(0),
                    anchoredPosition: z.enum(['inline', 'aboveLine', 'custom']).optional(),
                    anchorPoint: z.enum(['topLeft', 'topCenter', 'topRight', 'leftCenter', 'center', 'rightCenter', 'bottomLeft', 'bottomCenter', 'bottomRight']).optional(),
                    xOffset: z.number().optional(),
                    yOffset: z.number().optional(),
                    spaceAbove: z.number().min(0).optional(),
                },
                handler: compose(withLogging('anchoredObject_setPosition'), withErrorHandling())(this.setPosition.bind(this)),
            },
            {
                name: 'anchoredObject_release',
                description: 'Release anchored object to regular page item',
                inputSchema: {
                    pageIndex: z.number().int().min(0),
                    itemIndex: z.number().int().min(0),
                },
                handler: compose(withLogging('anchoredObject_release'), withErrorHandling())(this.release.bind(this)),
            },
            {
                name: 'anchoredObject_getSettings',
                description: 'Get anchored object settings',
                inputSchema: {
                    pageIndex: z.number().int().min(0),
                    itemIndex: z.number().int().min(0),
                },
                handler: compose(withLogging('anchoredObject_getSettings'), withErrorHandling())(this.getSettings.bind(this)),
            },
            {
                name: 'anchoredObject_setProperties',
                description: 'Set multiple anchored object properties',
                inputSchema: {
                    pageIndex: z.number().int().min(0),
                    itemIndex: z.number().int().min(0),
                    properties: z.record(z.string(), z.unknown()),
                },
                handler: compose(withLogging('anchoredObject_setProperties'), withErrorHandling())(this.setProperties.bind(this)),
            },
        ];
    }
    register(server) {
        for (const tool of this.tools) {
            server.tool(tool.name, tool.description, tool.inputSchema, tool.handler);
        }
    }
    async create(args, _extra) {
        const params = z.object({
            storyIndex: z.number().int().min(0),
            insertionIndex: z.number().int().min(0),
            contentType: z.enum(['textFrame', 'rectangle', 'oval']),
            width: z.number().min(0),
            height: z.number().min(0),
            anchoredPosition: z.enum(['inline', 'aboveLine', 'custom']).optional().default('custom'),
            anchorPoint: z.enum(['topLeft', 'topCenter', 'topRight', 'leftCenter', 'center', 'rightCenter', 'bottomLeft', 'bottomCenter', 'bottomRight']).optional().default('topLeft'),
            xOffset: z.number().optional().default(0),
            yOffset: z.number().optional().default(0),
            spaceAbove: z.number().min(0).optional().default(0),
        }).parse(args);
        const pos = this.anchoredPositionMap[params.anchoredPosition];
        const pt = this.anchorPointMap[params.anchorPoint];
        const contentType = params.contentType;
        const code = `
      var doc = app.activeDocument;
      var ip = doc.stories[${params.storyIndex}].insertionPoints[${params.insertionIndex}];
      var newItem;
      if ("${contentType}" === "textFrame") {
        newItem = ip.textFrames.add({geometricBounds: [0, 0, ${params.height}, ${params.width}]});
      } else if ("${contentType}" === "rectangle") {
        newItem = ip.rectangles.add({geometricBounds: [0, 0, ${params.height}, ${params.width}]});
      } else if ("${contentType}" === "oval") {
        newItem = ip.ovals.add({geometricBounds: [0, 0, ${params.height}, ${params.width}]});
      }
      var aos = newItem.anchoredObjectSettings;
      aos.anchoredPosition = ${pos};
      aos.anchorPoint = ${pt};
      aos.anchorXoffset = ${params.xOffset};
      aos.anchorYoffset = ${params.yOffset};
      aos.anchorSpaceAbove = ${params.spaceAbove};
      JSON.stringify({
        anchoredObject: "created",
        contentType: "${contentType}",
        storyIndex: ${params.storyIndex},
        insertionIndex: ${params.insertionIndex},
        anchoredPosition: "${params.anchoredPosition}",
        anchorPoint: "${params.anchorPoint}"
      });
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async setPosition(args, _extra) {
        const params = z.object({
            pageIndex: z.number().int().min(0),
            itemIndex: z.number().int().min(0),
            anchoredPosition: z.enum(['inline', 'aboveLine', 'custom']).optional(),
            anchorPoint: z.enum(['topLeft', 'topCenter', 'topRight', 'leftCenter', 'center', 'rightCenter', 'bottomLeft', 'bottomCenter', 'bottomRight']).optional(),
            xOffset: z.number().optional(),
            yOffset: z.number().optional(),
            spaceAbove: z.number().min(0).optional(),
        }).parse(args);
        const assignments = [];
        if (params.anchoredPosition) {
            assignments.push(`      aos.anchoredPosition = ${this.anchoredPositionMap[params.anchoredPosition]};`);
        }
        if (params.anchorPoint) {
            assignments.push(`      aos.anchorPoint = ${this.anchorPointMap[params.anchorPoint]};`);
        }
        if (params.xOffset !== undefined) {
            assignments.push(`      aos.anchorXoffset = ${params.xOffset};`);
        }
        if (params.yOffset !== undefined) {
            assignments.push(`      aos.anchorYoffset = ${params.yOffset};`);
        }
        if (params.spaceAbove !== undefined) {
            assignments.push(`      aos.anchorSpaceAbove = ${params.spaceAbove};`);
        }
        const code = `
      var doc = app.activeDocument;
      var item = doc.pages[${params.pageIndex}].allPageItems[${params.itemIndex}];
      var aos = item.anchoredObjectSettings;
${assignments.join('\n')}
      JSON.stringify({
        anchoredObject: "positionSet",
        pageIndex: ${params.pageIndex},
        itemIndex: ${params.itemIndex}
      });
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async release(args, _extra) {
        const params = z.object({
            pageIndex: z.number().int().min(0),
            itemIndex: z.number().int().min(0),
        }).parse(args);
        const code = `
      var doc = app.activeDocument;
      var item = doc.pages[${params.pageIndex}].allPageItems[${params.itemIndex}];
      item.anchoredObjectSettings.anchoredPosition = AnchorPosition.INLINE_POSITION;
      item.move(LocationOptions.AT_END, doc.pages[${params.pageIndex}]);
      JSON.stringify({
        anchoredObject: "released",
        pageIndex: ${params.pageIndex},
        itemIndex: ${params.itemIndex}
      });
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async getSettings(args, _extra) {
        const params = z.object({
            pageIndex: z.number().int().min(0),
            itemIndex: z.number().int().min(0),
        }).parse(args);
        const code = `
      var doc = app.activeDocument;
      var item = doc.pages[${params.pageIndex}].allPageItems[${params.itemIndex}];
      var aos = item.anchoredObjectSettings;
      JSON.stringify({
        anchoredPosition: aos.anchoredPosition.toString(),
        anchorPoint: aos.anchorPoint.toString(),
        anchorXoffset: aos.anchorXoffset,
        anchorYoffset: aos.anchorYoffset,
        anchorSpaceAbove: aos.anchorSpaceAbove,
        horizontalReferencePoint: aos.horizontalReferencePoint.toString(),
        verticalReferencePoint: aos.verticalReferencePoint.toString(),
        pinPosition: aos.pinPosition,
        spineRelative: aos.spineRelative
      });
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async setProperties(args, _extra) {
        const params = z.object({
            pageIndex: z.number().int().min(0),
            itemIndex: z.number().int().min(0),
            properties: z.record(z.string(), z.unknown()),
        }).parse(args);
        const propEntries = Object.entries(params.properties);
        const propAssignments = propEntries.map(([key, value]) => {
            if (typeof value === 'string') {
                const escaped = this.escape(value);
                return `      aos.${key} = "${escaped}";`;
            }
            return `      aos.${key} = ${String(value)};`;
        }).join('\n');
        const code = `
      var doc = app.activeDocument;
      var item = doc.pages[${params.pageIndex}].allPageItems[${params.itemIndex}];
      var aos = item.anchoredObjectSettings;
${propAssignments}
      JSON.stringify({
        anchoredObject: "propertiesSet",
        pageIndex: ${params.pageIndex},
        itemIndex: ${params.itemIndex},
        propertiesUpdated: ${propEntries.length}
      });
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
}
//# sourceMappingURL=AnchoredObjectHandler.js.map