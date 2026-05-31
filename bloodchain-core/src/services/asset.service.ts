// ─────────────────────────────────────────────────────
// Bloodchain Core — Asset Service
// ─────────────────────────────────────────────────────

import { prisma } from "../config";
import { AssetStatus } from "@prisma/client";
import { ApiError } from "../middlewares/errorHandler";
import { writeActionLog } from "./activity.service";

// Status label map for ActionLog
const STATUS_LABELS: Partial<Record<AssetStatus, string>> = {
    COLLECTED: "Collected",
    TESTING: "Screened",
    QUARANTINE: "Quarantined",
    RELEASED: "Released",
    IN_TRANSIT: "Dispatched for Transit",
    USED: "Administered",
    DISCARDED: "Discarded",
};

// ─── Get My Donations (donor-only, by JWT subject) ───

export const getMyDonations = async (userId: string) => {
    const user = await prisma.user.findFirst({
        where: { supabaseId: userId },
    });
    if (!user) return [];

    const assets = await prisma.bloodAsset.findMany({
        where: { donorId: user.id },
        orderBy: { createdAt: "desc" },
    });
    return assets;
};

// ─── Get Assets (List / Filter by Status) ────────────

export const getAssets = async (status?: AssetStatus) => {
    const where = status ? { status } : {};
    const assets = await prisma.bloodAsset.findMany({
        where,
        include: { donor: { select: { id: true, name: true, email: true, bloodType: true } } },
        orderBy: { createdAt: "desc" },
    });
    return assets;
};

// ─── Get Single Asset with Custody Chain ─────────────

export const getAssetWithCustody = async (id: string) => {
    const asset = await prisma.bloodAsset.findUnique({
        where: { id },
        include: {
            donor: { select: { id: true, name: true, email: true, bloodType: true } },
            custodyEvents: { orderBy: { createdAt: "asc" } },
        },
    });
    if (!asset) throw new ApiError(404, `Blood asset "${id}" not found`);
    return asset;
};

// ─── Create Asset (First Blood Draw) ──────────────────

export interface CreateAssetInput {
    donorId: string;
    bloodType: string;
    location: string;
    latitude?: number;
    longitude?: number;
    actorSupabaseId: string;
}

export const createAsset = async (data: CreateAssetInput) => {
    const donor = await prisma.user.findUnique({ where: { id: data.donorId } });
    if (!donor) throw new ApiError(400, `Donor not found: "${data.donorId}"`);

    const actor = await prisma.user.findFirst({
        where: { supabaseId: data.actorSupabaseId },
    });

    const asset = await prisma.bloodAsset.create({
        data: {
            donorId: data.donorId,
            bloodType: data.bloodType,
            currentLocation: data.location,
            latitude: data.latitude ?? null,
            longitude: data.longitude ?? null,
            status: "COLLECTED",
        },
    });

    if (actor) {
        await prisma.custodyEvent.create({
            data: {
                assetId: asset.id,
                actorId: actor.id,
                actorName: actor.name,
                actorRole: actor.role,
                status: "COLLECTED",
                location: data.location,
                latitude: data.latitude ?? null,
                longitude: data.longitude ?? null,
                notes: "Blood unit collected",
            },
        });
        await writeActionLog({
            assetId: asset.id,
            actionPerformed: "Collected",
            userId: actor.id,
            userName: actor.name,
            userRole: actor.role,
            facility: actor.facilityId ?? data.location,
        });
    }

    return asset;
};

// ─── Scan / Update Asset ─────────────────────────────

interface ScanAssetInput {
    assetId: string;
    newStatus: AssetStatus;
    location: string;
    notes?: string;
    latitude?: number;
    longitude?: number;
    actorSupabaseId: string;
}

export const scanAsset = async (data: ScanAssetInput) => {
    const asset = await prisma.bloodAsset.findUnique({ where: { id: data.assetId } });
    if (!asset) throw new ApiError(404, `Blood asset "${data.assetId}" not found`);

    const actor = await prisma.user.findFirst({
        where: { supabaseId: data.actorSupabaseId },
    });

    const updated = await prisma.bloodAsset.update({
        where: { id: data.assetId },
        data: {
            status: data.newStatus,
            currentLocation: data.location,
            latitude: data.latitude ?? null,
            longitude: data.longitude ?? null,
        },
    });

    if (actor) {
        await prisma.custodyEvent.create({
            data: {
                assetId: asset.id,
                actorId: actor.id,
                actorName: actor.name,
                actorRole: actor.role,
                status: data.newStatus,
                location: data.location,
                latitude: data.latitude ?? null,
                longitude: data.longitude ?? null,
                notes: data.notes ?? null,
            },
        });
        await writeActionLog({
            assetId: asset.id,
            actionPerformed: STATUS_LABELS[data.newStatus] ?? data.newStatus,
            userId: actor.id,
            userName: actor.name,
            userRole: actor.role,
            facility: actor.facilityId ?? data.location,
        });
    }

    return updated;
};
