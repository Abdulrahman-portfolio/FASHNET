import { json, edgeHeaders } from './_common.js';
export const config = { runtime: 'edge' };
const MAX = 64 * 1024 * 1024;
export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: edgeHeaders(req) });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, edgeHeaders(req));
  let total = 0;
  if (req.body) {
    const reader = req.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX) return json({ error: 'Upload too large' }, 413, edgeHeaders(req));
    }
  }
  return json({ received: total }, 200, edgeHeaders(req));
}
