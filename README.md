# FASHNET 4 — product rebuild

FASHNET is a first-party connection diagnostics product designed to answer more than "how many Mbps?".

## Product ideas
- Quick and Deep test modes
- Real download/upload traffic against the FASHNET Worker
- Base ping, jitter, request-level loss and loaded ping
- Download consistency samples
- Four-dimension quality score: speed, responsiveness, stability, consistency
- Plain-English takeaway and likely bottleneck
- Local test history, trends, CSV export and report download
- Native share plus clipboard fallback
- Live server-side IP/ASN/city/edge metadata
- Browser Network Information API estimates clearly labeled as estimates
- Light/dark themes and responsive/mobile UI

## Deploy

Requires Node.js and a Cloudflare account with Workers access.

```bash
npm install -D wrangler
npx wrangler login
npx wrangler deploy
```

The Worker and static assets are designed to be served from the same origin.

## Accuracy note
The speed result is measured from the user's browser to the deployed FASHNET Worker. It is not a guarantee of an ISP plan's advertised maximum. Wi‑Fi, congestion, routing, browser limits and the deployed edge all influence measurements.
