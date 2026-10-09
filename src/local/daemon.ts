import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { startSharedGateway } from './SharedGateway.js';

const root=fileURLToPath(new URL('../../',import.meta.url));
const backend=new Client({name:'indesign-shared-owner',version:'1.0.0'});
const transport=new StdioClientTransport({command:process.execPath,args:[root+'dist/standalone.js',root+'_local/backend-config.json'],stderr:'inherit'});
await backend.connect(transport);
const gateway=await startSharedGateway(backend,8122);
console.error('InDesign shared gateway ready at '+gateway.url);
let stopping=false;
async function stop(){if(stopping)return;stopping=true;await gateway.close();await backend.close();}
backend.onclose=()=>{if(!stopping){console.error('InDesign backend stopped');void stop().finally(()=>process.exit(1));}};
process.once('SIGTERM',()=>{void stop().finally(()=>process.exit(0));});
process.once('SIGINT',()=>{void stop().finally(()=>process.exit(0));});
