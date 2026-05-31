// ─────────────────────────────────────────────────────
// Bloodchain Core — Register Service (Public)
// Creates PUBLIC-role donors via Azure self-signup
// ─────────────────────────────────────────────────────

import { prisma } from "../config";
import { createClient } from "@supabase/supabase-js";
import { ApiError } from "../middlewares/errorHandler";

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

export interface RegisterInput {
    email: string;
    password: string;
    name: string;
    bloodType?: string;
    /** ISO 8601 timestamp — recorded in Supabase user_metadata for accountability (Data Protection Act). */
    acceptedTermsAt: string;
}

export const registerDonor = async (data: RegisterInput) => {
    // Guard: email already in DB
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ApiError(409, "An account with this email already exists");

    // 1. Create Supabase Auth user (PUBLIC role, auto-confirmed)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        app_metadata: { role: "PUBLIC" },
        user_metadata: {
            name: data.name,
            accepted_terms_at: data.acceptedTermsAt,
            trust_level: 1,
        },
    });

    if (authError) throw new ApiError(400, authError.message);

    const supabaseId = authData.user.id;

    // 2. Persist profile in Prisma
    const user = await prisma.user.create({
        data: {
            email: data.email,
            name: data.name,
            role: "PUBLIC",
            bloodType: data.bloodType ?? null,
            supabaseId,
        },
    });

    return { user, supabaseId };
};
