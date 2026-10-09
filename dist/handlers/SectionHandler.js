import { z } from 'zod';
import { formatResponse } from '../utils/errorHandler.js';
import { withLogging, withErrorHandling, compose } from '../utils/middleware.js';
import { escapeExtendScriptString } from "../utils/stringUtils.js";
export class SectionHandler {
    name = 'section';
    executor;
    constructor(executor) {
        this.executor = executor;
    }
    get tools() {
        return [
            {
                name: 'section_create',
                description: 'Create a new section starting at a specified page',
                inputSchema: {
                    startPageIndex: z.number().int().min(0),
                    name: z.string().optional(),
                    pageNumberStart: z.number().int().min(1).optional().default(1),
                    sectionPrefix: z.string().optional(),
                    includePrefix: z.boolean().optional().default(false),
                    numberingStyle: z.enum(['decimal', 'lowerRoman', 'upperRoman', 'lowerAlpha', 'upperAlpha']).optional().default('decimal'),
                },
                handler: compose(withLogging('section_create'), withErrorHandling())(this.create.bind(this)),
            },
            {
                name: 'section_list',
                description: 'List all sections in the active document',
                inputSchema: {},
                handler: compose(withLogging('section_list'), withErrorHandling())(this.list.bind(this)),
            },
            {
                name: 'section_setNumbering',
                description: 'Update page numbering for a section',
                inputSchema: {
                    sectionIndex: z.number().int().min(0),
                    pageNumberStart: z.number().int().min(1),
                    numberingStyle: z.enum(['decimal', 'lowerRoman', 'upperRoman', 'lowerAlpha', 'upperAlpha']).optional(),
                },
                handler: compose(withLogging('section_setNumbering'), withErrorHandling())(this.setNumbering.bind(this)),
            },
            {
                name: 'section_delete',
                description: 'Delete a section by its index',
                inputSchema: {
                    sectionIndex: z.number().int().min(0),
                },
                handler: compose(withLogging('section_delete'), withErrorHandling())(this.delete.bind(this)),
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
        const params = z.object({
            startPageIndex: z.number().int().min(0),
            name: z.string().optional(),
            pageNumberStart: z.number().int().min(1).optional().default(1),
            sectionPrefix: z.string().optional(),
            includePrefix: z.boolean().optional().default(false),
            numberingStyle: z.enum(['decimal', 'lowerRoman', 'upperRoman', 'lowerAlpha', 'upperAlpha']).optional().default('decimal'),
        }).parse(args);
        const escName = params.name ? this.escape(params.name) : '';
        const escPrefix = params.sectionPrefix ? this.escape(params.sectionPrefix) : '';
        const numberingMap = {
            decimal: 'PageNumberStyle.DECIMAL_PAGE_NUMBER',
            lowerRoman: 'PageNumberStyle.LOWER_ROMAN_PAGE_NUMBER',
            upperRoman: 'PageNumberStyle.UPPER_ROMAN_PAGE_NUMBER',
            lowerAlpha: 'PageNumberStyle.LOWER_ALPHA_PAGE_NUMBER',
            upperAlpha: 'PageNumberStyle.UPPER_ALPHA_PAGE_NUMBER',
        };
        const code = `
      var doc = app.activeDocument;
      var section = doc.sections.add({ startPage: doc.pages[${params.startPageIndex}] });
      ${params.name ? `section.name = "${escName}";` : ''}
      section.pageNumberStart = ${params.pageNumberStart};
      section.pageNumberStyle = ${numberingMap[params.numberingStyle]};
      ${params.sectionPrefix ? `section.sectionPrefix = "${escPrefix}";` : ''}
      section.includeSectionPrefix = ${params.includePrefix};
      JSON.stringify({ startPage: ${params.startPageIndex}, name: "${escName}", pageNumberStart: ${params.pageNumberStart} });
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async list(_args, _extra) {
        const code = `
      var doc = app.activeDocument;
      var result = [];
      for (var i = 0; i < doc.sections.length; i++) {
        var s = doc.sections[i];
        result.push({
          index: i,
          name: s.name,
          startPage: s.pageStart ? s.pageStart.index : 0,
          pageNumberStart: s.pageNumberStart,
          pageNumberStyle: s.pageNumberStyle.toString(),
          sectionPrefix: s.sectionPrefix,
          includePrefix: s.includeSectionPrefix
        });
      }
      JSON.stringify(result);
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async delete(args, _extra) {
        const params = z.object({
            sectionIndex: z.number().int().min(0),
        }).parse(args);
        const code = `
      var doc = app.activeDocument;
      doc.sections[${params.sectionIndex}].remove();
      JSON.stringify({ deleted: true, sectionIndex: ${params.sectionIndex} });
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async setNumbering(args, _extra) {
        const params = z.object({
            sectionIndex: z.number().int().min(0),
            pageNumberStart: z.number().int().min(1),
            numberingStyle: z.enum(['decimal', 'lowerRoman', 'upperRoman', 'lowerAlpha', 'upperAlpha']).optional(),
        }).parse(args);
        const numberingMap = {
            decimal: 'PageNumberStyle.DECIMAL_PAGE_NUMBER',
            lowerRoman: 'PageNumberStyle.LOWER_ROMAN_PAGE_NUMBER',
            upperRoman: 'PageNumberStyle.UPPER_ROMAN_PAGE_NUMBER',
            lowerAlpha: 'PageNumberStyle.LOWER_ALPHA_PAGE_NUMBER',
            upperAlpha: 'PageNumberStyle.UPPER_ALPHA_PAGE_NUMBER',
        };
        const code = `
      var doc = app.activeDocument;
      var s = doc.sections[${params.sectionIndex}];
      s.pageNumberStart = ${params.pageNumberStart};
      ${params.numberingStyle ? `s.pageNumberStyle = ${numberingMap[params.numberingStyle]};` : ''}
      JSON.stringify({ updated: true, sectionIndex: ${params.sectionIndex}, pageNumberStart: ${params.pageNumberStart} });
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
}
//# sourceMappingURL=SectionHandler.js.map