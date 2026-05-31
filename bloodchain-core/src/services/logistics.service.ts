// ─────────────────────────────────────────────────────
// Bloodchain Core — Logistics Service
// Geospatial queries for Voyager (MapLibre/Deck.gl)
// ─────────────────────────────────────────────────────

import { prisma } from "../config";

// ─── GeoJSON TypeDefs ─────────────────────────────────

interface GeoJSONFeature {
    type: "Feature";
    geometry: {
        type: "Point" | "LineString" | "MultiLineString";
        coordinates: number[] | number[][] | number[][][];
    };
    properties: Record<string, unknown>;
}

interface GeoJSONFeatureCollection {
    type: "FeatureCollection";
    features: GeoJSONFeature[];
}

// ─── getMapNodes: Facility FeatureCollection (Point) ──

export const getMapNodes = async (): Promise<GeoJSONFeatureCollection> => {
    const facilities = await prisma.facility.findMany({
        where: { status: "ACTIVE" },
        select: {
            id: true,
            name: true,
            type: true,
            latitude: true,
            longitude: true,
            inventoryLevel: true,
            region: true,
            address: true,
        },
    });

    const features: GeoJSONFeature[] = facilities.map((f) => ({
        type: "Feature" as const,
        geometry: {
            type: "Point" as const,
            coordinates: [f.longitude, f.latitude], // GeoJSON is [lng, lat]
        },
        properties: {
            facilityId: f.id,
            name: f.name,
            type: f.type,
            currentInventoryLevel: f.inventoryLevel,
            region: f.region,
            address: f.address,
        },
    }));

    return { type: "FeatureCollection", features };
};

// ─── getTransitRoutes: Dispatch FeatureCollection (LineString) ──

export const getTransitRoutes = async (): Promise<GeoJSONFeatureCollection> => {
    const dispatches = await prisma.dispatch.findMany({
        where: {
            status: { in: ["PENDING", "IN_TRANSIT", "DELIVERED", "COMPROMISED_COLD_CHAIN"] },
        },
        include: {
            origin: {
                select: { id: true, name: true, latitude: true, longitude: true },
            },
            destination: {
                select: { id: true, name: true, latitude: true, longitude: true },
            },
            courier: {
                select: { id: true, name: true },
            },
            asset: {
                select: { id: true, bloodType: true, status: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    const features: GeoJSONFeature[] = dispatches.map((d) => ({
        type: "Feature" as const,
        geometry: {
            type: "LineString" as const,
            coordinates: [
                [d.origin.longitude, d.origin.latitude],       // origin [lng, lat]
                [d.destination.longitude, d.destination.latitude], // dest [lng, lat]
            ],
        },
        properties: {
            dispatchId: d.id,
            status: d.status,
            courierId: d.courier.id,
            courierName: d.courier.name,
            assetId: d.asset.id,
            bloodType: d.asset.bloodType,
            assetStatus: d.asset.status,
            originFacility: d.origin.name,
            destinationFacility: d.destination.name,
            departedAt: d.departedAt?.toISOString() ?? null,
            arrivedAt: d.arrivedAt?.toISOString() ?? null,
        },
    }));

    return { type: "FeatureCollection", features };
};
