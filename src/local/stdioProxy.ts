import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { forwardingServer, serialDispatcher } from './SharedGateway.js';

export async function runStdioProxy(url: string): Promise<void> {
  const endpoint=new URL(url);
  if(endpoint.protocol!=='http:'||endpoint.hostname!=='127.0.0.1')throw new Error('Shared gateway must use local loopback HTTP');
  const backend=new Client({name:'codex-indesign-client',version:'1.0.0'});
  const transport=new StreamableHTTPClientTransport(endpoint);
  await backend.connect(transport);
  const server=forwardingServer(backend,serialDispatcher());
  let stopping=false;
  const stop=async()=>{
    if(stopping)return;stopping=true;
    try {await transport.terminateSession();} catch { /* daemon may have stopped */ }
    await backend.close();await server.close();
  };
  process.stdin.once('end',()=>{void stop();});
  process.once('SIGTERM',()=>{void stop().finally(()=>process.exit(0));});
  process.once('SIGINT',()=>{void stop().finally(()=>process.exit(0));});
  await server.connect(new StdioServerTransport());
}
