# bloodchain.life — DNS & Render (Hobby-friendly)

## Layout

| Service | Public URL | Custom domain on Render |
|---------|------------|-------------------------|
| Demo hub | `https://bloodchain.life` | **Yes** (use your 1–2 Hobby slots here) |
| bc-api | `https://bc-api-xxxx.onrender.com` | No |
| Mars, Helix, Command, … | `https://bc-<app>.onrender.com` | No — share these URLs directly when pitching |

The **demo hub** is marketing only (carousel, services, about, contact). It does **not** link to module apps. You send `*.onrender.com` app URLs to prospects yourself.

## Deploy

1. Push [`render.yaml`](../render.yaml) → Blueprint **Sync**.
2. **bc-api** → set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` → copy service URL.
3. **Env group `bc-vite-api`** → set `VITE_API_URL` to `https://<bc-api-host>/api/v1` → redeploy static apps that use the API.
4. **bc-demo-hub** → attach `bloodchain.life` only → DNS per Render (apex ALIAS or CNAME).
5. Do **not** add `www` unless you want to spend a second Hobby domain slot.

## Why the demo hub looked broken on `bc-demo-hub.onrender.com`

An old deploy often published **without a proper monorepo build**, so Tailwind/CSS never loaded (white page, plain text). The blueprint now runs:

`cd .. && yarn install && yarn workspace demo-hub build`

After sync, open the **latest** deploy log; the site should be dark-themed with hero, carousel, and all sections.

## Supabase redirects

**Site URL:** `https://bloodchain.life`

Add redirect URLs for each `*.onrender.com` app host you use in briefings, e.g. `https://bc-mars-lab.onrender.com/**`, plus `https://bloodchain.life/**`.

## Smoke test

- `https://bloodchain.life` — full marketing site, no “Open app” / QR links
- `https://<bc-api-host>/health` — API JSON
- `https://bc-mars-lab.onrender.com` — login required (no `?guest=1`)
