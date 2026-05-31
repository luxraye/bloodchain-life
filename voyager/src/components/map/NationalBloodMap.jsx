import React, { useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api.js';
import { isDemoSession } from '../../lib/isDemoSession.js';
import { DEMO_MAP_NODES, DEMO_MAP_ROUTES } from '../../data/seedVoyager.js';

const INITIAL_VIEW_STATE = {
    longitude: 24.6849,
    latitude: -22.3285,
    zoom: 5.5,
    pitch: 35,
    bearing: 0,
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const fetchNodes = async () => {
    if (isDemoSession()) return DEMO_MAP_NODES;
    try {
        const res = await api.get('/admin/map-nodes');
        return res.data.data;
    } catch {
        if (import.meta.env.DEV) return DEMO_MAP_NODES;
        return DEMO_MAP_NODES;
    }
};

const fetchRoutes = async () => {
    if (isDemoSession()) return DEMO_MAP_ROUTES;
    try {
        const res = await api.get('/admin/transit-routes');
        return res.data.data;
    } catch {
        if (import.meta.env.DEV) return DEMO_MAP_ROUTES;
        return DEMO_MAP_ROUTES;
    }
};

export default function NationalBloodMap({ height = '100%' }) {
    const demo = isDemoSession();

    const { data: nodesData } = useQuery({
        queryKey: ['map-nodes'],
        queryFn: fetchNodes,
        refetchInterval: demo ? false : 30000,
    });

    const { data: routesData } = useQuery({
        queryKey: ['transit-routes'],
        queryFn: fetchRoutes,
        refetchInterval: demo ? false : 15000,
    });

    const layers = useMemo(() => {
        const result = [];

        if (routesData) {
            result.push(
                new GeoJsonLayer({
                    id: 'transit-routes-layer',
                    data: routesData,
                    opacity: 0.85,
                    stroked: true,
                    filled: false,
                    lineWidthMinPixels: 3,
                    getLineColor: (f) => {
                        const status = f.properties.status;
                        if (status === 'COMPROMISED_COLD_CHAIN') return [255, 45, 85, 255];
                        if (status === 'DELAYED') return [255, 184, 0, 255];
                        if (status === 'PENDING') return [136, 153, 168, 200];
                        return [132, 204, 22, 255];
                    },
                    getLineWidth: 4,
                    pickable: true,
                }),
            );
        }

        if (nodesData) {
            result.push(
                new GeoJsonLayer({
                    id: 'facility-nodes-layer',
                    data: nodesData,
                    pointType: 'circle',
                    pickable: true,
                    getFillColor: (f) => {
                        const inv = f.properties.currentInventoryLevel;
                        if (inv === undefined) return [100, 116, 139, 200];
                        if (inv < 10) return [255, 45, 85, 220];
                        if (inv < 25) return [255, 184, 0, 220];
                        return [132, 204, 22, 220];
                    },
                    getLineColor: [255, 255, 255, 255],
                    getLineWidth: 1,
                    lineWidthMinPixels: 1,
                    getRadius: (f) => {
                        const type = f.properties.type;
                        if (type === 'BLOOD_BANK') return 15000;
                        if (type === 'HOSPITAL') return 10000;
                        return 8000;
                    },
                    radiusMinPixels: 5,
                    radiusMaxPixels: 22,
                }),
            );
        }

        return result;
    }, [nodesData, routesData]);

    return (
        <div
            className="w-full relative rounded-xl overflow-hidden border border-white/10 shadow-2xl"
            style={{ height, background: '#07090F' }}
        >
            <DeckGL
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                layers={layers}
                getTooltip={({ object }) => {
                    if (!object) return null;
                    if (object.geometry.type === 'Point') {
                        return {
                            html: `
                                <div style="padding:4px">
                                    <div style="font-weight:bold;margin-bottom:4px">${object.properties.name}</div>
                                    <div style="font-size:11px;color:#aaa">
                                        ${object.properties.type}<br/>
                                        Inventory: ${object.properties.currentInventoryLevel ?? '—'} units
                                    </div>
                                </div>`,
                            style: { backgroundColor: '#0C0F1A', color: '#f0f4f8', borderRadius: '8px', border: '1px solid rgba(168,31,56,0.3)' },
                        };
                    }
                    if (object.geometry.type === 'LineString') {
                        const st = object.properties.status;
                        return {
                            html: `
                                <div style="padding:4px">
                                    <div style="font-weight:bold;margin-bottom:4px">${object.properties.originFacility} → ${object.properties.destinationFacility}</div>
                                    <div style="font-size:11px;color:#aaa">
                                        Courier: ${object.properties.courierName}<br/>
                                        Blood: ${object.properties.bloodType}<br/>
                                        Status: ${st}
                                    </div>
                                </div>`,
                            style: { backgroundColor: '#0C0F1A', color: '#f0f4f8', borderRadius: '8px', border: '1px solid rgba(132,204,22,0.3)' },
                        };
                    }
                    return null;
                }}
            >
                <Map mapStyle={MAP_STYLE} reuseMaps preventStyleDiffing />
            </DeckGL>

            <div className="absolute bottom-3 right-3 bg-[#0C0F1A]/95 backdrop-blur-sm border border-white/10 p-3 rounded-lg pointer-events-none text-xs">
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Route status</p>
                <div className="space-y-1 text-neutral-300">
                    <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-lime-400" /> In transit</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-amber-400" /> Delayed</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-red-500" /> Cold chain breach</div>
                </div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-3 mb-2">Inventory</p>
                <div className="space-y-1 text-neutral-300">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-lime-400" /> Healthy</div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400" /> Low</div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500" /> Critical</div>
                </div>
            </div>
        </div>
    );
}
