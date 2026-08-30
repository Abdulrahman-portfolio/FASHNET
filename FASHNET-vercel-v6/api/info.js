import { json, meta, edgeHeaders } from './_common.js';
export const config = { runtime: 'edge' };
export default function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: edgeHeaders(req) });
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405, edgeHeaders(req));
  const m = meta(req);
  return json({ ...m, servedBy: 'FASHNET on Vercel', timestamp: new Date().toISOString() }, 200, edgeHeaders(req));
}
