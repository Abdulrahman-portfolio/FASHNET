import { edgeHeaders, noStore } from './_common.js';
export const config = { runtime: 'edge' };
const MAX = 128 * 1024 * 1024;
const CHUNK = 256 * 1024;
function bytesParam(req) {
  const n = Number(new URL(req.url).searchParams.get('bytes'));
  return Number.isFinite(n) && n > 0 ? Math.min(Math.floor(n), MAX) : null;
}
function randomChunk() {
  const a = new Uint8Array(CHUNK);
  for (let i = 0; i < a.length; i += 65536) {
    crypto.getRandomValues(a.subarray(i, Math.min(i + 65536, a.length)));
  }
  return a;
}
export default function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: edgeHeaders(req) });
  if (req.method !== 'GET') return new Response('Method not allowed', { status: 405, headers: edgeHeaders(req) });
  const bytes = bytesParam(req);
  if (!bytes) return new Response('Invalid bytes', { status: 400, headers: edgeHeaders(req) });
  const chunk = randomChunk();
  let sent = 0;
  const body = new ReadableStream({
    pull(controller) {
      if (sent >= bytes) { controller.close(); return; }
      const size = Math.min(chunk.byteLength, bytes - sent);
      controller.enqueue(size === chunk.byteLength ? chunk : chunk.slice(0, size));
      sent += size;
    }
  });
  return new Response(body, { status: 200, headers: noStore({ ...edgeHeaders(req), 'Content-Type': 'application/octet-stream', 'Content-Length': String(bytes), 'Content-Encoding': 'identity' }) });
}
