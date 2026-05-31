# High Command — National programme cockpit

**High Command** is the Ministry and NBTS **programme command layer** for the Bloodchain national blood OS. It oversees the full **constellation** of modules — collection, laboratory, logistics, hospital transfusion, public portal, chronic care, research, and regulatory compliance — while retaining core governance tools (staff provisioning, master ledger, donor KYC, ministry reporting).

## Run locally

```bash
# From monorepo root
yarn dev:high-command
```

- **http://localhost:5173** — sign in (Supabase ADMIN)  
- **http://localhost:5173?guest=1** — demo director (full seed data, no backend writes)
- Without Supabase in `.env`, demo mode auto-loads the same seeds on **Enter programme cockpit**

## Routes

| Path | Purpose |
|------|---------|
| `/` | National command — supply KPIs, map, wastage, couriers |
| `/constellation` | All eight modules by pillar with demo metrics + links |
| `/users` | Keymaster — staff provisioning |
| `/ledger` | Master custody ledger |
| `/reports` | Ministry reporter |
| `/verifications` | Donor KYC queue (Azure) |

## Constellation boundary

Operational work happens in **Scyther**, **Mars Lab**, **Voyager**, **Transfuse**, **Azure**, **Chronicle**, **Helix**, and **Sentinel**. High Command **coordinates and governs** — it does not replace them.

See `docs/HighCommand-Institutional-Brief.md`.

## Stack

React 19 · Vite · TypeScript · TanStack Query · Tremor · Leaflet · `@bloodchain/ui` tokens · Supabase Auth

## API

Polls `bloodchain-core` `/api/v1/admin/*` (stats, users, ledger, map, wastage).
