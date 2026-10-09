import { formatResponse } from '../utils/errorHandler.js';
import { withLogging, withErrorHandling, compose } from '../utils/middleware.js';
export class UndoHandler {
    name = 'undo';
    executor;
    constructor(executor) {
        this.executor = executor;
    }
    get tools() {
        return [
            {
                name: 'undo',
                description: 'Undo the last operation',
                inputSchema: {},
                handler: compose(withLogging('undo'), withErrorHandling())(this.undo.bind(this)),
            },
            {
                name: 'redo',
                description: 'Redo the last undone operation',
                inputSchema: {},
                handler: compose(withLogging('redo'), withErrorHandling())(this.redo.bind(this)),
            },
            {
                name: 'undo_history',
                description: 'Get undo/redo state information',
                inputSchema: {},
                handler: compose(withLogging('undo_history'), withErrorHandling())(this.undoHistory.bind(this)),
            },
            {
                name: 'undo_beginGroup',
                description: 'Begin an undo group — subsequent tool calls become a single undo step. Call undo_endGroup() to restore normal behavior.',
                inputSchema: {},
                handler: compose(withLogging('undo_beginGroup'), withErrorHandling())(this.beginUndoGroup.bind(this)),
            },
            {
                name: 'undo_endGroup',
                description: 'End the undo group and restore normal undo behavior',
                inputSchema: {},
                handler: compose(withLogging('undo_endGroup'), withErrorHandling())(this.endUndoGroup.bind(this)),
            },
        ];
    }
    register(server) {
        for (const tool of this.tools) {
            server.tool(tool.name, tool.description, tool.inputSchema, tool.handler);
        }
    }
    async undo(_args, _extra) {
        const code = `
      if (app.activeDocument.undoable) {
        app.activeDocument.undo();
        "undone";
      } else {
        "nothing to undo";
      }
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async redo(_args, _extra) {
        const code = `
      app.activeDocument.redo();
      "redone";
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async undoHistory(_args, _extra) {
        const code = `
      JSON.stringify({
        undoable: app.activeDocument.undoable,
        redoable: app.activeDocument.redoable
      });
    `;
        const response = await this.executor.execute(code);
        return formatResponse(response.result);
    }
    async beginUndoGroup(_args, _extra) {
        this.executor.startUndoGroup();
        return formatResponse({ undoGroupActive: true });
    }
    async endUndoGroup(_args, _extra) {
        this.executor.endUndoGroup();
        return formatResponse({ undoGroupActive: false });
    }
}
//# sourceMappingURL=UndoHandler.js.map