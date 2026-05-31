# Keycloak Decommissioned

Keycloak is no longer part of Bloodchain's active authentication setup.

## Current authentication model

- Identity provider: Supabase Auth
- Backend verification: Supabase JWT (JWKS/secret) in `src/middlewares/requireAuth.ts`
- User provisioning: Supabase Admin API in `src/services/admin.service.ts`

## Required backend environment variables

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- Optional: `SUPABASE_JWT_SECRET` for HS256 token verification

## Local setup summary

1. Start Postgres (`docker compose up -d postgres`) from `bloodchain-core`.
2. Configure `.env` from `.env.example`.
3. Start backend (`npm run dev`).
4. Start frontend apps with matching `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_API_URL`.

This file remains in the repo as an explicit retirement notice to avoid reintroducing Keycloak paths.
