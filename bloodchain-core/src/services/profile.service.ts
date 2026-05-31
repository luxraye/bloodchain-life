// ─────────────────────────────────────────────────────
// Bloodchain Core — Profile Service
// ─────────────────────────────────────────────────────

import { prisma } from "../config";
import { ApiError } from "../middlewares/errorHandler";
import { Role } from "@prisma/client";

export interface SupabaseIdentity {
    email?: string;
    name?: string;
    role?: string;
}

// Get existing profile or auto-create one from Supabase JWT claims.
// This ensures any user authenticated through Supabase can always access their profile.
export const getOrCreateProfile = async (supabaseId: string, identity: SupabaseIdentity) => {
    const existing = await prisma.user.findFirst({
        where: { supabaseId },
    });

    if (existing) return existing;

    // Auto-create the user row from their JWT identity
    const email = identity.email ?? `${supabaseId}@bloodchain.local`;
    const name = identity.name ?? email;
    const role = mapRole(identity.role);

    console.log(`[profile] Auto-creating profile for ${email} (supabaseId: ${supabaseId})`);

    return prisma.user.create({
        data: {
            email,
            name,
            supabaseId,
            role,
        },
    });
};

export const getProfile = async (supabaseId: string) => {
    const user = await prisma.user.findFirst({
        where: { supabaseId },
    });
    if (!user) throw new ApiError(404, "Profile not found");
    return user;
};

export interface UpdateProfileInput {
    name?: string;
    bloodType?: string;
    facilityId?: string;
    trustLevel?: number;
    verificationDocUrl?: string;
    age?: number;
    gender?: string;
    region?: string;
    medicalConditions?: string;
}

export const updateProfile = async (supabaseId: string, data: UpdateProfileInput) => {
    const user = await prisma.user.findFirst({
        where: { supabaseId },
    });
    if (!user) throw new ApiError(404, "Profile not found");

    // Donors can only move UP to level 2 themselves; level 3 is Admin-only
    const safeTrustLevel = data.trustLevel !== undefined
        ? Math.min(data.trustLevel, 2)
        : undefined;

    return prisma.user.update({
        where: { id: user.id },
        data: {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.bloodType !== undefined && { bloodType: data.bloodType }),
            ...(data.facilityId !== undefined && { facilityId: data.facilityId }),
            ...(safeTrustLevel !== undefined && { trustLevel: safeTrustLevel }),
            ...(data.verificationDocUrl !== undefined && { verificationDocUrl: data.verificationDocUrl }),
            ...(data.age !== undefined && { age: data.age }),
            ...(data.gender !== undefined && { gender: data.gender }),
            ...(data.region !== undefined && { region: data.region }),
            ...(data.medicalConditions !== undefined && { medicalConditions: data.medicalConditions }),
        },
    });
};

function mapRole(role?: string): Role {
    if (!role) return Role.PUBLIC;
    const upper = role.toUpperCase();
    if (upper === "ADMIN") return Role.ADMIN;
    if (upper === "SUPER_ADMIN") return Role.SUPER_ADMIN;
    if (upper === "MOH_AUDITOR") return Role.MOH_AUDITOR;
    if (upper === "LOGISTICS_COMMAND") return Role.LOGISTICS_COMMAND;
    if (upper === "MEDICAL") return Role.MEDICAL;
    if (upper === "LAB") return Role.LAB;
    if (upper === "TRANSIT") return Role.TRANSIT;
    return Role.PUBLIC;
}
