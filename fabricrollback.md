# Fabric Rollback Plan (Pre-Migration Guardrail)

This document defines the rollback procedure for the **full migration** to a Hyperledger Fabric-backed public blood transaction ledger.

Scope: rollback from Fabric to the current centralized ledger path with minimal downtime and no secret leakage.

## 0) Bloodchain constellation — “last known good” map

Primary services in this repo (pin deployments and lockfiles per app):

| App / service | Path | Role |
|---------------|------|------|
| API + Prisma DB | [`bloodchain-core/`](bloodchain-core/) | Source of truth for `ActionLog` / custody today; future Fabric adapter lives here. |
| Donor portal | [`azure/`](azure/) | Public UI; may expose “public ledger” views. |
| Admin | [`high-command/`](high-command/) | Master Ledger UI → [`high-command/src/components/ledger/MasterLedger.tsx`](high-command/src/components/ledger/MasterLedger.tsx) (reads admin ledger API). |
| Collection | [`scyther/`](scyther/) | Clinical / collection flows. |
| Lab | [`mars-lab/`](mars-lab/) | Lab processing. |
| Logistics | [`voyager/`](voyager/) | Transit / custody handoff. |
| Launcher | [`demo-hub/`](demo-hub/) | Optional dev launcher. |

Environment templates (no secrets in git):

- [`bloodchain-core/.env.example`](bloodchain-core/.env.example) — copy to `bloodchain-core/.env` locally (never commit `.env`).
- Each frontend may use `.env`, `.env.local` — see [Secret and API-Key Safekeeping](#3-secret-and-api-key-safekeeping).

### Current ledger implementation (before Fabric)

Today’s “Master Ledger” / audit trail is **Postgres-backed**, not a blockchain:

- Service: [`bloodchain-core/src/services/ledger.service.ts`](bloodchain-core/src/services/ledger.service.ts) reads model `ActionLog` (table `action_logs`).
- Custody history: model `CustodyEvent` → table `custody_events`.
- Assets: model `BloodAsset` → table `blood_assets`.

**Rollback semantics:** After Fabric cutover, reverting means routing the API and UIs back to this Postgres path via feature flags and redeploy (see sections 4–6). No on-chain proof is implied until Fabric is actually wired.

**Naming clarity:** A **“public ledger”** screen is a *product* surface (read-only transparency UI). **On-chain proof** means a transaction or event anchored in Fabric with verifiable block/tx identity. Do not label UI-only lists as blockchain-backed until the Fabric read path is live and tested.

### Prisma table names (PostgreSQL)

Aligned with [`bloodchain-core/prisma/schema.prisma`](bloodchain-core/prisma/schema.prisma):

| Model | Table (`@@map`) |
|--------|------------------|
| `ActionLog` | `action_logs` |
| `CustodyEvent` | `custody_events` |
| `BloodAsset` | `blood_assets` |

Add any **new** reconciliation or Fabric-bridge tables introduced during migration to baseline exports and rollback checks.

### Baseline commands (run from repo root; fill in timestamps and contexts)

**Git — tag last known good before Fabric code lands:**

```bash
git checkout main   # or your release branch
git pull
git branch pre-fabric-migration-backup
git tag pre-fabric-cutover-YYYYMMDD-HHMM
git push origin pre-fabric-migration-backup
git push origin pre-fabric-cutover-YYYYMMDD-HHMM
```

**Prisma — record migration state (`bloodchain-core`):**

```bash
cd bloodchain-core
yarn install
yarn prisma migrate status
# Note the output; after deploys use: yarn prisma migrate deploy
```

**Optional — logical SQL snapshots (Supabase SQL editor or `pg_dump`):**

Export at minimum: `action_logs`, `custody_events`, `blood_assets` (and any new tables). Store dumps only in secure storage, not in git.

## 1) Rollback Triggers

Execute rollback if any of the following occurs after cutover:

- Fabric peer/orderer instability or sustained transaction commit failures.
- Ledger API error rate above agreed threshold for 15+ minutes.
- Inability to prove end-to-end transaction consistency between API and Fabric blocks.
- Security or compliance incident affecting key material, MSPs, or channel config.
- Public explorer shows incorrect or unverifiable transaction states.

## 2) Pre-Change Safety Baseline (Do This Before Any Code Changes)

- Create a protected branch/tag:
  - Branch: `pre-fabric-migration-backup`
  - Tag: `pre-fabric-cutover-YYYYMMDD-HHMM`
- Export baseline data snapshots:
  - `action_logs`
  - `custody_events`
  - `blood_assets`
  - any reconciliation tables created for migration
- Capture deployment artifacts:
  - current app image digests
  - environment manifests
  - lockfiles (`yarn.lock` / `package-lock.json` per app)
  - current DB migration state (`yarn prisma migrate status` in `bloodchain-core`)

## 3) Secret and API-Key Safekeeping

If code files currently contain secrets/API keys, move them to a temporary secure location **before migration work**.

### Candidate files (never commit contents)

| Location | Notes |
|----------|--------|
| `bloodchain-core/.env` | `DATABASE_URL`, `SUPABASE_*`, JWT/service keys. |
| `azure/.env`, `azure/.env.local` | `VITE_*`, API base URLs, Supabase anon. |
| `high-command/.env*` | Admin API URLs, tokens. |
| `scyther/.env*`, `mars-lab/.env*`, `voyager/.env*`, `demo-hub/.env*` | Same pattern. |
| `.cursor/mcp.json` | Often project ref URLs; treat as ops metadata—do not publish unnecessarily. |

Recommended process:

1. Create a local, non-tracked secure folder:
   - `.secrets-backup/fabric-pre-migration/` (ignored at repo root — see root [`.gitignore`](.gitignore))
2. Copy secret-bearing files into that folder (do not delete originals until verified copied).
3. Replace in-repo secret values with env references/placeholders **only in files that are safe to commit**; never leave production secrets in tracked source.
4. Ensure `.secrets-backup/` is ignored by git (root `.gitignore`).
5. Record SHA-256 checksums of backed-up files in a **local-only** note (not committed).

Never commit:

- private keys
- connection profiles with credentials
- Supabase **service role** keys in frontend or public repos
- TLS enrollment material
- wallet identities
- Hyperledger Fabric MSP directories, `keystore/`, `signcerts/`, or `connection-*.json` with embedded certs/keys
- chaincode package binaries if they embed secrets (unusual; still avoid)

## 4) Rollback Strategy

Use a two-switch rollback:

- **Switch A (runtime):** disable Fabric write/read path via feature flags.
- **Switch B (deploy):** redeploy last known-good pre-Fabric images/configs.

Target RTO: <= 30 minutes (final value to be agreed during rehearsal).

## 5) Feature Flags Required

Define and verify these flags before cutover:

- `LEDGER_BACKEND=fabric|postgres`
- `FABRIC_WRITE_ENABLED=true|false`
- `FABRIC_READ_ENABLED=true|false`
- `PUBLIC_LEDGER_ENABLED=true|false`

Rollback default:

- `LEDGER_BACKEND=postgres`
- `FABRIC_WRITE_ENABLED=false`
- `FABRIC_READ_ENABLED=false`
- `PUBLIC_LEDGER_ENABLED=false` (or read from postgres-compatible endpoint only)

## 6) Operational Rollback Procedure

1. Announce incident and freeze writes for admin-only critical operations if needed.
2. Flip feature flags to postgres path.
3. Redeploy API and frontend with pre-cutover artifact set.
4. Stop Fabric-facing workers/consumers.
5. Verify API health and ledger endpoints.
6. Run reconciliation:
   - compare latest transaction IDs in API vs baseline DB snapshots
   - verify no partial writes left in app path
7. Reopen normal operations after validation.

## 7) Data Recovery and Reconciliation

After rollback:

- Recover missing transactions from write-ahead logs / pending queues (if any).
- Mark Fabric-only accepted transactions not visible in postgres as `reconcile_pending`.
- Produce a signed incident report:
  - time window
  - affected transaction IDs
  - user impact
  - corrective action

## 8) Validation Checklist (Rollback Complete)

- `GET /health` green for all services (`bloodchain-core` and any gateway).
- Ledger/admin endpoints return expected data from postgres source ([`ledger.service.ts`](bloodchain-core/src/services/ledger.service.ts) / `GET /admin/ledger` as implemented).
- Public ledger page either disabled or clearly indicates maintenance mode.
- No secrets present in tracked code.
- Authentication and authorization unchanged from pre-migration behavior.
- Synthetic transaction test passes end-to-end.

## 9) Rehearsal Requirement

Before production migration:

- Run at least one **full rollback drill in staging** (Fabric on → flags → Postgres-only).
- Time each rollback step and record bottlenecks.
- Update this file with exact command references and owning team members.

### Staging rollback drill — minimum success criteria

Complete all of the following in **staging** before production cutover:

1. **API:** `GET http://localhost:4000/health` (or staging URL) returns `200` after flags point to Postgres.
2. **Admin ledger:** `GET /api/v1/admin/ledger` (or equivalent) returns paginated rows sourced from `action_logs` with expected shape for High Command’s [`MasterLedger`](high-command/src/components/ledger/MasterLedger.tsx) consumer.
3. **Synthetic write:** Perform one controlled action that appends an `ActionLog` (or equivalent) in Postgres and confirm it appears in the admin ledger query.
4. **Public surface:** If a public ledger UI exists, it either reads Postgres-backed data or shows explicit “maintenance / not blockchain-verified” copy—no false claims.
5. **Secrets:** `git status` clean of `.secrets-backup/` and no new tracked `.env` files.

Record: date, duration, participants, and any blockers.

## 10) Owners

Populate before execution (use `TBD` until assigned):

- Migration Lead: TBD
- Fabric Ops Owner: TBD
- API Owner: TBD
- Security Owner: TBD
- Incident Commander: TBD
