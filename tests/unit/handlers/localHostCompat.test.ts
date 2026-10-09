import { it, expect } from 'vitest';
import vm from 'node:vm';
import { ImageHandler } from '../../../src/handlers/ImageHandler.js';
import { StyleHandler } from '../../../src/handlers/StyleHandler.js';

it('places and sizes the containing frame, and reads the documented itemLink', async () => {
  const frame:any={geometricBounds:[0,0,10,10],fit(){}};
  const graphic:any=new Proxy({index:0,parent:frame,itemLink:{status:0},geometricBounds:[0,0,10,10]}, {
    get(t,k){if(k==='imageLink')throw Error('imageLink is not an InDesign property');return Reflect.get(t,k);}
  });
  const ctx={app:{activeDocument:{pages:[{place:()=>[graphic]}]}},File:(x:any)=>x,JSON,FitOptions:{PROPORTIONALLY:1,CENTER_CONTENT:2}};
  const executor:any={execute:async(code:string)=>({result:vm.runInNewContext(code,ctx)})};
  const tool=new ImageHandler(executor).tools.find(x=>x.name==='image_place')!;
  const r:any=await tool.handler({pageIndex:0,filePath:'/tmp/test.png',x:20,y:95,width:170,height:102},{});
  expect(r.isError).not.toBe(true);
  expect(frame.geometricBounds).toEqual([95,20,197,190]);
});

it('resolves an exact family and style to a Font object before creating a style', async () => {
  const font={name:'Noto Sans SC (OTF)\tRegular',isValid:true}; let created:any;
  const ctx={app:{fonts:{itemByName:(n:string)=>n===font.name?font:{isValid:false}},activeDocument:{paragraphStyles:{add:(props:any)=>{if(props.appliedFont!==font)throw Error('ambiguous font');if('fontStyle' in props)throw Error('redundant style assignment fails in host');created=props;}}}}};
  const executor:any={execute:async(code:string)=>({result:vm.runInNewContext(code,ctx)})};
  const tool=new StyleHandler(executor).tools.find(x=>x.name==='style_createParagraph')!;
  const r:any=await tool.handler({name:'Body',fontFamily:'Noto Sans SC (OTF)',fontStyle:'Regular'},{});
  expect(r.isError).not.toBe(true);
  expect(created.appliedFont).toBe(font);
});
