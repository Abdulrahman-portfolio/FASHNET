export function noStore(headers = {}) {
  return {
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    'CDN-Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Range',
    ...headers,
  };
}

export function meta(req) {
  const h = req.headers;
  const forwarded = h.get('x-forwarded-for') || h.get('x-real-ip') || '';
  const ip = forwarded.split(',')[0].trim() || null;
  return {
    ip,
    city: h.get('x-vercel-ip-city') || null,
    region: h.get('x-vercel-ip-country-region') || null,
    country: h.get('x-vercel-ip-country') || null,
    continent: null,
    colo: h.get('x-vercel-id') || null,
    asn: h.get('x-vercel-ip-asn') ? Number(h.get('x-vercel-ip-asn')) || null : null,
    asOrganization: h.get('x-vercel-ip-asn-owner') || null,
  };
}

export function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: noStore({ 'Content-Type': 'application/json; charset=utf-8', ...extra }),
  });
}

export function requestId() {
  return crypto.randomUUID();
}

export function edgeHeaders(req) {
  const m = meta(req);
  return {
    'X-FASHNET-REQUEST': requestId(),
    'X-FASHNET-EDGE': m.colo || 'vercel-edge',
    'X-Content-Type-Options': 'nosniff',
  };
}
