# Bloodchain Local Setup and Testing (Supabase)

This runbook is the source of truth for local setup. Keycloak is not used.

## 1) Services and ports

- `postgres` on `5432` (local docker)
- `bloodchain-core` on `4000` (default)
- frontends on `5173+` as needed

## 2) Startup order

1. From `bloodchain-core`, start Postgres:
   - `docker compose up -d postgres`
2. Copy `.env.example` to `.env` and set real values.
3. Run backend:
   - `yarn install`
   - `yarn dev`
4. For each frontend, set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (for local: `http://localhost:4000/api/v1`)

## 3) Backend smoke checks

- `GET http://localhost:4000/health` returns `200`.
- Protected route without token returns `401`.
- Protected route with valid Supabase token returns `200` if role allows.

## 4) Pilot-mode constraints

- Disable auth bypass flags in non-local environments.
- Do not rely on localStorage/mock API fallbacks for pilot flows.
- Run `prisma migrate deploy` before starting staging/pilot environments.

## 5) Minimal manual verification flow

1. Provision a user from High Command.
2. Log in with Supabase credentials in operational app.
3. Create/scan/update an asset in Scyther/Mars.
4. Verify admin audit visibility in High Command.
