# Netlify deployment (constellation frontends)

Static apps deploy on **Netlify**. **Render** hosts only `bc-api` + Postgres ([`render.yaml`](../render.yaml)).

## Create sites (one per app)

From the same GitHub repo, add **10 sites** in Netlify → **Add new site** → **Import an existing project**.

| Netlify site (suggested name) | Base directory | Custom domain |
|-----------------------------|----------------|---------------|
| bc-demo-hub | `demo-hub` | `bloodchain.life` |
| bc-high-command | `high-command` | `command.bloodchain.life` |
| bc-mars-lab | `mars-lab` | `mars.bloodchain.life` |
| bc-voyager | `voyager` | `voyager.bloodchain.life` |
| bc-scyther | `scyther` | `scyther.bloodchain.life` |
| bc-azure | `azure` | `azure.bloodchain.life` |
| bc-transfuse | `transfuse` | `transfuse.bloodchain.life` |
| bc-helix | `helix` | `helix.bloodchain.life` |
| bc-chronicle | `chronicle` | `chronicle.bloodchain.life` |
| bc-sentinel | `sentinel` | `sentinel.bloodchain.life` |

Each app folder includes a [`netlify.toml`](../demo-hub/netlify.toml) with build command, `publish = dist`, and SPA redirects.

**Build settings:** Netlify reads `netlify.toml` in the base directory. Set **Base directory** to the folder in the table (e.g. `demo-hub`).

## Environment variables

Copy [`netlify.env.example`](./netlify.env.example) into each site (or use Netlify **Environment variables** → **Import**).

Required on **every** app that calls the API or Supabase:

- `VITE_API_URL` — Render API, e.g. `https://bc-api-lu8j.onrender.com/api/v1` (no trailing path beyond `/api/v1`)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Demo hub** and **high-command** also need cross-app URLs (`VITE_*_URL`). See the example file.

`VITE_*` values are baked in at **build** time — trigger **Deploy** after changing env.

Optional:

- `mars-lab`: `VITE_SUPERVISOR_PIN`
- `sentinel`: `VITE_INSTANCES_API_URL`, `VITE_INSTANCES_API_KEY`, `VITE_INSTANCES_ADMIN_URL`

## DNS

1. Netlify → each site → **Domain management** → add the custom domain from the table.
2. If `bloodchain.life` uses **Netlify DNS**, set nameservers at your registrar to Netlify.
3. Otherwise, at your registrar (or Netlify DNS for the zone), add the records Netlify shows (apex ALIAS/A + subdomain CNAMEs to `*.netlify.app`).

The API stays on Render at `https://<service>.onrender.com` — you do **not** need `api.bloodchain.life` unless you add a Render custom domain (Hobby: 2 slots account-wide).

## Smoke test

- `https://<bc-api-host>.onrender.com/health` → JSON `operational`
- `https://bloodchain.life` → demo hub
- `https://mars.bloodchain.life` → Mars Lab (requires sign-in)
- High Command → users load (Network tab → API host is `*.onrender.com`)

See also [DNS-bloodchain.life.md](./DNS-bloodchain.life.md) and Supabase redirect URLs there.
