// Read-only check through the shared gateway; other shared clients may stay connected.
import { Client } from '../node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js';
import { StdioClientTransport } from '../node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js';
import { fileURLToPath } from 'node:url';
import { writeFileSync, mkdirSync } from 'node:fs';
const root=fileURLToPath(new URL('../',import.meta.url));
mkdirSync(root+'_local/verification',{recursive:true});
const client=new Client({name:'indesign-deployment-check',version:'1.0.0'});
const transport=new StdioClientTransport({command:process.execPath,args:[root+'dist/index.js',root+'_local/server-config.json'],stderr:'inherit'});
try {
  await client.connect(transport);
  let bridge;
  const started=Date.now();
  while(Date.now()-started<20000){
    const r=await client.readResource({uri:'mcp://bridge/status'});
    bridge=JSON.parse(r.contents[0].text);
    if(bridge.connected)break;
    await new Promise(resolve=>setTimeout(resolve,500));
  }
  if(!bridge?.connected)throw new Error('InDesign plugin is disconnected. Load / Reload InDesign MCP Bridge in UXP Developer Tools.');
  const inventory=await client.listTools();
  const host=await client.callTool({name:'script_run',arguments:{code:'JSON.stringify({app:app.name,version:app.version,documents:app.documents.length})'}});
  if(host.isError)throw new Error(JSON.stringify(host));
  const result={at:new Date().toISOString(),connected:true,bridge,toolCount:inventory.tools.length,host};
  writeFileSync(root+'_local/verification/configured-connection.json',JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result));
} finally {await client.close();}
