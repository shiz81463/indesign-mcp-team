import { z } from 'zod';
import { withLogging, withErrorHandling, compose } from '../utils/middleware.js';
const statusParams = z.object({
    since: z.number().optional(),
});
export class ChangesHandler {
    tracker;
    name = 'changes';
    constructor(tracker) {
        this.tracker = tracker;
    }
    register(server) {
        for (const tool of this.tools) {
            server.tool(tool.name, tool.description, tool.inputSchema, tool.handler);
        }
    }
    get tools() {
        return [
            {
                name: 'changes_getStatus',
                description: 'Report document change activity pushed by the plugin over the bridge — no InDesign round-trip. ' +
                    'Pass `since` (epoch ms) to learn whether anything changed after that moment, e.g. to skip ' +
                    're-rendering a preview when nothing changed.',
                inputSchema: {
                    since: z.number().optional(),
                },
                handler: compose(withLogging('changes_getStatus'), withErrorHandling())(this.getStatus.bind(this)),
            },
        ];
    }
    async getStatus(args) {
        const params = statusParams.parse(args ?? {});
        const info = this.tracker.getInfo();
        const payload = params.since !== undefined
            ? { ...info, changed: this.tracker.hasChangedSince(params.since) }
            : info;
        return {
            content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
        };
    }
}
//# sourceMappingURL=ChangesHandler.js.map