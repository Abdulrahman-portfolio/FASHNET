import worker from './worker.mjs';
const env={ASSETS:{fetch:()=>new Response('<ok>')}};
async function call(path,init={}){
  const req=new Request('https://fashnet.test'+path,init);
  Object.defineProperty(req,'cf',{value:{colo:'LOS',city:'Lagos',country:'NG',region:'Lagos',continent:'AF',asn:64500,asOrganization:'QA ISP'}});
  const res=await worker.fetch(req,env);
  return {res,body:await res.arrayBuffer()};
}
const health=await call('/api/health');
if(health.res.status!==200) throw new Error('health failed');
const info=await call('/api/info');
const infoJson=JSON.parse(new TextDecoder().decode(info.body));
if(infoJson.colo!=='LOS'||infoJson.city!=='Lagos') throw new Error('info metadata failed');
const ping=await call('/api/ping');
if(ping.res.status!==200||ping.body.byteLength!==2) throw new Error('ping failed');
const down=await call('/api/down?bytes=1048576');
if(down.res.status!==200||down.body.byteLength!==1048576) throw new Error(`download bytes ${down.body.byteLength}`);
const up=await call('/api/up',{method:'POST',body:new Uint8Array(123456)});
const upJson=JSON.parse(new TextDecoder().decode(up.body));
if(up.res.status!==200||upJson.received!==123456) throw new Error('upload failed');
const bad=await call('/api/missing');
if(bad.res.status!==404) throw new Error('404 failed');
console.log(JSON.stringify({health:health.res.status,info:info.res.status,edge:info.res.headers.get('X-FASHNET-EDGE'),ping:ping.body.byteLength,downloadBytes:down.body.byteLength,uploaded:upJson.received,notFound:bad.res.status}));
