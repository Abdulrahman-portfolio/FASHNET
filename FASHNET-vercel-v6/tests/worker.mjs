const MAX_DOWNLOAD_BYTES = 128 * 1024 * 1024;
const MAX_UPLOAD_BYTES = 64 * 1024 * 1024;
const CHUNK = 256 * 1024;
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Range',
  'Access-Control-Expose-Headers': 'X-FASHNET-EDGE,X-FASHNET-REQUEST',
};
const noStore = {'Cache-Control':'no-store, no-cache, must-revalidate, max-age=0','CDN-Cache-Control':'no-store'};
const out = (body,status=200,extra={}) => new Response(body,{status,headers:{...CORS,...noStore,...extra}});
const json = (data,status=200,extra={}) => out(JSON.stringify(data),status,{'Content-Type':'application/json; charset=utf-8',...extra});
function meta(request){const cf=request.cf||{};return {ip:request.headers.get('CF-Connecting-IP')||null,city:typeof cf.city==='string'?cf.city:null,region:typeof cf.region==='string'?cf.region:null,country:typeof cf.country==='string'?cf.country:null,continent:typeof cf.continent==='string'?cf.continent:null,colo:typeof cf.colo==='string'?cf.colo:null,asn:typeof cf.asn==='number'?cf.asn:null,asOrganization:typeof cf.asOrganization==='string'?cf.asOrganization:null};}
function headers(m){return {'X-FASHNET-REQUEST':crypto.randomUUID(),'X-FASHNET-EDGE':m.colo||'unknown','X-Content-Type-Options':'nosniff'};}
function randomChunk(){const a=new Uint8Array(CHUNK);for(let i=0;i<a.length;i+=65536)crypto.getRandomValues(a.subarray(i,Math.min(i+65536,a.length)));return a;}
function safeBytes(value,max){const n=Number(value);if(!Number.isFinite(n)||n<=0)return null;return Math.min(Math.floor(n),max);}
async function api(request){const url=new URL(request.url);if(request.method==='OPTIONS')return new Response(null,{headers:CORS});const m=meta(request);const h=headers(m);
  if(url.pathname==='/api/health'&&request.method==='GET')return json({ok:true,service:'fashnet-speed-test',timestamp:new Date().toISOString()},200,h);
  if(url.pathname==='/api/info'&&request.method==='GET')return json({...m,servedBy:'FASHNET edge',timestamp:new Date().toISOString()},200,h);
  if(url.pathname==='/api/ping'&&request.method==='GET')return out('ok',200,{...h,'Content-Type':'text/plain; charset=utf-8','Content-Length':'2'});
  if(url.pathname==='/api/down'&&request.method==='GET'){const bytes=safeBytes(url.searchParams.get('bytes'),MAX_DOWNLOAD_BYTES);if(!bytes)return out('Invalid bytes',400,h);const chunk=randomChunk();let sent=0;const body=new ReadableStream({pull(controller){if(sent>=bytes){controller.close();return;}const size=Math.min(chunk.byteLength,bytes-sent);controller.enqueue(size===chunk.byteLength?chunk:chunk.slice(0,size));sent+=size;}});return new Response(body,{status:200,headers:{...CORS,...noStore,...h,'Content-Type':'application/octet-stream','Content-Length':String(bytes),'Content-Encoding':'identity'}});}
  if(url.pathname==='/api/up'&&request.method==='POST'){let total=0;const reader=request.body?.getReader();if(!reader)return json({received:0},200,h);while(true){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;if(total>MAX_UPLOAD_BYTES)return json({error:'Upload too large'},413,h);}return json({received:total},200,h);}
  return json({error:'Not found'},404,h);
}
export default {async fetch(request,env){const u=new URL(request.url);if(u.pathname.startsWith('/api/'))return api(request);return env.ASSETS.fetch(request);}};
