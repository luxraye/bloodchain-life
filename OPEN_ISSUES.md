# Bloodchain — Open Issues
*Consolidated from: HANDOVER.md, currentstatus.md, PILOT-ROLLOUT-CHECKLIST.md*  
*Last updated: 2026-05-08*

Priority levels: `NOW` (current sprint) · `NEXT` (next sprint) · `LATER` (backlog) · `DROPPED`

---

## CRITICAL / BLOCKING

| # | Issue | Source | Priority |
|---|-------|--------|----------|
| C1 | System has never been deployed end-to-end — Render deploy paused | currentstatus.md | NOW |
| C2 | No API smoke tests or RBAC matrix tests in CI | currentstatus.md | NOW |
| C3 | Staging migration (`prisma migrate deploy`) never verified against a real DB | pilot checklist | NOW |
| C4 | Supervisor PIN verification accepts any 4+ digit PIN — clinical safety gap | HANDOVER.md | NOW |
| C5 | Secrets audit not completed — confirm no credentials in tracked files | currentstatus.md | NOW |

---

## HIGH — Product Completeness

| # | Issue | Source | Priority |
|---|-------|--------|----------|
| H1 | Scyther: ISBT-128 formatting missing from Phlebotomy finalize summary | HANDOVER.md Mission 3 | NOW |
| H2 | Scyther: "Scan with Camera" button missing from Phlebotomy bag barcode input | HANDOVER.md Mission 3 | NOW |
| H3 | Design sync: High Command status badges not aligned to Red/Amber/Green clinical system | HANDOVER.md Mission 4 | NEXT |
| H4 | Design sync: Scyther inventory/screening badges not aligned | HANDOVER.md Mission 4 | NEXT |
| H5 | Design sync: Voyager job status badges not aligned | HANDOVER.md Mission 4 | NEXT |
| H6 | Azure: donor profile + donation history not fully wired to backend | currentstatus.md | NEXT |
| H7 | Azure: verification document flow (Supabase storage + trust state update) not wired | pilot checklist | NEXT |
| H8 | Azure: placeholder donor features return silent mocks — need explicit "not implemented" | currentstatus.md | NEXT |
| H9 | Backend: `parentAssetId` + `componentType` fields missing from BloodAsset schema (component splitting cannot persist) | HANDOVER.md | NEXT |
| H10 | Structured logging not standardized across all bloodchain-core controllers | currentstatus.md | NEXT |
| H11 | API error envelope not normalized across controllers | currentstatus.md | NEXT |

---

## MEDIUM — Quality & Operations

| # | Issue | Source | Priority |
|---|-------|--------|----------|
| M1 | `voyager/dist` generated artifact in working tree — dirty workspace | currentstatus.md | NOW |
| M2 | HANDOVER.md references Keycloak-era architecture — stale, needs update or archive | currentstatus.md | NEXT |
| M3 | Operational runbook missing (incident triage, migration rollback, auth troubleshooting) | currentstatus.md | NEXT |
| M4 | Demo Hub still references Render URL model in launcher config comments | currentstatus.md | NEXT |
| M5 | CI workflow (`pilot-gates.yml`) exists but backend smoke/RBAC/e2e depth is insufficient | currentstatus.md | NEXT |
| M6 | No release checklist enforcement in PR process | currentstatus.md | LATER |
| M7 | Scyther + Voyager still in JavaScript — TypeScript migration incomplete | HANDOVER.md | LATER |

---

## LOW — Future Features

| # | Issue | Source | Priority |
|---|-------|--------|----------|
| L1 | Hyperledger Fabric integration (feature-flagged, design exists) | fabricrollback.md | LATER |
| L2 | Multi-tenancy architecture (required for multi-institution / multi-country scale) | Master Plan | LATER |
| L3 | Analytics / reporting module for MoH-level buyers | Master Plan | LATER |
| L4 | PWA / mobile camera barcode scanning (placeholder button exists in Mars Lab) | HANDOVER.md | LATER |
| L5 | Azure public client split from staff client (Keycloak-era backlog item, still valid for Supabase) | HANDOVER.md | LATER |
| L6 | API marketplace / hospital integration tier | Master Plan | LATER |

---

## DROPPED

| # | Issue | Reason |
|---|-------|--------|
| D1 | Keycloak theme (`keycloak-theme/bloodchain/login/`) | Keycloak decommissioned; Supabase auth is current standard |
| D2 | `scratch/` directory references in HANDOVER.md | Old repo layout; all apps now in constellation monorepo |
