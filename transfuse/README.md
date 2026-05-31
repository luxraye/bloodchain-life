# Transfuse — Clinical Transfusion Management

Hospital-side Bloodchain module for **ward inventory visibility**, **blood requests**, **standby donor coordination**, **bedside transfusion verification**, and **haemovigilance** reporting.

## Constellation boundary

| App | Role |
|-----|------|
| **Transfuse** | Hospital requests, crossmatch, transfusion log, adverse events |
| **Mars Lab** | National TTI screening, unit release/discard |
| **Scyther** | Donor collection |
| **Voyager** | Operational cold-chain logistics |
| **Helix** | Clinical trial specimens (not ward stock) |
| **Chronicle** | Chronic disorder registries (longitudinal care) |

## Routes

| Path | View |
|------|------|
| `/inventory` | Stock by type, expiry, quarantine |
| `/requests` | Family/hospital orders, NBTS outbound orders |
| `/standby` | Standby donor pipeline |
| `/transfusion` | Patient + unit scan, crossmatch, commit |
| `/haemovigilance` | Adverse transfusion event register |

## Roles (`app_metadata.role`)

`MEDICAL` · `NURSE` · `DOCTOR` · `CLINICAL` · `LAB_SUPERVISOR` · `ADMIN` · `SUPER_ADMIN`

Demo mode uses `MEDICAL` when Supabase is not configured.

## Run locally

```bash
yarn install
yarn dev:transfuse   # http://localhost:5178
```

Optional: `VITE_API_URL` + Supabase for live `BloodAsset` inventory from `bloodchain-core`.

## Demo transfusion flow

1. **Transfusion log** → patient `PAT-2026-001` … `PAT-2026-005`
2. Scan unit e.g. `TF-2026-0041` (from inventory demo set)
3. Cross-match pass → commit transfusion
4. **Haemovigilance** → report event for committee queue

Patient IDs are institution-scoped references — not national donor identifiers.
