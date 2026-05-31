import { prisma } from "../config";
import { Role } from "@prisma/client";
import { ApiError } from "../middlewares/errorHandler";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase Admin Client (Service Role — "God Mode") ────────────────────────
// Never expose SUPABASE_SERVICE_ROLE_KEY to the frontend.
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

// ─── Create User ──────────────────────────────────────────────────────────────

interface CreateUserInput {
    email: string;
    name: string;
    role: Role;
    facilityId?: string;
    password?: string;   // defaults to auto-generated temp password
}

export const createUser = async (data: CreateUserInput) => {
    // Fast-fail: check for duplicate in DB before hitting Supabase
    const existing = await prisma.user.findUnique({
        where: { email: data.email },
    });
    if (existing) {
        throw new ApiError(409, `User with email "${data.email}" already exists`);
    }

    // Auto-generate temp password if none provided
    const tempPassword = data.password ?? `BC-${Math.random().toString(36).slice(-8).toUpperCase()}`;

    // 1. Create the auth identity in Supabase Auth (email_confirm bypasses email verification)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: tempPassword,
        email_confirm: true,
        app_metadata: { role: data.role },    // role stored in app_metadata (server-controlled)
        user_metadata: { name: data.name },
    });

    if (authError) {
        throw new ApiError(400, `Supabase Auth error: ${authError.message}`);
    }

    const supabaseUserId = authData.user.id;

    // 2. Persist the profile in Prisma with the Supabase user UUID
    const user = await prisma.user.create({
        data: {
            email: data.email,
            name: data.name,
            role: data.role,
            facilityId: data.facilityId || null,
            supabaseId: supabaseUserId,
        },
    });

    return { ...user, tempPassword };
};

// ─── Delete User ─────────────────────────────────────────────────────────────

export const deleteUser = async (id: string) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new ApiError(404, `User "${id}" not found`);

    // Remove from Supabase Auth
    if (user.supabaseId) {
        const { error } = await supabaseAdmin.auth.admin.deleteUser(user.supabaseId);
        if (error) {
            // Log but don't fail — DB cleanup should still happen
            console.warn(`[deleteUser] Supabase delete warning for ${user.supabaseId}:`, error.message);
        }
    }

    // Cascade-delete related blood assets
    await prisma.bloodAsset.deleteMany({ where: { donorId: id } });

    await prisma.user.delete({ where: { id } });
};

// ─── List Users (with pagination) ─────────────────────────────────────────────

export const listUsers = async (role?: string, page: number = 1, limit: number = 50) => {
    const where = role ? { role: role as Role } : {};
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.user.count({ where }),
    ]);
    return { users, total };
};

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export const getStats = async () => {
    const [totalUsers, totalAssets, assetsByStatus] = await Promise.all([
        prisma.user.count(),
        prisma.bloodAsset.count(),
        prisma.bloodAsset.groupBy({
            by: ["status"],
            _count: { status: true },
        }),
    ]);

    const statusBreakdown: Record<string, number> = {};
    for (const group of assetsByStatus) {
        statusBreakdown[group.status] = group._count.status;
    }

    return { totalUsers, totalAssets, assetsByStatus: statusBreakdown };
};

// ─── Update User (trust level, status, etc) ───────────────────────────────────

interface UpdateUserInput {
    trustLevel?: number;
    verificationDocUrl?: string | null;
    status?: string;
    name?: string;
    facilityId?: string;
}

export const updateUser = async (id: string, data: UpdateUserInput) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new ApiError(404, `User "${id}" not found`);

    const updated = await prisma.user.update({
        where: { id },
        data: {
            ...(data.trustLevel !== undefined && { trustLevel: data.trustLevel }),
            ...(data.verificationDocUrl !== undefined && { verificationDocUrl: data.verificationDocUrl }),
            ...(data.status !== undefined && { status: data.status as any }),
            ...(data.name !== undefined && { name: data.name }),
            ...(data.facilityId !== undefined && { facilityId: data.facilityId }),
        },
    });
    return updated;
};

// ─── Ledger: Full Action Log (time-series for Tremor charts) ──────────────────

export const getLedger = async (page: number = 1, limit: number = 50, dateFrom?: string, dateTo?: string) => {
    const where: Record<string, unknown> = {};
    if (dateFrom || dateTo) {
        where.createdAt = {
            ...(dateFrom && { gte: new Date(dateFrom) }),
            ...(dateTo && { lte: new Date(dateTo) }),
        };
    }

    const [logs, total] = await Promise.all([
        prisma.actionLog.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.actionLog.count({ where }),
    ]);

    return { logs, total };
};

// ─── Wastage Trends: Discarded assets grouped by date ─────────────────────────

export const getWastageTrends = async (days: number = 30) => {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const discarded = await prisma.bloodAsset.findMany({
        where: {
            status: "DISCARDED",
            updatedAt: { gte: since },
        },
        select: { updatedAt: true },
        orderBy: { updatedAt: "asc" },
    });

    // Group by date string for chart consumption
    const buckets: Record<string, number> = {};
    for (const asset of discarded) {
        const dateKey = asset.updatedAt.toISOString().slice(0, 10); // YYYY-MM-DD
        buckets[dateKey] = (buckets[dateKey] || 0) + 1;
    }

    return Object.entries(buckets).map(([date, count]) => ({ date, count }));
};
