import { Client } from '../node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js';
import { StdioClientTransport } from '../node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js';
import { fileURLToPath } from 'node:url';
import { writeFileSync, mkdirSync } from 'node:fs';
const root=fileURLToPath(new URL('../',import.meta.url));
mkdirSync(root+'_local/verification',{recursive:true});
const clients=[0,1].map(i=>new Client({name:'codex-restart-verification-'+i,version:'1'}));
const transports=clients.map(()=>new StdioClientTransport({command:process.execPath,args:[root+'dist/index.js',root+'_local/server-config.json'],stderr:'inherit'}));
try{
 await Promise.all(clients.map((c,i)=>c.connect(transports[i])));
 const both=await Promise.all(clients.map(c=>c.readResource({uri:'mcp://bridge/status'})));
 const document=await clients[0].callTool({name:'document_getInfo',arguments:{}});
 const text=await clients[1].callTool({name:'text_getContent',arguments:{pageIndex:0,frameIndex:0}});
 await clients[0].close();
 const afterDisconnect=await clients[1].callTool({name:'script_run',arguments:{code:'JSON.stringify({version:app.version,document:app.activeDocument.name,pages:app.activeDocument.pages.length})'}});
 for(const x of [document,text,afterDisconnect])if(x.isError)throw new Error(JSON.stringify(x));
 const result={at:new Date().toISOString(),twoClients:both,document,text,afterDisconnect};
 writeFileSync(root+'_local/verification/restart-shared-verification.json',JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify(result));
}finally{await Promise.allSettled(clients.map(c=>c.close()));}
