/** Single bucket for donor Omang / ID and verification uploads (see bloodchain-core/supabase/migrations). */
export const DONOR_VERIFICATIONS_BUCKET = 'donor-verifications'

/** Signed URL TTL for URLs stored on the profile after upload (refresh flow can re-sign later). */
export const VERIFICATION_DOC_SIGNED_URL_SECONDS = 60 * 60 * 24 * 365
