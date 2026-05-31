import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Package, Clock, AlertTriangle, Navigation, ExternalLink, ChevronDown, ChevronUp, Truck, Camera, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import HandoverScreen from '../components/HandoverScreen';
import IncidentFAB from '../components/IncidentFAB';
import IncidentModal from '../components/IncidentModal';
import ColdChainPanel from '../components/ColdChainPanel';
import { useJobs } from '../context/JobContext';
import { useLocation } from 'react-router-dom';
import CoordinatorJobActions from '../components/CoordinatorJobActions';

export default function ActiveJob() {
    const navigate = useNavigate();
    const location = useLocation();
    const { getActiveJob, jobs, setActiveJob } = useJobs();
    const [showIncidentModal, setShowIncidentModal] = useState(false);
    const [handoverMode, setHandoverMode] = useState(null); // 'pickup' | 'dropoff' | null
    const [showTimeline, setShowTimeline] = useState(false);

    const job = getActiveJob();
    const routedId = location.state?.jobId;

    useEffect(() => {
        if (routedId) setActiveJob(routedId);
    }, [routedId, setActiveJob]);

    const activeJob =
        (routedId && jobs.find((j) => j.id === routedId))
        || job
        || jobs.find((j) => j.status === 'IN_TRANSIT' || j.status === 'FLAGGED');

    if (!activeJob) {
        return (
            <div className="h-full flex flex-col items-center justify-center px-8 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                    <Package className="w-10 h-10 text-slate-600" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">No Active Job</h2>
                <p className="text-sm text-slate-500 mb-6">
                    Accept a job from the Job Board to begin your relay.
                </p>
                <button
                    onClick={() => navigate('/queue')}
                    className="px-6 py-3 rounded-xl text-white font-bold text-sm transition-all shadow-lg"
                    style={{ background: '#84cc16' }}
                >
                    Go to dispatch queue
                </button>
            </div>
        );
    }

    const isInTransit = activeJob.status === 'IN_TRANSIT';
    const hasPickedUp = !!activeJob.custodyLog?.pickupTime;
    const hasDelivered = !!activeJob.custodyLog?.deliveryTime;

    const openNavigation = () => {
        const coords = activeJob.route?.destCoords;
        if (!coords) return;
        const [lat, lng] = coords;
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-4 pt-6 pb-3 flex items-center gap-3">
                <button
                    onClick={() => navigate('/queue')}
                    className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 text-slate-400" />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-white">Active Job</h1>
                    <span className="text-xs text-slate-500 font-mono">{activeJob.id}</span>
                </div>
                <StatusBadge status={activeJob.status} />
            </div>

            {/* Content — single column on mobile, 2-column on desktop */}
            <div className="flex-1 overflow-y-auto px-4 pb-24 lg:px-8 lg:pb-6">
            <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-4 lg:space-y-0">
                {/* Route Card */}
                <div className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-emerald-400 font-semibold">{activeJob.route.source}</span>
                        </div>
                    </div>
                    <div className="ml-1.5 w-px h-6 bg-slate-600 border-l-2 border-dashed border-slate-600" />
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded-full bg-orange-500" />
                            <span className="text-orange-400 font-semibold">{activeJob.route.destination}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-700">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <MapPin className="w-3 h-3" /> {activeJob.route.distance}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Clock className="w-3 h-3" /> ETA: {activeJob.route.eta}
                        </div>
                    </div>
                    {/* Navigate Button */}
                    {isInTransit && (
                        <button
                            onClick={openNavigation}
                            className="w-full mt-3 py-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-orange-500/20 transition-all"
                        >
                            <Navigation className="w-4 h-4" />
                            Open in Google Maps
                            <ExternalLink className="w-3 h-3 opacity-60" />
                        </button>
                    )}
                </div>

                {/* Payload + cold chain */}
                <div className="space-y-4">
                <div className="glass-card p-4">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Payload</div>
                    <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-orange-400" />
                        <span className="text-white font-semibold">{activeJob.payload}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 font-mono">Manifest: {activeJob.manifestId}</div>
                </div>
                {activeJob.coldChain && <ColdChainPanel coldChain={activeJob.coldChain} />}
                <CoordinatorJobActions job={activeJob} />
                </div>

                {/* Custody Timeline */}
                <div className="glass-card p-4">
                    <button
                        onClick={() => setShowTimeline(!showTimeline)}
                        className="flex items-center justify-between w-full"
                    >
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Chain of Custody</span>
                        {showTimeline ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </button>

                    {showTimeline && (
                        <div className="mt-3 space-y-3 animate-slide-up">
                            {/* Pickup */}
                            <div className={`flex items-start gap-3 ${hasPickedUp ? 'opacity-100' : 'opacity-40'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${hasPickedUp ? 'bg-emerald-500/20' : 'bg-slate-700'}`}>
                                    <span className="text-xs">{hasPickedUp ? '✓' : '1'}</span>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-white">Pickup</div>
                                    <div className="text-xs text-slate-400">
                                        {hasPickedUp
                                            ? `${activeJob.custodyLog.pickupBy} — ${new Date(activeJob.custodyLog.pickupTime).toLocaleTimeString()}`
                                            : 'Pending confirmation'}
                                    </div>
                                </div>
                            </div>

                            {/* In Transit */}
                            <div className={`flex items-start gap-3 ${isInTransit ? 'opacity-100' : 'opacity-40'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isInTransit ? 'bg-orange-500/20 animate-pulse' : 'bg-slate-700'}`}>
                                    {isInTransit
                                        ? <Truck className="w-3.5 h-3.5 text-orange-400" />
                                        : <span className="text-xs text-slate-500">2</span>}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-white">In Transit</div>
                                    <div className="text-xs text-slate-400">Driver: {activeJob.courierId}</div>
                                </div>
                            </div>

                            {/* Delivery */}
                            <div className={`flex items-start gap-3 ${hasDelivered ? 'opacity-100' : 'opacity-40'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${hasDelivered ? 'bg-emerald-500/20' : 'bg-slate-700'}`}>
                                    <span className="text-xs">{hasDelivered ? '✓' : '3'}</span>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-white">Delivered</div>
                                    <div className="text-xs text-slate-400">
                                        {hasDelivered
                                            ? `${activeJob.custodyLog.deliveryBy} — ${new Date(activeJob.custodyLog.deliveryTime).toLocaleTimeString()}`
                                            : 'Pending delivery'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Handover Actions */}
                {/* Large full-width tap targets for couriers — safe to use while moving */}
                {(isInTransit || activeJob.status === 'FLAGGED') && !hasDelivered && (
                    <div className="space-y-3">
                        {!hasPickedUp && (
                            <button
                                onClick={() => setHandoverMode(handoverMode === 'pickup' ? null : 'pickup')}
                                className="w-full min-h-[56px] py-5 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-400 font-bold text-base hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                {handoverMode === 'pickup'
                                    ? 'Cancel Pickup'
                                    : <><Camera className="w-5 h-5" /> Start Pickup Scan</>
                                }
                            </button>
                        )}
                        {hasPickedUp && (
                            <button
                                onClick={() => setHandoverMode(handoverMode === 'dropoff' ? null : 'dropoff')}
                                className="w-full min-h-[56px] py-5 rounded-xl bg-orange-500/20 border-2 border-orange-500/50 text-orange-400 font-bold text-base hover:bg-orange-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                {handoverMode === 'dropoff'
                                    ? 'Cancel Drop-off'
                                    : <><Smartphone className="w-5 h-5" /> Start Drop-off</>
                                }
                            </button>
                        )}
                    </div>
                )}

                {/* Handover Screen */}
                {handoverMode && (
                    <div className="glass-card p-4 animate-slide-up">
                        <HandoverScreen job={activeJob} mode={handoverMode} />
                    </div>
                )}

                {/* Incidents */}
                {(activeJob.incidents?.length ?? 0) > 0 && (
                    <div className="glass-card p-4">
                        <div className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Logged Incidents ({activeJob.incidents.length})
                        </div>
                        <div className="space-y-2">
                            {activeJob.incidents.map((inc, i) => (
                                <div key={i} className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold text-red-400">{inc.type.replace(/_/g, ' ')}</span>
                                        <span className={`text-[10px] font-bold uppercase ${inc.severity === 'CRITICAL' ? 'text-red-400' :
                                                inc.severity === 'MEDIUM' ? 'text-yellow-400' : 'text-slate-400'
                                            }`}>
                                            {inc.severity}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400">{inc.note}</p>
                                    <p className="text-[10px] text-slate-600 mt-1">{new Date(inc.timestamp).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            </div>

            {/* Incident FAB */}
            {(isInTransit || activeJob.status === 'FLAGGED') && (
                <IncidentFAB onClick={() => setShowIncidentModal(true)} />
            )}

            {/* Incident Modal */}
            {showIncidentModal && (
                <IncidentModal
                    jobId={activeJob.id}
                    onClose={() => setShowIncidentModal(false)}
                />
            )}
        </div>
    );
}
