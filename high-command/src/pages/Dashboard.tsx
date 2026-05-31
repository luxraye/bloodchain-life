import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Droplets, Truck, FlaskConical, AlertTriangle, Globe } from 'lucide-react';
import WastageTrends from '../components/analytics/WastageTrends';
import ConstellationBoundary from '../components/ConstellationBoundary';
import { Link } from 'react-router-dom';
import { constellationHealthSummary } from '../data/constellationModules';

const hospitalIcon = new DivIcon({
    html: '<div style="background:rgba(16,185,129,0.9);width:14px;height:14px;border-radius:50%;border:2px solid #000;box-shadow:0 0 8px rgba(16,185,129,0.5)"></div>',
    className: '',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
});

const labIcon = new DivIcon({
    html: '<div style="background:rgba(59,130,246,0.9);width:14px;height:14px;border-radius:50%;border:2px solid #000;box-shadow:0 0 8px rgba(59,130,246,0.5)"></div>',
    className: '',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
});

const driveIcon = new DivIcon({
    html: '<div style="background:rgba(234,179,8,0.9);width:12px;height:12px;border-radius:3px;border:2px solid #000;box-shadow:0 0 8px rgba(234,179,8,0.5)"></div>',
    className: '',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
});

function getNodeIcon(type: string) {
    if (type === 'HOSPITAL') return hospitalIcon;
    if (type === 'LAB') return labIcon;
    return driveIcon;
}

function TickerSkeleton() {
    return (
        <div className="glass-card p-5 animate-pulse">
            <div className="h-3 w-20 skeleton mb-3"></div>
            <div className="h-8 w-24 skeleton mb-2"></div>
            <div className="h-3 w-32 skeleton"></div>
        </div>
    );
}

export default function Dashboard() {
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: adminService.fetchSystemStats,
        refetchInterval: 60000,
    });

    const constellation = constellationHealthSummary();

    const { data: nodes } = useQuery({
        queryKey: ['nodes'],
        queryFn: adminService.fetchMapNodes,
    });

    const { data: routes } = useQuery({
        queryKey: ['transit'],
        queryFn: adminService.fetchTransitRoutes,
    });

    const tickers = [
        {
            label: 'National Supply',
            value: stats?.nationalSupply?.toLocaleString(),
            sub: 'Total blood units across all facilities',
            color: 'text-emerald-400',
            border: 'border-emerald-500/20',
            glow: 'shadow-emerald-500/5',
            Icon: Droplets,
            iconColor: 'text-emerald-500',
        },
        {
            label: 'Active Logistics',
            value: stats?.activeLogistics,
            sub: 'Hermes drivers currently IN_TRANSIT',
            color: 'text-blue-400',
            border: 'border-blue-500/20',
            glow: 'shadow-blue-500/5',
            Icon: Truck,
            iconColor: 'text-blue-500',
        },
        {
            label: 'Testing Queue',
            value: stats?.testingQueue,
            sub: 'Units pending at Mars Labs',
            color: 'text-command-gold',
            border: 'border-command-gold/20',
            glow: 'shadow-yellow-500/5',
            Icon: FlaskConical,
            iconColor: 'text-command-gold',
        },
        {
            label: 'Wastage Rate',
            value: stats ? `${stats.wastageRate}%` : undefined,
            sub: 'Biohazard + Expired this month',
            color: 'text-command-red',
            border: 'border-command-red/20',
            glow: 'shadow-red-500/5',
            Icon: AlertTriangle,
            iconColor: 'text-command-red',
            alert: stats && stats.wastageRate > 3,
        },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <ConstellationBoundary />
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Globe size={18} style={{ color: '#D96070' }} /> National command
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1 font-mono">
                        SUPPLY CHAIN · {constellation.live}/{constellation.total} MODULES LIVE
                    </p>
                </div>
                <Link
                    to="/constellation"
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border transition"
                    style={{ color: '#D96070', borderColor: 'rgba(168,31,56,0.35)' }}
                >
                    Open constellation →
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-100 border border-surface-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs text-neutral-400 font-mono">
                        Last sync: {new Date().toLocaleTimeString()}
                    </span>
                </div>
            </div>

            {/* Ticker Cards */}
            <div className="grid grid-cols-4 gap-4">
                {statsLoading
                    ? Array.from({ length: 4 }).map((_, i) => <TickerSkeleton key={i} />)
                    : tickers.map((t, i) => (
                        <div
                            key={i}
                            className={`glass-card p-5 border ${t.border} ${t.glow} shadow-lg hover:scale-[1.02] transition-transform duration-200 animate-slide-up`}
                            style={{ animationDelay: `${i * 80}ms` }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-neutral-500 font-semibold tracking-wider uppercase">{t.label}</span>
                                <t.Icon size={16} className={t.iconColor} />
                            </div>
                            <div className={`text-3xl font-bold ${t.color} font-mono`}>
                                {t.value ?? '—'}
                            </div>
                            <p className="text-xs text-neutral-600 mt-2">{t.sub}</p>
                            {t.alert && (
                                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-command-red font-mono animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-command-red"></span>
                                    THRESHOLD EXCEEDED
                                </div>
                            )}
                        </div>
                    ))}
            </div>

            {/* Map + Charts Row */}
            <div className="grid grid-cols-3 gap-4">
                {/* Map */}
                <div className="col-span-2 glass-card overflow-hidden" style={{ height: '420px' }}>
                    <div className="px-4 py-3 border-b border-surface-400/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-400 font-semibold tracking-wider uppercase">Ecosystem Map</span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px]">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                <span className="text-neutral-500">Hospital</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                                <span className="text-neutral-500">Lab</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded bg-command-gold" style={{ width: 10, height: 10 }}></span>
                                <span className="text-neutral-500">Mobile Drive</span>
                            </div>
                        </div>
                    </div>
                    {(!nodes || nodes.length === 0) && (
                        <div className="flex items-center justify-center h-[calc(100%-44px)] text-neutral-500 text-sm">
                            <div className="text-center">
                                <p className="font-medium">No facility nodes to display yet</p>
                                <p className="text-xs mt-1">Nodes will appear when the ecosystem map is populated.</p>
                            </div>
                        </div>
                    )}
                    {nodes && nodes.length > 0 && (
                    <MapContainer
                        center={[-22.3285, 24.6849]}
                        zoom={6}
                        style={{ height: 'calc(100% - 44px)', width: '100%' }}
                        zoomControl={true}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {nodes?.map((node) => (
                            <Marker key={node.id} position={[node.lat, node.lng]} icon={getNodeIcon(node.type)}>
                                <Popup>
                                    <div className="text-xs">
                                        <strong>{node.name}</strong>
                                        <br />
                                        Type: {node.type}
                                        <br />
                                        Status: {node.status}
                                        {node.inventory !== undefined && (
                                            <>
                                                <br />
                                                Inventory: {node.inventory} units
                                            </>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                        {routes?.map((route) => (
                                <Polyline
                                    key={route.id}
                                    positions={[
                                        [route.from.lat, route.from.lng],
                                        [route.to.lat, route.to.lng],
                                    ]}
                                    pathOptions={{
                                        color: '#EAB308',
                                        weight: 2,
                                        opacity: 0.7,
                                        dashArray: '8 6',
                                    }}
                                />
                            ))}
                    </MapContainer>
                    )}
                </div>

                {/* Right Column: Charts */}
                <div className="flex flex-col gap-4">
                    <WastageTrends />
                </div>
            </div>

            {/* Active Couriers */}
            <div className="glass-card">
                <div className="px-5 py-3 border-b border-surface-400/50 flex items-center justify-between">
                    <span className="text-xs text-neutral-400 font-semibold tracking-wider uppercase">Active Courier Jobs</span>
                    <span className="text-[10px] text-command-gold font-mono">{routes?.length || 0} IN TRANSIT</span>
                </div>
                <div className="divide-y divide-surface-400/30">
                    {!routes?.length ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <Truck size={28} className="text-neutral-600 mb-3" />
                            <p className="text-sm text-neutral-400 font-medium">No active courier jobs at this time</p>
                            <p className="text-xs text-neutral-500 mt-1">Transit routes will appear here when Voyager drivers accept jobs.</p>
                        </div>
                    ) : (
                        routes.map((route) => (
                            <div key={route.id} className="flex items-center justify-between px-5 py-3 hover:bg-surface-100/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                        <Truck size={14} className="text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white font-medium">{route.courierName}</p>
                                        <p className="text-[11px] text-neutral-500 font-mono">{route.id.slice(0,8)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-neutral-400">
                                        {route.from.name} → {route.to.name}
                                    </p>
                                    <p className="text-[11px] text-command-gold font-mono mt-0.5">{route.bloodType}</p>
                                </div>
                                <div className="status-badge status-active">
                                    IN_TRANSIT
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
