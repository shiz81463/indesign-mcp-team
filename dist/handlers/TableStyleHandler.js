import { z } from 'zod';
import { formatResponse } from '../utils/errorHandler.js';
import { withLogging, withErrorHandling, compose } from '../utils/middleware.js';
import { escapeExtendScriptString } from "../utils/stringUtils.js";
export class TableStyleHandler {
    name = 'tableStyle';
    executor;
    constructor(executor) {
        this.executor = executor;
    }
    get tools() {
        return [
            {
                name: 'tableStyle_create',
                description: 'Create a table style in the active document',
                inputSchema: {
                    name: z.string(),
                    basedOn: z.string().optional(),
                    fillColor: z.string().optional(),
                    strokeColor: z.string().optional(),
                    strokeWeight: z.number().min(0).optional(),
                    spaceBefore: z.number().min(0).optional(),
                    spaceAfter: z.number().min(0).optional(),
                    alternatingFills: z.enum(['everyRow', 'everyColumn', 'none']).optional().default('none'),
                    alternatingFillColors: z.array(z.string()).optional(),
                },
                handler: compose(withLogging('tableStyle_create'), withErrorHandling())(this.createTableStyle.bind(this)),
            },
            {
                name: 'tableStyle_list',
                description: 'List all table styles in the active document',
                inputSchema: {},
                handler: compose(withLogging('tableStyle_list'), withErrorHandling())(this.listTableStyles.bind(this)),
            },
            {
                name: 'cellStyle_create',
                description: 'Create a cell style in the active document',
                inputSchema: {
                    name: z.string(),
                    basedOn: z.string().optional(),
                    fillColor: z.string().optional(),
                    strokeColor: z.string().optional(),
                    strokeWeight: z.number().min(0).optional(),
                    topInset: z.number().min(0).optional(),
                    bottomInset: z.number().min(0).optional(),
                    leftInset: z.number().min(0).optional(),
                    rightInset: z.number().min(0).optional(),
                    paragraphStyle: z.string().optional(),
                },
                handler: compose(withLogging('cellStyle_create'), withErrorHandling())(this.createCellStyle.bind(this)),
            },
            {
                name: 'cellStyle_list',
                description: 'List all cell styles in the active document',
                inputSchema: {},
                handler: compose(withLogging('cellStyle_list'), withErrorHandling())(this.listCellStyles.bind(this)),
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
    async createTableStyle(args, _extra) {
        const params = z.object({
            name: z.string(),
            basedOn: z.string().optional(),
            fillColor: z.string().optional(),
            strokeColor: z.string().optional(),
            strokeWeight: z.number().min(0).optional(),
            spaceBefore: z.number().min(0).optional(),
            spaceAfter: z.number().min(0).optional(),
            alternatingFills: z.enum(['everyRow', 'everyColumn', 'none']).optional().default('none'),
            alternatingFillColors: z.array(z.string()).optional(),
        }).parse(args);
        const escName = this.escape(params.name);
        const escBasedOn = params.basedOn ? this.escape(params.basedOn) : '';
        const escFill = params.fillColor ? this.escape(params.fillColor) : '';
        const escStroke = params.strokeColor ? this.escape(params.strokeColor) : '';
        const code = `
      var doc = app.activeDocument;
      var style = doc.tableStyles.add({ name: "${escName}" });
      ${params.basedOn ? `style.basedOn = doc.tableStyles.item("${escBasedOn}");` : ''}
      ${params.fillColor ? `style.fillColor = doc.swatches.item("${escFill}");` : ''}
      ${params.strokeColor ? `style.strokeColor = doc.swatches.item("${escStroke}");` : ''}
      ${params.strokeWeight !== undefined ? `style.strokeWeight = ${params.strokeWeight};` : ''}
      ${params.spaceBefore !== undefined ? `style.spaceBefore = ${params.spaceBefore};` : ''}
      ${params.spaceAfter !== undefined ? `style.spaceAfter = ${params.spaceAfter};` : ''}
      JSON.stringify({ name: "${escName}", created: true });
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async listTableStyles(_args, _extra) {
        const code = `
      var doc = app.activeDocument;
      var styles = doc.tableStyles;
      var result = [];
      for (var i = 0; i < styles.length; i++) {
        var s = styles[i];
        result.push({
          name: s.name,
          basedOn: s.basedOn ? s.basedOn.name : '',
          fillColor: s.fillColor ? s.fillColor.name : '',
          strokeColor: s.strokeColor ? s.strokeColor.name : '',
          strokeWeight: s.strokeWeight
        });
      }
      JSON.stringify(result);
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async createCellStyle(args, _extra) {
        const params = z.object({
            name: z.string(),
            basedOn: z.string().optional(),
            fillColor: z.string().optional(),
            strokeColor: z.string().optional(),
            strokeWeight: z.number().min(0).optional(),
            topInset: z.number().min(0).optional(),
            bottomInset: z.number().min(0).optional(),
            leftInset: z.number().min(0).optional(),
            rightInset: z.number().min(0).optional(),
            paragraphStyle: z.string().optional(),
        }).parse(args);
        const escName = this.escape(params.name);
        const escBasedOn = params.basedOn ? this.escape(params.basedOn) : '';
        const escFill = params.fillColor ? this.escape(params.fillColor) : '';
        const escStroke = params.strokeColor ? this.escape(params.strokeColor) : '';
        const escPara = params.paragraphStyle ? this.escape(params.paragraphStyle) : '';
        const code = `
      var doc = app.activeDocument;
      var style = doc.cellStyles.add({ name: "${escName}" });
      ${params.basedOn ? `style.basedOn = doc.cellStyles.item("${escBasedOn}");` : ''}
      ${params.fillColor ? `style.fillColor = doc.swatches.item("${escFill}");` : ''}
      ${params.strokeColor ? `style.strokeColor = doc.swatches.item("${escStroke}");` : ''}
      ${params.strokeWeight !== undefined ? `style.strokeWeight = ${params.strokeWeight};` : ''}
      ${params.topInset !== undefined ? `style.topInset = ${params.topInset};` : ''}
      ${params.bottomInset !== undefined ? `style.bottomInset = ${params.bottomInset};` : ''}
      ${params.leftInset !== undefined ? `style.leftInset = ${params.leftInset};` : ''}
      ${params.rightInset !== undefined ? `style.rightInset = ${params.rightInset};` : ''}
      ${params.paragraphStyle ? `style.appliedParagraphStyle = doc.paragraphStyles.item("${escPara}");` : ''}
      JSON.stringify({ name: "${escName}", created: true });
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async listCellStyles(_args, _extra) {
        const code = `
      var doc = app.activeDocument;
      var styles = doc.cellStyles;
      var result = [];
      for (var i = 0; i < styles.length; i++) {
        var s = styles[i];
        result.push({
          name: s.name,
          basedOn: s.basedOn ? s.basedOn.name : '',
          fillColor: s.fillColor ? s.fillColor.name : '',
          strokeColor: s.strokeColor ? s.strokeColor.name : '',
          strokeWeight: s.strokeWeight
        });
      }
      JSON.stringify(result);
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
}
//# sourceMappingURL=TableStyleHandler.js.map