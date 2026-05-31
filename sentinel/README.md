# Sentinel — Regulatory compliance console

Bloodchain **Sentinel** is a thin Vite/React reviewer workstation for national blood regulators. It does **not** replace [Instances](https://github.com/) (the compliance engine); it consumes Instances APIs for filings while matching the Bloodchain design system.

## Run locally

From monorepo root:

```bash
yarn install
yarn dev:sentinel
```

Open **http://localhost:5181** (demo mode works without backend).

## Connect to Instances

1. Start Instances from `instances-extract/g-instances-main` (see that repo’s README).
2. Create a tenant API key with reviewer permissions.
3. Copy `.env.example` → `sentinel/.env.local`:

```env
VITE_INSTANCES_API_URL=http://localhost:3000
VITE_INSTANCES_API_KEY=your-key
VITE_INSTANCES_ADMIN_URL=http://localhost:3000
```

Sentinel calls:

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/instances` | List filings (patch added in extract) |
| GET | `/api/v1/instances/:id` | Detail |
| POST | `/api/v1/instances/:id/review` | Approve / flag / reject |

## Routes

| Path | Description |
|------|-------------|
| `/` | Command dashboard |
| `/queue` | Submitted filings awaiting decision |
| `/submissions/:id` | Review detail + decision |
| `/templates` | Template catalog (read-only) |
| `/audit` | Audit trail (demo; live via Instances admin) |
| `/settings` | API status + link to Instances console |

## Constellation boundary

- **Instances** — templates, multi-tenant isolation, JWT receipts, file hashes, API keys.
- **Sentinel** — Bloodchain-skinned regulator UX on top of those APIs.
- **Mars Lab / Scyther / Transfuse** — operational blood banking (not regulatory filing).

See `docs/Sentinel-Institutional-Brief.md`.
