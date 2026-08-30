# FASHNET — Vercel-ready build

This is the Vercel-ready version of FASHNET.

## Repository structure

- `index.html` — site entry point
- `app.js` — browser test client
- `styles.css` — UI
- `api/` — first-party Vercel speed-test endpoints
- `vercel.json` — deployment config
- `worker.js` / `wrangler.cloudflare.jsonc` — optional Cloudflare Worker version, not required for Vercel

## Vercel

Import the GitHub repository as a Vercel project using the repository root.

Do not set an output directory such as `public`.
Do not add a build command.

The `/api/*` routes are part of this same deployment, so the browser calls the same-origin FASHNET API instead of `speed.cloudflare.com`.

## Test endpoints

- `/api/health`
- `/api/info`
- `/api/ping`
- `/api/down?bytes=...`
- `/api/up` (POST)

If `/api/health` returns `{ "ok": true, ... }`, the FASHNET backend is live.
