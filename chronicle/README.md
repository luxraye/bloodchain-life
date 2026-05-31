# Chronicle — Care Coordinator Workstation

Bloodchain module for **chronic blood disorder population health**: cohort surveillance, care gaps, exception outreach, longitudinal care plans, and registry reporting for haemophilia, sickle cell disease, and thalassaemia.

## Design system

Chronicle uses the shared Bloodchain tokens (`burgundy` primary, `azure` secondary, dark base `#07090F`). **Amber (`#FFB800`) is semantic only** — chronic-care badges, reviews due, cohort highlights — not primary buttons.

Styles: `@bloodchain/ui` globals via [packages/ui](../packages/ui) + app utilities in `src/index.css`.

## Constellation boundary

| App | Role |
|-----|------|
| **Chronicle** | Cohorts, care gaps, coordinator exceptions, care plans, factor lots, BPOMAS population export |
| **Transfuse** | Acute hospital transfusion, crossmatch, haemovigilance |
| **High Command** | National blood supply, wastage, MoH oversight (aggregates only from registry API later) |
| **Helix** | Clinical trial specimens |
| **Azure** | Patient portal slice (planned) |

## Routes (coordinator-first)

| Path | View |
|------|------|
| `/` | Command dashboard — priority exceptions first |
| `/exceptions` | Exception queue — outreach workflow |
| `/patients` | Patient registry — search & filter |
| `/patients/:patientId` | Patient chart — overview, care plan, transfusions, gaps, audit |
| `/cohorts` | Cohort definitions (demo rules) |
| `/discrepancies` | Problem list vs billing data quality |
| `/reports` | Patient · Exception · Progress · Population CSV exports |

## Roles

`CHRONIC_CARE_COORDINATOR` · `MEDICAL` · `NURSE` · `ADMIN` · `SUPER_ADMIN`

Demo uses `CHRONIC_CARE_COORDINATOR` when Supabase is not configured.

## Run locally

```bash
# from bloodchain-constellation-main
yarn install
yarn dev:chronicle   # http://localhost:5180
```

Optional API:

```bash
# bloodchain-core + migrate
VITE_API_URL=http://localhost:4000 yarn dev:chronicle
```

Endpoints: `GET /api/v1/chronic-registry/patients`, `GET /api/v1/chronic-registry/exceptions`, `PATCH /api/v1/chronic-registry/exceptions/:id`

## Demo workflow

1. Open **Command** → review high-severity exceptions  
2. **Exceptions** → assign / mark contacted  
3. **Patients** → open chart → edit care plan, resolve gaps  
4. **Reports** → download population CSV for BPOMAS-style conversation  

Twelve seeded patients · six open exceptions · institution-scoped IDs (`CHR-YYYY-####`) only.

See `docs/Chronicle-Institutional-Brief.md` for partner outreach.
