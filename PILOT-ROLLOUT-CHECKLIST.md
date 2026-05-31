# Bloodchain Pilot Rollout Checklist

This checklist is the go/no-go control for pilot rollout after cleanup.

## Phase 0: Freeze and alignment

- [ ] Keycloak references removed from active setup docs.
- [ ] Supabase-only env contract verified across backend and all apps.
- [ ] `VITE_AUTH_BYPASS` disabled for non-development environments.
- [ ] Render deploy is paused until all gates below are green.

## Phase 1: Backend go/no-go

- [ ] `bloodchain-core` has valid `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- [ ] Prisma migrations apply cleanly with `prisma migrate deploy`.
- [ ] `/health` returns `200`.
- [ ] RBAC paths validate expected roles (`ADMIN`, `SUPER_ADMIN`, `LAB`, `MEDICAL`, `TRANSIT`, `LOGISTICS_COMMAND`, `MOH_AUDITOR`, `PUBLIC`).
- [ ] Lab routes no longer depend on undefined roles.

## Phase 2: Admin control plane (High Command)

- [ ] Login works via Supabase.
- [ ] User provisioning works end-to-end.
- [ ] Identity verification queue reads real users and approve/reject persists through API.
- [ ] No mock fallback content is shown on API failure.

## Phase 3: Operations apps

- [ ] Scyther writes collection records to backend only (no localStorage phantom backend).
- [ ] Mars lab discard verification requires configured supervisor credential.
- [ ] Voyager fetches and scans assets using authenticated API requests.
- [ ] All apps sign out consistently on HTTP 401 responses.

## Phase 4: Donor app (Azure)

- [ ] Profile + donation history read from backend.
- [ ] Verification document flow stores in Supabase and updates trust state.
- [ ] Placeholder-only donor features are explicitly blocked (no silent mock returns).

## Phase 5: Deployment readiness

- [ ] CI workflow passes (`.github/workflows/pilot-gates.yml`).
- [ ] Build/lint passes per app in a clean environment.
- [ ] Staging smoke run covers: donor/profile -> collection -> lab -> logistics -> admin audit.
- [ ] Secrets are injected by environment (no plaintext credentials in tracked files).

## Rollout order

1. `bloodchain-core` + `high-command`
2. `scyther` + `mars-lab`
3. `voyager`
4. `azure`
