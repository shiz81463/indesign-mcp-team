// Call the configured shared MCP from a JSON request file; retain a receipt.
import { Client } from '../node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js';
import { StdioClientTransport } from '../node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js';
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
if(!process.argv[2])throw new Error('Usage: node _local/call.mjs /absolute/request.json');
const requestFile=resolve(process.argv[2]);
const request=JSON.parse(readFileSync(requestFile,'utf8'));
const client=new Client({name:'codex-indesign-file-client',version:'1'});
const transport=new StdioClientTransport({command:process.execPath,args:[root+'dist/index.js',root+'_local/server-config.json'],stderr:'inherit'});
const receipt={at:new Date().toISOString(),requestFile,results:[]};
try{
 await client.connect(transport);
 const state=await client.readResource({uri:'mcp://bridge/status'});
 if(!JSON.parse(state.contents[0].text).connected)throw new Error('InDesign plugin is disconnected; Load/Reload it in Adobe UXP Developer Tools.');
 for(const q of request.calls){
   const result=await client.callTool({name:q.name,arguments:q.arguments??{}},undefined,{timeout:180000});
   for(const [i,content] of (result.content??[]).entries())if(content.type==='image'){
     const path=requestFile+'.'+receipt.results.length+'.'+i+(content.mimeType==='image/png'?'.png':'.jpg');
     writeFileSync(path,Buffer.from(content.data,'base64'));
     result.content[i]={type:'text',text:'Saved image: '+path};
   }
   receipt.results.push({request:q,response:result});
   if(result.isError)throw new Error('Tool reported an error: '+q.name);
 }
}catch(e){receipt.error=String(e);process.exitCode=1;}
finally{
 await client.close();writeFileSync(requestFile+'.receipt.json',JSON.stringify(receipt,null,2)+'\n');
 console.log(JSON.stringify(receipt));
}
