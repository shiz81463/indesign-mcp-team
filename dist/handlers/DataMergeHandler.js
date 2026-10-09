import { z } from 'zod';
import { formatResponse } from '../utils/errorHandler.js';
import { withLogging, withErrorHandling, compose } from '../utils/middleware.js';
import { escapeExtendScriptString } from "../utils/stringUtils.js";
import { filePathError } from '../utils/security.js';
export class DataMergeHandler {
    name = 'dataMerge';
    executor;
    constructor(executor) {
        this.executor = executor;
    }
    get tools() {
        return [
            {
                name: 'dataMerge_selectDataSource',
                description: 'Select a data source (CSV/TSV/XML) file for data merge',
                inputSchema: {
                    filePath: z.string(),
                },
                handler: compose(withLogging('dataMerge_selectDataSource'), withErrorHandling())(this.selectDataSource.bind(this)),
            },
            {
                name: 'dataMerge_listFields',
                description: 'List available data merge fields from the current data source',
                inputSchema: {},
                handler: compose(withLogging('dataMerge_listFields'), withErrorHandling())(this.listFields.bind(this)),
            },
            {
                name: 'dataMerge_mergeRecords',
                description: 'Merge records into the document using the selected data source',
                inputSchema: {
                    recordsPerPage: z.number().int().min(1).optional().default(1),
                    linkImages: z.boolean().optional().default(false),
                    generatePreview: z.boolean().optional().default(false),
                    alertWhenOverset: z.boolean().optional().default(true),
                },
                handler: compose(withLogging('dataMerge_mergeRecords'), withErrorHandling())(this.mergeRecords.bind(this)),
            },
            {
                name: 'dataMerge_export',
                description: 'Export the merged document to a file',
                inputSchema: {
                    format: z.enum(['pdf', 'jpg', 'indd']),
                    outputPath: z.string(),
                },
                handler: compose(withLogging('dataMerge_export'), withErrorHandling())(this.export.bind(this)),
            },
            {
                name: 'dataMerge_removeDataSource',
                description: 'Remove the current data source from the document',
                inputSchema: {},
                handler: compose(withLogging('dataMerge_removeDataSource'), withErrorHandling())(this.removeDataSource.bind(this)),
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
    async selectDataSource(args, _extra) {
        const params = z.object({
            filePath: z.string(),
        }).parse(args);
        const escPath = this.escape(params.filePath);
        const __pathError = filePathError(params.filePath);
        if (__pathError) {
            return {
                content: [{ type: 'text', text: `Invalid file path: ${__pathError}` }],
                isError: true,
            };
        }
        const code = `
      var doc = app.activeDocument;
      var dm = doc.dataMergeProperties;
      dm.selectDataSource(File("${escPath}"));
      JSON.stringify({ success: true, filePath: "${escPath}" });
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async listFields(args, _extra) {
        z.object({}).parse(args);
        const code = `
      var doc = app.activeDocument;
      var dm = doc.dataMergeProperties;
      var fields = dm.dataMergeFields;
      var result = [];
      for (var i = 0; i < fields.length; i++) {
        result.push({ name: fields[i].name, fieldType: fields[i].fieldType });
      }
      JSON.stringify(result);
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async mergeRecords(args, _extra) {
        const params = z.object({
            recordsPerPage: z.number().int().min(1).optional().default(1),
            linkImages: z.boolean().optional().default(false),
            generatePreview: z.boolean().optional().default(false),
            alertWhenOverset: z.boolean().optional().default(true),
        }).parse(args);
        const code = `
      var doc = app.activeDocument;
      var dm = doc.dataMergeProperties;
      dm.dataMergePreferences.recordsPerPage = ${params.recordsPerPage};
      dm.dataMergePreferences.linkImages = ${params.linkImages};
      dm.dataMergePreferences.generatePreview = ${params.generatePreview};
      dm.dataMergePreferences.alertWhenOverset = ${params.alertWhenOverset};
      dm.mergeRecords();
      JSON.stringify({ success: true, recordsPerPage: ${params.recordsPerPage}, linkImages: ${params.linkImages}, generatePreview: ${params.generatePreview}, alertWhenOverset: ${params.alertWhenOverset} });
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async export(args, _extra) {
        const params = z.object({
            format: z.enum(['pdf', 'jpg', 'indd']),
            outputPath: z.string(),
        }).parse(args);
        const escPath = this.escape(params.outputPath);
        const __pathError = filePathError(params.outputPath);
        if (__pathError) {
            return {
                content: [{ type: 'text', text: `Invalid file path: ${__pathError}` }],
                isError: true,
            };
        }
        const formatMap = {
            pdf: 'ExportFormat.pdfType',
            jpg: 'ExportFormat.jpgType',
        };
        const exportExpr = params.format === 'indd'
            ? `doc.saveACopy(File("${escPath}"));`
            : `doc.exportFile(${formatMap[params.format]}, File("${escPath}"), false);`;
        const code = `
      var doc = app.activeDocument;
      ${exportExpr}
      JSON.stringify({ success: true, format: "${params.format}", outputPath: "${escPath}" });
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async removeDataSource(args, _extra) {
        z.object({}).parse(args);
        const code = `
      var doc = app.activeDocument;
      doc.dataMergeProperties.removeDataSource();
      JSON.stringify({ success: true });
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
}
//# sourceMappingURL=DataMergeHandler.js.map