import { json, edgeHeaders } from './_common.js';
export const config = { runtime: 'edge' };
export default function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: edgeHeaders(req) });
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405, edgeHeaders(req));
  return json({ ok: true, service: 'fashnet-speed-test', timestamp: new Date().toISOString() }, 200, edgeHeaders(req));
}
