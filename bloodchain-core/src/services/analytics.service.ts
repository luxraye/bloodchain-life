// ─────────────────────────────────────────────────────
// Bloodchain Core — Analytics Service
// Tremor-ready flat time-series for charts
// ─────────────────────────────────────────────────────

import { prisma } from "../config";

export type TremorDataPoint = Record<string, string | number>;

/**
 * Returns blood wastage grouped by date and blood type.
 * Output is a flat array designed for Tremor BarChart/AreaChart:
 * [{ date: "2026-03-01", "O+": 12, "A-": 3, "Discarded": 15 }, ...]
 *
 * Tremor requires flat objects — no nested structures.
 */
export const getWastageTrends = async (days: number = 30): Promise<TremorDataPoint[]> => {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const discarded = await prisma.bloodAsset.findMany({
        where: {
            status: { in: ["DISCARDED", "USED"] }, // Include USED for contrast
            updatedAt: { gte: since },
        },
        select: {
            bloodType: true,
            status: true,
            updatedAt: true,
        },
        orderBy: { updatedAt: "asc" },
    });

    // Bucket by date, then by bloodType
    const buckets: Record<string, Record<string, number>> = {};
    const bloodTypeSet = new Set<string>();

    for (const asset of discarded) {
        const dateKey = asset.updatedAt.toISOString().slice(0, 10);

        if (!buckets[dateKey]) {
            buckets[dateKey] = {};
        }

        // Only count DISCARDED towards wastage
        if (asset.status === "DISCARDED") {
            const bt = asset.bloodType || "Unknown";
            bloodTypeSet.add(bt);
            buckets[dateKey][bt] = (buckets[dateKey][bt] || 0) + 1;
            buckets[dateKey]["Discarded"] = (buckets[dateKey]["Discarded"] || 0) + 1;
        }
    }

    // Convert to flat Tremor-ready array
    const allBloodTypes = Array.from(bloodTypeSet).sort();

    return Object.entries(buckets).map(([date, counts]) => {
        const point: TremorDataPoint = { date };

        // Ensure every blood type key is present (Tremor needs consistent keys)
        for (const bt of allBloodTypes) {
            point[bt] = counts[bt] || 0;
        }
        point["Discarded"] = counts["Discarded"] || 0;

        return point;
    });
};

/**
 * Extended analytics: wastage by facility.
 * Useful for Tremor grouped bar charts.
 */
export const getWastageByFacility = async (days: number = 30): Promise<TremorDataPoint[]> => {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const discarded = await prisma.bloodAsset.findMany({
        where: {
            status: "DISCARDED",
            updatedAt: { gte: since },
        },
        select: {
            currentLocation: true,
            bloodType: true,
        },
    });

    // Group by facility
    const buckets: Record<string, Record<string, number>> = {};
    for (const asset of discarded) {
        const facility = asset.currentLocation || "Unknown";
        if (!buckets[facility]) buckets[facility] = {};
        const bt = asset.bloodType || "Unknown";
        buckets[facility][bt] = (buckets[facility][bt] || 0) + 1;
        buckets[facility]["Total"] = (buckets[facility]["Total"] || 0) + 1;
    }

    return Object.entries(buckets).map(([facility, counts]) => ({
        facility,
        ...counts,
    }));
};
