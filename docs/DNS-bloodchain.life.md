# bloodchain.life — DNS & custom domains

Production URLs are wired in [`render.yaml`](../render.yaml) (`domains` per service + `bc-demo-hub-links` env group).

| Public URL | Render service | DNS record type |
|------------|----------------|-----------------|
| https://bloodchain.life | `bc-demo-hub` | Apex — see below |
| https://www.bloodchain.life | `bc-demo-hub` | Auto-redirect from apex (Render) |
| https://api.bloodchain.life | `bc-api` | CNAME → `bc-api.onrender.com` |
| https://command.bloodchain.life | `bc-high-command` | CNAME → `bc-high-command.onrender.com` |
| https://mars.bloodchain.life | `bc-mars-lab` | CNAME → `bc-mars-lab.onrender.com` |
| https://voyager.bloodchain.life | `bc-voyager` | CNAME → `bc-voyager.onrender.com` |
| https://scyther.bloodchain.life | `bc-scyther` | CNAME → `bc-scyther.onrender.com` |
| https://azure.bloodchain.life | `bc-azure` | CNAME → `bc-azure.onrender.com` |
| https://transfuse.bloodchain.life | `bc-transfuse` | CNAME → `bc-transfuse.onrender.com` |
| https://helix.bloodchain.life | `bc-helix` | CNAME → `bc-helix.onrender.com` |
| https://chronicle.bloodchain.life | `bc-chronicle` | CNAME → `bc-chronicle.onrender.com` |
| https://sentinel.bloodchain.life | `bc-sentinel` | CNAME → `bc-sentinel.onrender.com` |

## 1. Sync Blueprint on Render

After pushing `render.yaml`:

1. Render Dashboard → your **Blueprint** → **Sync**.
2. Each service → **Settings** → **Custom Domains** should list the domain above.
3. Render shows the exact **CNAME target** (use that value, not a guess).

## 2. Configure DNS at your registrar

### Apex: `bloodchain.life` → demo hub

Pick one (depends on your DNS host):

- **ANAME / ALIAS** → `bc-demo-hub.onrender.com` (Cloudflare, DNSimple, etc.)
- **A record** → `216.24.57.1` (Render load balancer) if ALIAS is not supported

Render will issue TLS for `bloodchain.life` once DNS verifies.

### Subdomains (all other apps + API)

For each row in the table, add:

| Type | Name / Host | Value |
|------|-------------|--------|
| CNAME | `api` | `bc-api.onrender.com` |
| CNAME | `mars` | `bc-mars-lab.onrender.com` |
| CNAME | `helix` | `bc-helix.onrender.com` |
| CNAME | `voyager` | `bc-voyager.onrender.com` |
| CNAME | `scyther` | `bc-scyther.onrender.com` |
| CNAME | `azure` | `bc-azure.onrender.com` |
| CNAME | `transfuse` | `bc-transfuse.onrender.com` |
| CNAME | `chronicle` | `bc-chronicle.onrender.com` |
| CNAME | `sentinel` | `bc-sentinel.onrender.com` |
| CNAME | `command` | `bc-high-command.onrender.com` |

Use the hostname Render shows in the dashboard if it differs.

Propagation can take up to 48 hours; often minutes.

## 3. Redeploy after DNS is verified

`VITE_*` URLs are set at **build** time from `render.yaml` env groups.

1. Wait until custom domains show **Verified** in Render.
2. **Manual Deploy** → **bc-demo-hub** (and any static app you changed secrets on).
3. **Manual Deploy** → **bc-api** (CORS update for `*.bloodchain.life`).

## 4. Supabase (required for auth)

In Supabase → **Authentication** → **URL configuration**, add:

**Site URL:** `https://bloodchain.life`

**Redirect URLs** (add each):

```
https://bloodchain.life/**
https://azure.bloodchain.life/**
https://command.bloodchain.life/**
https://mars.bloodchain.life/**
https://voyager.bloodchain.life/**
https://scyther.bloodchain.life/**
https://transfuse.bloodchain.life/**
https://helix.bloodchain.life/**
https://chronicle.bloodchain.life/**
https://sentinel.bloodchain.life/**
```

Keep `http://localhost:*` entries for local dev.

## 5. Smoke test

- https://bloodchain.life — demo hub carousel
- https://mars.bloodchain.life?guest=1 — Mars Lab
- https://api.bloodchain.life/health — API JSON

## Optional: disable `*.onrender.com`

In `render.yaml`, per service add `renderSubdomainPolicy: disabled` only after custom domains are verified (Render requires at least one custom domain).
