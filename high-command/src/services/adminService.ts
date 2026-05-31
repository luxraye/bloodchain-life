import api from '../lib/api';
import { isDemoSession } from '../lib/isDemoSession';
import {
    DEMO_ASSET_STATUS,
    DEMO_LEDGER_ROWS,
    DEMO_MAP_NODES,
    DEMO_TRANSIT_ROUTES,
    DEMO_WASTAGE,
    filterDemoLedger,
    filterDemoUsers,
} from '../data/seedHighCommand';

// ─── Types aligned with Phase 2 Backend Contract ─────

export interface SystemStats {
    totalUsers: number;
    totalAssets: number;
    assetsByStatus: Record<string, number>;
}

export interface DashboardStats {
    nationalSupply: number;
    activeLogistics: number;
    testingQueue: number;
    wastageRate: number;
    totalDonors: number;
    totalUnits: number;
    criticalAlerts: number;
    assetsByStatus: Record<string, number>;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'PUBLIC' | 'MEDICAL' | 'LAB' | 'TRANSIT' | 'ADMIN' | 'LOGISTICS_COMMAND' | 'SUPER_ADMIN' | 'MOH_AUDITOR';
    facilityId: string | null;
    status: 'ACTIVE' | 'SUSPENDED';
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserPayload {
    email: string;
    name: string;
    role: string;
    facilityId?: string;
}

// ─── GeoJSON Types (Phase 2 — MapLibre/Deck.gl contract) ─

export interface GeoJSONFeature {
    type: 'Feature';
    geometry: {
        type: 'Point' | 'LineString';
        coordinates: number[] | number[][];
    };
    properties: Record<string, unknown>;
}

export interface GeoJSONFeatureCollection {
    type: 'FeatureCollection';
    features: GeoJSONFeature[];
}

// Mapped types consumed by Leaflet (Dashboard.tsx)
export interface MapNode {
    id: string;
    name: string;
    type: string;
    lat: number;
    lng: number;
    status: string;
    inventory?: number;
}

export interface TransitRoute {
    id: string;
    courierName: string;
    from: { lat: number; lng: number; name: string };
    to: { lat: number; lng: number; name: string };
    status: string;
    bloodType: string;
}

// ─── TanStack Table Types (Phase 2 — Ledger) ─────────

export interface LedgerRow {
    id: string;
    assetId: string | null;
    actionPerformed: string;
    userId: string;
    userName: string;
    userRole: string;
    userEmail: string;
    facility: string;
    createdAt: string;
    updatedAt: string;
}

export interface LedgerMeta {
    totalRowCount: number;
    pageCount: number;
    pageIndex: number;
    pageSize: number;
}

export interface LedgerResponse {
    success: boolean;
    data: LedgerRow[];
    meta: LedgerMeta;
}

// ─── Tremor Types (Phase 2 — Wastage) ────────────────

export type TremorDataPoint = Record<string, string | number>;

// ─── Legacy types for backward compat ────────────────

export interface LedgerEntry {
    id: string;
    unitId: string;
    donorName: string;
    bloodType: string;
    currentLocation: string;
    status: string;
    collectedAt: string;
    expiresAt: string;
    chainOfCustody: CustodyEvent[];
}

export interface CustodyEvent {
    timestamp: string;
    actor: string;
    action: string;
    location: string;
    txHash: string;
}

export interface WastageTrend {
    month: string;
    collected: number;
    used: number;
    wasted: number;
    expired: number;
}

// ─── Backend response wrapper ────────────────────────

interface ApiResponse<T> {
    success: boolean;
    data: T;
    meta?: Record<string, unknown>;
    error?: string;
}

// ─── Service ─────────────────────────────────────────

export const adminService = {
    // ── Stats (maps backend shape → dashboard shape) ──
    fetchSystemStats: async (): Promise<DashboardStats> => {
        if (isDemoSession()) {
            const totalAssets = Object.values(DEMO_ASSET_STATUS).reduce((sum, value) => sum + value, 0)
            return {
                nationalSupply: totalAssets,
                activeLogistics: DEMO_ASSET_STATUS.IN_TRANSIT,
                testingQueue: DEMO_ASSET_STATUS.TESTING,
                wastageRate: Math.round((DEMO_ASSET_STATUS.DISCARDED / totalAssets) * 100),
                totalDonors: 1284,
                totalUnits: totalAssets,
                criticalAlerts: DEMO_ASSET_STATUS.QUARANTINE,
                assetsByStatus: DEMO_ASSET_STATUS,
            };
        }
        const res = await api.get<ApiResponse<SystemStats>>('/admin/stats');
        const s = res.data.data;
        return {
            nationalSupply: s.totalAssets,
            activeLogistics: s.assetsByStatus['IN_TRANSIT'] || 0,
            testingQueue: s.assetsByStatus['TESTING'] || 0,
            wastageRate: s.totalAssets > 0
                ? Math.round(((s.assetsByStatus['DISCARDED'] || 0) / s.totalAssets) * 100)
                : 0,
            totalDonors: s.totalUsers,
            totalUnits: s.totalAssets,
            criticalAlerts: (s.assetsByStatus['QUARANTINE'] || 0),
            assetsByStatus: s.assetsByStatus,
        };
    },

    // ── Users ──
    fetchUsers: async (params?: { page?: number; limit?: number; role?: string }): Promise<{ users: User[]; total: number }> => {
        if (isDemoSession()) return filterDemoUsers(params);
        try {
            const queryParams: Record<string, string> = {};
            if (params?.role && params.role !== 'ALL') queryParams.role = params.role;
            if (params?.page) queryParams.page = String(params.page);
            if (params?.limit) queryParams.limit = String(params.limit);

            const res = await api.get<ApiResponse<User[]>>('/admin/users', { params: queryParams });
            const meta = res.data.meta as Record<string, number> | undefined;
            const users = res.data.data ?? [];
            if (import.meta.env.DEV && users.length === 0) return filterDemoUsers(params);
            return { users, total: meta?.total ?? users.length };
        } catch {
            if (import.meta.env.DEV) return filterDemoUsers(params);
            throw new Error('Failed to load users');
        }
    },

    createUser: async (data: CreateUserPayload): Promise<User> => {
        if (isDemoSession()) {
            return {
                id: `demo-user-${Date.now()}`,
                email: data.email,
                name: data.name,
                role: data.role as User['role'],
                facilityId: data.facilityId ?? null,
                status: 'ACTIVE',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                tempPassword: 'demo-only',
            } as User;
        }
        const res = await api.post<ApiResponse<User>>('/admin/users', data);
        return res.data.data;
    },

    deleteUser: async (id: string): Promise<void> => {
        if (isDemoSession()) return;
        await api.delete(`/admin/users/${id}`);
    },

    // ── Map Nodes (GeoJSON → Leaflet-friendly) ──
    fetchMapNodes: async (): Promise<MapNode[]> => {
        if (isDemoSession()) return DEMO_MAP_NODES;
        const res = await api.get<ApiResponse<GeoJSONFeatureCollection>>('/admin/map-nodes');
        const fc = res.data.data;
        return fc.features.map((f) => ({
            id: f.properties.facilityId as string,
            name: f.properties.name as string,
            type: f.properties.type as string,
            lat: (f.geometry.coordinates as number[])[1],  // GeoJSON is [lng, lat]
            lng: (f.geometry.coordinates as number[])[0],
            status: 'ONLINE',
            inventory: f.properties.currentInventoryLevel as number | undefined,
        }));
    },

    // ── Transit Routes (GeoJSON → Leaflet-friendly) ──
    fetchTransitRoutes: async (): Promise<TransitRoute[]> => {
        if (isDemoSession()) return DEMO_TRANSIT_ROUTES;
        const res = await api.get<ApiResponse<GeoJSONFeatureCollection>>('/admin/transit-routes');
        const fc = res.data.data;
        return fc.features.map((f) => {
            const coords = f.geometry.coordinates as number[][];
            return {
                id: f.properties.dispatchId as string,
                courierName: f.properties.courierName as string,
                from: { lng: coords[0][0], lat: coords[0][1], name: f.properties.originFacility as string },
                to: { lng: coords[1][0], lat: coords[1][1], name: f.properties.destinationFacility as string },
                status: f.properties.status as string,
                bloodType: f.properties.bloodType as string,
            };
        });
    },

    // ── Wastage Trends (Tremor-ready — direct passthrough) ──
    fetchWastageTrends: async (days: number = 30): Promise<TremorDataPoint[]> => {
        if (isDemoSession()) return DEMO_WASTAGE.slice(0, Math.max(1, Math.min(DEMO_WASTAGE.length, Math.ceil(days / 30))));
        const res = await api.get<ApiResponse<TremorDataPoint[]>>('/admin/wastage-trends', {
            params: { days },
        });
        return res.data.data;
    },

    // ── Wastage by Facility (Tremor-ready) ──
    fetchWastageByFacility: async (days: number = 30): Promise<TremorDataPoint[]> => {
        if (isDemoSession()) {
            return [
                { facility: 'NBTS Gaborone', Discarded: 4, days },
                { facility: 'NBTS Francistown', Discarded: 2, days },
                { facility: 'Princess Marina Hospital', Discarded: 1, days },
                { facility: 'Nyangabgwe Referral', Discarded: 2, days },
            ];
        }
        const res = await api.get<ApiResponse<TremorDataPoint[]>>('/admin/wastage-by-facility', {
            params: { days },
        });
        return res.data.data;
    },

    // ── Global Ledger (TanStack Table — server-side pagination) ──
    fetchLedger: async (params?: {
        pageIndex?: number;
        pageSize?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        filterAction?: string;
        filterRole?: string;
        filterFacility?: string;
        dateFrom?: string;
        dateTo?: string;
    }): Promise<LedgerResponse> => {
        if (isDemoSession()) {
            return filterDemoLedger(DEMO_LEDGER_ROWS, params);
        }
        try {
            const res = await api.get<LedgerResponse>('/admin/ledger', { params });
            const rows = res.data.data ?? [];
            if (import.meta.env.DEV && rows.length === 0) {
                return filterDemoLedger(DEMO_LEDGER_ROWS, params);
            }
            return res.data;
        } catch {
            if (import.meta.env.DEV) return filterDemoLedger(DEMO_LEDGER_ROWS, params);
            throw new Error('Failed to load ledger');
        }
    },
};
