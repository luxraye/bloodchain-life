# Bloodchain Current Status

Last updated: 2026-03-27

## Executive Summary

Bloodchain is in a strong pre-pilot hardening state. The platform is now aligned around **Supabase auth** (Keycloak decommissioned in active setup), core cross-app auth behavior is standardized, pilot-critical mock/fallback paths were removed or disabled, and lint gates are currently passing across all active frontend apps.

Deployment is intentionally paused while cleanup stabilizes, which matches current direction.

## What Bloodchain Is

Bloodchain is a multi-application national blood supply chain system:

- `bloodchain-core`: shared API + data model + auth verification
- `high-command`: admin/governance and oversight
- `scyther`: collection and clinical flows
- `mars-lab`: lab screening/processing
- `voyager`: logistics/transit visibility
- `azure`: donor/public portal
- `demo-hub`: launcher for constellation apps

Backend routes are mounted under:

- `/admin`
- `/assets`
- `/profile`
- `/register`
- `/activity`
- `/lab`

## Current Technical Posture

### 1) Auth and Access Control

Current source of truth is Supabase:

- Backend validates Supabase JWT/JWKS (`requireAuth`)
- Frontends use Supabase sessions in shared auth/client patterns
- Auth bypass is now constrained to development paths
- Keycloak setup docs were replaced with a decommission notice and Supabase-first local setup

### 2) Backend Status (`bloodchain-core`)

Current state:

- Env contract hardened with fail-fast behavior for required vars
- Role mismatch addressed for lab route guards
- Supabase-only local setup documented
- Docker compose simplified to Postgres local dependency (no Keycloak runtime)

Still needed before pilot go-live:

- Final structured logging standardization everywhere
- API smoke tests and RBAC matrix tests in CI
- Staging migration verification (`prisma migrate deploy`) as required gate

### 3) Frontend Status by App

#### High Command

- KYC queue now uses real data path and real mutation path for approve/reject
- Auth/session behavior aligned with other apps
- Lint pass clean

#### Scyther

- Phantom/localStorage API adapter replaced with real authenticated API behavior
- Pilot-path simulation controls were disabled for sensitive collection/transfusion interactions
- Lint pass clean

#### Mars Lab

- Supervisor discard verification no longer uses hardcoded PIN; now env-driven
- Mock dataset reduced to empty default
- Auth/session behavior aligned
- Lint pass clean

#### Voyager

- Auth/session behavior aligned
- Missing ESLint toolchain/config added
- Lint pass clean

#### Azure

- Supabase config hardened (no placeholder client fallback)
- Donor service placeholders moved toward explicit "not implemented" signaling for non-wired endpoints
- Auth/session behavior aligned
- Lint pass clean

#### Demo Hub

- Build/lint healthy
- Still references Render-oriented URL model in launcher configuration comments and env assumptions

## Quality Gates Snapshot

### Lint

Current status: **passing** in:

- `azure`
- `high-command`
- `scyther`
- `mars-lab`
- `voyager`
- `demo-hub`

### Build

Recent builds completed successfully across apps during cleanup runs, but some generated artifacts changed in working tree (notably `voyager/dist`), indicating the workspace is dirty and should be normalized before release branch cut.

### CI

A baseline CI workflow exists at:

- `.github/workflows/pilot-gates.yml`

It provides a minimum quality gate foundation, but backend smoke/RBAC/e2e depth should be expanded before pilot production go/no-go.

## Deployment Status

Current deployment intent:

- Render config still exists in `render.yaml`
- Team direction is to **pause redeploy** until cleanup is finalized

Current recommendation:

- Keep Render definitions as reference only
- Do not redeploy until staging checklist is fully green
- Reintroduce deployment in phased order (backend + high-command first)

## Known Risks / Gaps

1. **Dirty workspace and generated artifacts**
   - `voyager/dist` changed due local build output
2. **Some functionality intentionally blocked pending real backend endpoints**
   - Especially in donor-side auxiliary flows
3. **Legacy documentation drift still present in older handover content**
   - `HANDOVER.md` still references Keycloak-era architecture and paths
4. **Security/process hygiene still needs final pass**
   - Ensure no real secrets in tracked files and rotate any previously exposed values
5. **Testing depth is still limited**
   - Lint/build is good, but pilot confidence requires smoke + workflow tests

## Recommended Next Steps (Priority Order)

### P0 (must-do before pilot staging sign-off)

1. Finalize and run full **staging smoke script**:
   - donor/profile -> collection -> lab -> logistics -> admin audit
2. Add/verify backend API smoke tests:
   - auth rejection/acceptance
   - route-level RBAC checks
   - critical lifecycle endpoints
3. Clean release surface:
   - remove or ignore generated `dist` artifacts from active diff
   - confirm only intended source/config/docs changes remain

### P1 (high-value hardening)

4. Normalize API error envelope and logging across all critical controllers
5. Complete donor-side real endpoint wiring for currently blocked features
6. Create/update one canonical architecture and runbook doc replacing stale handover assumptions

### P2 (pilot operations readiness)

7. Add operational runbook:
   - incident triage
   - migration rollback strategy
   - auth/session troubleshooting
8. Add release checklist enforcement in PR process

## Pilot Rollout Order (Current Best Path)

1. `bloodchain-core` + `high-command`
2. `scyther` + `mars-lab`
3. `voyager`
4. `azure`

This sequence matches operational criticality and reduces blast radius.

## Current Working Tree Snapshot

The repository currently contains substantial in-progress modifications related to pilot cleanup and lint standardization, including:

- backend auth/env/docs hardening
- frontend auth and API-client alignment
- mock/fallback reduction
- CI workflow introduction
- lint configuration normalization

Before pilot branch cut, perform one explicit "release hygiene" pass to separate:

- source-of-truth product changes
- local/generated artifacts
- optional tooling/config adjustments

---

If needed, this file can be followed by a machine-checkable `go-no-go.md` where each gate has: owner, evidence link, status, and sign-off timestamp.
