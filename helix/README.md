# Helix — Research & Clinical Trials

Bloodchain module for **study governance, participant enrolment, research specimen custody, and IRB-ready exports**. Standalone from NBTS operational apps (Scyther, Mars Lab, Transfuse).

## Constellation boundary

Helix owns **trial protocol context** and **research specimens**. It does **not** replace:

- **Mars Lab** — national TTI, release/discard, analyzer operations on `BloodAsset`
- **Scyther** — donor collection
- **Transfuse** — hospital transfusion
- **Voyager** — operational cold-chain logistics

See `docs/Helix-Institutional-Brief.md` for partner-facing language.

## CDC / public-health LIMS alignment (v1 scope)

Mapped from clinical-trial lab requirements into Helix tabs (demo + API schema):

| Domain | Helix surface | Not in Helix v1 |
|--------|---------------|-----------------|
| Pre-analytical | Accession, receipt QC, aliquots | Full LIS order entry |
| Custody | Status chain, actor/location audit | National unit logistics (Voyager) |
| Analytical | Research worksheets, QC hold | National TTI panels (Mars Lab) |
| Verification | IRB export, ALCOA+ action log | HL7/FHIR, analyzer bidirectional |

## v1 views

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `StudiesDashboard` | List studies; select active study |
| `/studies/:studyId` | `StudyDetail` | Tabs: overview, participants, pre-analytical, custody, analytical, audit |
| `/studies/:studyId/export` | `IrbExport` | CSV + summary packet for ethics review |

## Specimen status enum

`REGISTERED` → `COLLECTED` → `IN_TRANSIT` → `RECEIVED_BIOBANK` → `ALIQUOTED` → `IN_ANALYSIS` → `ARCHIVED` | `DESTROYED`

## Study status enum

`DRAFT` → `IRB_APPROVED` → `ACTIVE` → `CLOSED`

## Consent status enum

`PENDING` | `SIGNED` | `WITHDRAWN`

## Roles (Supabase `app_metadata.role`)

| Role | Access |
|------|--------|
| `RESEARCH_PI` | Full study management, exports |
| `RESEARCH_COORDINATOR` | Enrolment, specimens, custody |
| `RESEARCH` | Field staff — collection events |
| `ETHICS_READ` | Read-only audit + export |
| `ADMIN` / `SUPER_ADMIN` | Bypass (constellation standard) |

Demo mode uses `RESEARCH_PI` when Supabase is not configured.

## UI / branding

Colours follow `bloodchain_design_system_preview.html` (burgundy `#A81F38`, azure `#3A82B8`, dark base `#07090F`).

Logo: `public/branding/logo.svg` via `BrandLogo.jsx` (fallback icon if missing). Copy `logo.png` from demo-hub when available.

## Run locally

```bash
# from bloodchain-constellation-main
yarn install
yarn dev:helix   # http://localhost:5179
```

### API (Phase 2)

```bash
# core API
cd bloodchain-core
npx prisma migrate dev   # applies Study / ResearchSample models
yarn dev                 # port 4000

# helix
VITE_API_URL=http://localhost:4000 yarn dev:helix
```

Endpoints:

- `GET /api/v1/research/studies`
- `GET /api/v1/research/studies/:id`

Helix falls back to seeded demo data when the API is empty or unreachable.

## Data boundary

Research specimens (`ResearchSample`) are **not** `BloodAsset` unless explicitly linked via `bloodAssetId` (optional bridge for donation-derived samples).
