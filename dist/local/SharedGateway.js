import express from 'express';
import { randomUUID } from 'node:crypto';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { localhostHostValidation } from '@modelcontextprotocol/sdk/server/middleware/hostHeaderValidation.js';
import { CallToolRequestSchema, ListToolsRequestSchema, ListResourcesRequestSchema, ListResourceTemplatesRequestSchema, ReadResourceRequestSchema, isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
export function serialDispatcher() {
    let tail = Promise.resolve();
    return (operation) => {
        const result = tail.then(operation, operation);
        tail = result.catch(() => undefined);
        return result;
    };
}
export function forwardingServer(backend, dispatch) {
    const server = new Server({ name: 'indesign-nutria-shared', version: '1.4.1-local.2' }, { capabilities: { tools: {}, resources: {} } });
    server.setRequestHandler(ListToolsRequestSchema, q => backend.listTools(q.params));
    server.setRequestHandler(ListResourcesRequestSchema, q => backend.listResources(q.params));
    server.setRequestHandler(ListResourceTemplatesRequestSchema, q => backend.listResourceTemplates(q.params));
    server.setRequestHandler(ReadResourceRequestSchema, q => backend.readResource(q.params));
    server.setRequestHandler(CallToolRequestSchema, q => dispatch(() => backend.callTool(q.params, undefined, { timeout: 180000 })));
    return server;
}
export async function startSharedGateway(backend, port) {
    const app = express();
    app.use(localhostHostValidation());
    app.use((req, res, next) => {
        // No browser page needs access to this local automation endpoint.
        if (req.headers.origin) {
            res.status(403).json({ error: 'Browser origins are not allowed' });
            return;
        }
        next();
    });
    app.use(express.json({ limit: '1mb' }));
    const sessions = new Map();
    const dispatch = serialDispatcher();
    app.get('/health', (_req, res) => { res.json({ service: 'indesign-nutria-shared', sessions: sessions.size }); });
    app.all('/mcp', async (req, res) => {
        try {
            const id = req.headers['mcp-session-id'];
            if (typeof id === 'string') {
                const session = sessions.get(id);
                if (!session) {
                    res.status(404).json({ error: 'Unknown MCP session' });
                    return;
                }
                await session.transport.handleRequest(req, res, req.body);
                return;
            }
            if (req.method !== 'POST' || !isInitializeRequest(req.body)) {
                res.status(400).json({ error: 'MCP initialize required' });
                return;
            }
            const server = forwardingServer(backend, dispatch);
            const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: randomUUID, enableJsonResponse: true,
                onsessioninitialized: (newId) => { sessions.set(newId, { server, transport }); }
            });
            server.onclose = () => { if (transport.sessionId)
                sessions.delete(transport.sessionId); };
            await server.connect(transport);
            await transport.handleRequest(req, res, req.body);
            if (!transport.sessionId)
                await server.close();
        }
        catch (error) {
            if (!res.headersSent)
                res.status(500).json({ error: String(error) });
        }
    });
    const httpServer = await new Promise((resolve, reject) => {
        const listener = app.listen(port, '127.0.0.1', () => resolve(listener));
        listener.once('error', reject);
    });
    const address = httpServer.address();
    return { url: `http://127.0.0.1:${address.port}/mcp`, async close() {
            await Promise.allSettled([...sessions.values()].map(s => s.server.close()));
            sessions.clear();
            httpServer.closeAllConnections();
            await new Promise((resolve, reject) => httpServer.close(e => e ? reject(e) : resolve()));
        } };
}
//# sourceMappingURL=SharedGateway.js.map