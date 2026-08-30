import { edgeHeaders } from './_common.js';
export const config = { runtime: 'edge' };
export default function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: edgeHeaders(req) });
  if (req.method !== 'GET') return new Response('Method not allowed', { status: 405, headers: edgeHeaders(req) });
  return new Response('ok', { status: 200, headers: { ...edgeHeaders(req), 'Content-Type': 'text/plain; charset=utf-8', 'Content-Length': '2' } });
}
