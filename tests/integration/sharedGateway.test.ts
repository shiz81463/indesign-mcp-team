import { it, expect } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { startSharedGateway } from '../../src/local/SharedGateway.js';

it('serves two independent MCP clients, serializes calls, and survives one disconnect/error', async () => {
  let active=0, maximum=0; const order:string[]=[];
  const host=new Server({name:'test-host',version:'1'},{capabilities:{tools:{}}});
  host.setRequestHandler(ListToolsRequestSchema,async()=>({tools:[{name:'probe',inputSchema:{type:'object'}}]}));
  host.setRequestHandler(CallToolRequestSchema,async(q)=>{
    const id=String(q.params.arguments?.id);active++;maximum=Math.max(maximum,active);order.push(id);
    await new Promise(r=>setTimeout(r,30));active--;
    return {content:[{type:'text',text:id}],isError:id==='error'};
  });
  const [a,b]=InMemoryTransport.createLinkedPair();await host.connect(a);
  const backend=new Client({name:'backend',version:'1'});await backend.connect(b);
  const gateway=await startSharedGateway(backend,0);
  const clients=[0,1].map(i=>new Client({name:'client-'+i,version:'1'}));
  const transports=clients.map(()=>new StreamableHTTPClientTransport(new URL(gateway.url)));
  try {
    await Promise.all(clients.map((c,i)=>c.connect(transports[i])));
    expect((await clients[0].listTools()).tools[0].name).toBe('probe');
    const r=await Promise.all(clients.map((c,i)=>c.callTool({name:'probe',arguments:{id:String(i)}})));
    expect(maximum).toBe(1);expect(order).toHaveLength(2);expect(r).toHaveLength(2);
    await transports[0].terminateSession();await clients[0].close();
    expect((await clients[1].callTool({name:'probe',arguments:{id:'error'}})).isError).toBe(true);
    expect((await clients[1].callTool({name:'probe',arguments:{id:'still-connected'}})).content).toEqual([{type:'text',text:'still-connected'}]);
    const denied=await fetch(gateway.url,{method:'POST',headers:{origin:'https://unrelated.example','content-type':'application/json'},body:'{}'});
    expect(denied.status).toBe(403);
  } finally {
    await Promise.allSettled(transports.map(t=>t.terminateSession()));
    await Promise.allSettled(clients.map(c=>c.close()));
    await gateway.close();await backend.close();await host.close();
  }
},10000);
