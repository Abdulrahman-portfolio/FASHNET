import worker from './worker.mjs';

const env = { ASSETS: { fetch: () => new Response('asset') } };
async function call(path, init = {}) {
  const request = new Request('https://fashnet.test' + path, init);
  Object.defineProperty(request, 'cf', { value: { colo:'LOS', city:'Lagos', country:'NG', region:'Lagos', continent:'AF', asn:64500, asOrganization:'Test ISP' } });
  const response = await worker.fetch(request, env);
  return { status: response.status, edge: response.headers.get('X-FASHNET-EDGE'), body: await response.text() };
}
for (const [path, init] of [
  ['/api/health'], ['/api/info'], ['/api/ping'], ['/api/down?bytes=100000'], ['/api/up', { method:'POST', body:new Uint8Array(12000) }], ['/api/missing']
]) console.log(path, await call(path, init));
