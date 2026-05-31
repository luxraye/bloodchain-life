import { z } from 'zod';

export const IncidentSchema = z.object({
    type: z.enum([
        'SHOCK_EVENT',
        'TEMPERATURE_SPIKE',
        'TRAFFIC_DELAY',
        'VEHICLE_BREAKDOWN',
    ]),
    severity: z.enum(['LOW', 'MEDIUM', 'CRITICAL']),
    timestamp: z.string(),
    note: z.string().min(1, 'Please describe the incident'),
});

export const CustodyLogSchema = z.object({
    pickupTime: z.string().nullable(),
    pickupBy: z.string().nullable(),
    deliveryTime: z.string().nullable(),
    deliveryBy: z.string().nullable(),
    pickupLocation: z.string().nullable(),
    deliveryLocation: z.string().nullable(),
});

export const RouteSchema = z.object({
    source: z.string(),
    sourceCoords: z.array(z.number()).length(2),
    destination: z.string(),
    destCoords: z.array(z.number()).length(2),
    distance: z.string(),
    eta: z.string(),
});

export const TransportJobSchema = z.object({
    id: z.string(),
    manifestId: z.string(),
    courierId: z.string(),
    status: z.enum(['PENDING', 'IN_TRANSIT', 'DELIVERED', 'FLAGGED']),
    priority: z.enum(['ROUTINE', 'STAT']),
    payload: z.string(),
    route: RouteSchema,
    incidents: z.array(IncidentSchema),
    custodyLog: CustodyLogSchema,
});

export const INCIDENT_TYPES = [
    { value: 'SHOCK_EVENT', label: 'Pothole / Shock', icon: '⚡' },
    { value: 'TEMPERATURE_SPIKE', label: 'Temperature Spike', icon: '🌡️' },
    { value: 'TRAFFIC_DELAY', label: 'Traffic Delay', icon: '🚦' },
    { value: 'VEHICLE_BREAKDOWN', label: 'Vehicle Breakdown', icon: '🔧' },
];

export const SEVERITY_LEVELS = [
    { value: 'LOW', label: 'Low', color: 'text-slate-400 border-slate-500' },
    { value: 'MEDIUM', label: 'Medium', color: 'text-yellow-400 border-yellow-500' },
    { value: 'CRITICAL', label: 'Critical', color: 'text-red-400 border-red-500' },
];
