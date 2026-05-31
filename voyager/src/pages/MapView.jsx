import { useState } from 'react';
import { Map as MapIcon, Layers } from 'lucide-react';
import NationalBloodMap from '../components/map/NationalBloodMap.jsx';
import ConstellationBoundary from '../components/ConstellationBoundary';
import { useJobs } from '../context/JobContext';

export default function MapView() {
    const { jobs, activeJobId } = useJobs();
    const [showActiveRoute, setShowActiveRoute] = useState(true);

    const activeJob = jobs.find(j => j.id === activeJobId);
    const focusJobId = showActiveRoute && activeJob ? activeJobId : null;

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-4 pt-6 pb-3 lg:px-8">
                <ConstellationBoundary />
            </div>
            <div className="relative z-10 flex items-center justify-between px-4 pb-3 lg:px-8">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <MapIcon className="w-4 h-4 text-orange-400" />
                    </div>
                    <h1 className="text-lg font-bold text-white">Ecosystem Map</h1>
                </div>
                {activeJob && (
                    <button
                        onClick={() => setShowActiveRoute(!showActiveRoute)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${showActiveRoute
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                    >
                        <Layers className="w-3 h-3" />
                        {showActiveRoute ? 'Active Route' : 'All Facilities'}
                    </button>
                )}
            </div>

            <div className="relative flex-1 min-h-0 px-4 pb-20 lg:px-8 lg:pb-6">
                <NationalBloodMap height="100%" />
            </div>
        </div>
    );
}
