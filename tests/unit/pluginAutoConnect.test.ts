import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

describe('local plugin connection lifecycle', () => {
  it('connects once when loaded and respects explicit disconnect', () => {
    const nodes: Record<string, any> = {};
    for (const id of ['indicator','statusText','log','serverUrl','connectBtn']) {
      nodes[id] = { value: 'ws://127.0.0.1:8120', classList: {add(){},remove(){}}, handlers: {}, appendChild(){}, addEventListener(k: string,f: any){this.handlers[k]=f;} };
    }
    const sockets: any[]=[];
    class Socket {
      static OPEN=1; readyState=1; onopen: any; onclose: any; closed=false;
      constructor(public url: string){sockets.push(this);}
      close(){this.closed=true; this.onclose?.({code:1000});}
    }
    const timers: any[]=[];
    vm.runInNewContext(readFileSync('plugin/index.js','utf8'), {
      document: {readyState:'complete',getElementById:(id: string)=>nodes[id],createElement:()=>({})},
      WebSocket: Socket,console,setInterval:()=>1,clearInterval(){},
      setTimeout:(f: any)=>{timers.push(f);return 1;},clearTimeout(){}
    });
    expect(sockets).toHaveLength(1);
    expect(sockets[0].url).toBe('ws://127.0.0.1:8120');
    sockets[0].onopen();
    nodes.connectBtn.handlers.click();
    expect(sockets[0].closed).toBe(true);
    expect(timers).toHaveLength(0);
    expect(nodes.statusText.textContent).toContain('Disconnected');
  });
});
