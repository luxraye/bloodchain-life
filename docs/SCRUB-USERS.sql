-- =============================================================================
-- Bloodchain — scrub real users (Render Postgres / Prisma DB)
-- =============================================================================
--
-- RUN THIS ON: bc-infra-db (Render → Connect → psql), NOT in Supabase SQL editor
--   unless you only want auth.* changes (see Part B below).
--
-- This script:
--   • Removes operational data tied to users (units, custody, dispatches, logs)
--   • Deletes ALL rows in public.users
--   • Re-inserts giftjrnakedi@gmail.com as SUPER_ADMIN in Postgres
--
-- It does NOT remove Supabase Auth users by itself. After this, do Part B or
-- provision via High Command once you can sign in.
--
-- BACKUP FIRST: Render → bc-infra-db → Backups (or pg_dump).
-- =============================================================================

BEGIN;

-- ── 1. Clear user-linked operational data (order matters for FKs) ───────────
DELETE FROM dispatches;
DELETE FROM sample_custody_events;
DELETE FROM research_samples;
DELETE FROM study_participants;
DELETE FROM study_action_logs;
DELETE FROM studies;

DELETE FROM care_gaps;
DELETE FROM chronic_transfusion_events;
DELETE FROM registry_exceptions;
DELETE FROM chronic_patients;

DELETE FROM action_logs;
DELETE FROM custody_events;
DELETE FROM tti_screenings;
DELETE FROM blood_assets;

-- ── 2. Remove all application users ─────────────────────────────────────────
DELETE FROM users;

-- ── 3. Super-admin row in Postgres ──────────────────────────────────────────
-- Replace :supabase_uuid after you copy it from Supabase → Authentication → Users
--   (select giftjrnakedi@gmail.com → copy User UID), OR leave NULL and set it
--   after Keymaster provisions the account once.
--
INSERT INTO users (
  id,
  email,
  name,
  role,
  status,
  "supabaseId",
  "trustLevel",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'giftjrnakedi@gmail.com',
  'Gift Jr Nakedi',
  'SUPER_ADMIN',
  'ACTIVE',
  NULL,  -- ← paste Supabase Auth UUID here, e.g. 'a1b2c3d4-....'
  3,
  NOW(),
  NOW()
);

COMMIT;

-- Verify
SELECT id, email, name, role, status, "supabaseId" FROM users;
