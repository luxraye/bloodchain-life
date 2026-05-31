import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { createBloodAsset } from '../../lib/api';
import { formatIsbt128 } from '../../lib/isbt128';
import {
    Syringe,
    Play,
    Square,
    CheckCircle2,
    ArrowLeft,
    Timer,
    ScanBarcode,
    Package,
    Droplets,
    Camera,
} from 'lucide-react';

export default function Phlebotomy() {
    const { activeDonor, activeScreening, addBloodUnit, addNotification } = useApp();
    const navigate = useNavigate();
    const [bleedStarted, setBleedStarted] = useState(false);
    const [bleedFinished, setBleedFinished] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [bagBarcode, setBagBarcode] = useState('');
    const [bagScanned, setBagScanned] = useState(false);
    const [flashType, setFlashType] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const timerRef = useRef(null);

    // donorId must be a UUID of an existing User in PostgreSQL.
    const effectiveDonorId = () => {
        const id = activeDonor?.id;
        const isUuid = (s) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
        return (id && isUuid(id)) ? id : null;
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const handleStartBleed = () => {
        setBleedStarted(true);
        timerRef.current = setInterval(() => {
            setElapsedSeconds(prev => prev + 1);
        }, 1000);
        addNotification('Bleed started — timer running', 'info');
    };

    const handleStopBleed = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setBleedFinished(true);
        addNotification(`Bleed completed — ${formatTime(elapsedSeconds)}`, 'success');
    };

    const handleScanBag = () => {
        if (!bagBarcode.trim()) {
            addNotification('Please enter or scan a bag barcode', 'error');
            return;
        }
        setBagScanned(true);
        setFlashType('green');
        setTimeout(() => setFlashType(''), 600);
        addNotification(`Bag ${bagBarcode} linked successfully`, 'success');
    };

    const handleSimulateScan = () => {
        addNotification('Bag simulation is disabled in pilot mode', 'info');
    };

    const handleFinalize = async () => {
        const donorId = effectiveDonorId();
        if (!donorId) {
            addNotification('Donor ID missing or invalid. Please select a synced donor record.', 'error');
            return;
        }
        const location = 'Gaborone Mobile Drive 1';
        const vitals = activeScreening
            ? {
                bp: `${activeScreening.bpSystolic}/${activeScreening.bpDiastolic}`,
                hb: activeScreening.hemoglobin,
                weight: activeScreening.weight,
            }
            : undefined;

        setIsSubmitting(true);
        try {
            const { data } = await createBloodAsset({
                donorId,
                bloodType: activeDonor?.bloodType || 'Unknown',
                location,
                vitals,
            });
            const serverAsset = data?.data;
            addBloodUnit({
                id: serverAsset?.id ?? `unit_${Date.now().toString(36)}`,
                type: serverAsset?.bloodType ?? activeDonor?.bloodType,
                donorId: serverAsset?.donorId ?? donorId,
                collectedAt: serverAsset?.createdAt ?? new Date().toISOString(),
                expiresAt: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString(),
                status: serverAsset?.status ?? 'COLLECTED',
                location: serverAsset?.currentLocation ?? location,
                bagBarcode,
                vitals: activeScreening ? { bp: vitals?.bp, hb: vitals?.hb, weight: vitals?.weight } : null,
                collectedBy: 'Dr. Smith (ID: med_55)',
                locationName: location,
                bleedDuration: elapsedSeconds,
            });
            addNotification('Blood unit recorded and sent to quarantine.', 'success');
            setBagBarcode('');
            setBagScanned(false);
            setBleedStarted(false);
            setBleedFinished(false);
            setElapsedSeconds(0);
        } catch (err) {
            const msg = err.response?.data?.error ?? err.message ?? 'Failed to record collection';
            addNotification(msg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleBack = () => navigate('/collection/screening');

    if (!activeDonor || !activeScreening) {
        return (
            <div className="max-w-3xl mx-auto animate-fade-in">
                <div className="card p-8 text-center">
                    <Syringe className="w-8 h-8 text-[#4A5568] mx-auto mb-3" />
                    <p className="text-sm font-semibold text-[#E2E8F0]">No screening completed</p>
                    <p className="text-xs text-[#4A5568] mt-1">Complete the Medical Screening step first.</p>
                    <button onClick={() => navigate('/collection/check-in')} className="btn-primary mt-4">Go to Check-In</button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                    <button onClick={handleBack} className="btn-ghost p-1.5">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h1 className="text-2xl font-bold text-[#F0F4F8] flex items-center gap-2">
                        <Syringe className="w-6 h-6 text-[#D96070]" />
                        Phlebotomy Recorder
                    </h1>
                </div>
                <p className="text-sm text-[#8899A8] ml-10">Start the bleed, scan the blood bag, and finalize the collection.</p>
            </div>

            {/* Donor + Unit Info */}
            <div className="card p-4 mb-6 flex items-center justify-between bg-[#111422]">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-red-100 flex items-center justify-center">
                        <Droplets className="w-4 h-4 text-[#D96070]" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-[#F0F4F8]">{activeDonor.firstName} {activeDonor.lastName}</p>
                        <p className="text-xs text-[#4A5568]">Type: {activeDonor.bloodType} · Unit: {activeScreening.unitId}</p>
                    </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-[rgba(0,255,136,0.15)] text-[#00FF88] text-xs font-bold">SCREENED</div>
            </div>

            {/* Step 1: Start Bleed */}
            <div className="card p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bleedStarted ? 'bg-brand-red-100' : 'bg-[rgba(255,255,255,0.05)]'
                            }`}>
                            <span className="text-sm font-bold text-[#D96070]">1</span>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-[#F0F4F8]">Phlebotomy — Bleed Timer</h2>
                            <p className="text-xs text-[#4A5568]">Start the timer when the needle is inserted</p>
                        </div>
                    </div>
                    {bleedStarted && (
                        <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg">
                            <Timer className="w-4 h-4" />
                            <span className="font-mono text-lg font-bold">{formatTime(elapsedSeconds)}</span>
                            {!bleedFinished && <span className="w-2 h-2 bg-[rgba(255,45,85,0.08)]0 rounded-full animate-pulse" />}
                        </div>
                    )}
                </div>

                {!bleedStarted && (
                    <button onClick={handleStartBleed} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                        <Play className="w-4 h-4" />
                        Start Bleed
                    </button>
                )}

                {bleedStarted && !bleedFinished && (
                    <button onClick={handleStopBleed} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-all shadow-sm">
                        <Square className="w-4 h-4" />
                        Stop Bleed
                    </button>
                )}

                {bleedFinished && (
                    <div className="flex items-center gap-2 bg-[rgba(0,255,136,0.08)] border border-emerald-200 rounded-lg px-4 py-3 text-[#00FF88]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Bleed completed in {formatTime(elapsedSeconds)}</span>
                    </div>
                )}
            </div>

            {/* Step 2: Scan Bag */}
            <div className={`card p-6 mb-4 transition-all ${flashType === 'green' ? 'flash-green' : ''} ${!bleedFinished ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bagScanned ? 'bg-[rgba(0,255,136,0.15)]' : 'bg-[rgba(255,255,255,0.05)]'
                        }`}>
                        <span className="text-sm font-bold text-[#D96070]">2</span>
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-[#F0F4F8]">Bag Scanning</h2>
                        <p className="text-xs text-[#4A5568]">Scan or enter the blood bag barcode to link it</p>
                    </div>
                </div>

                {!bagScanned ? (
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={bagBarcode}
                            onChange={(e) => setBagBarcode(e.target.value)}
                            placeholder="Scan or enter bag barcode..."
                            className="input-field flex-1"
                            tabIndex={1}
                        />
                        <button
                            onClick={() => {
                                console.log('[Camera] PWA camera scan — not yet implemented');
                                addNotification('Camera scan coming soon (PWA integration pending)', 'info');
                            }}
                            className="btn-outline flex items-center gap-2"
                            title="Scan with device camera"
                        >
                            <Camera className="w-4 h-4" />
                            Scan
                        </button>
                        <button onClick={handleScanBag} className="btn-primary">Link Bag</button>
                        <button onClick={handleSimulateScan} className="btn-outline flex items-center gap-2">
                            <ScanBarcode className="w-4 h-4" />
                            Simulate
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 bg-[rgba(0,255,136,0.08)] border border-emerald-200 rounded-lg px-4 py-3 text-[#00FF88]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Bag linked: <span className="font-mono">{bagBarcode}</span></span>
                    </div>
                )}
            </div>

            {/* Step 3: Finalize */}
            <div className={`card p-6 ${!bagScanned ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
                        <span className="text-sm font-bold text-[#D96070]">3</span>
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-[#F0F4F8]">Finalize Collection</h2>
                        <p className="text-xs text-[#4A5568]">Record unit as COLLECTED and send to quarantine</p>
                    </div>
                </div>

                <div className="bg-[#111422] rounded-lg p-4 mb-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div>
                        <p className="text-[10px] uppercase text-[#4A5568] font-semibold">Unit ID (ISBT-128)</p>
                        <p className="font-mono font-bold text-[#F0F4F8] tracking-wide">{formatIsbt128(activeScreening.unitId)}</p>
                        <p className="font-mono text-[10px] text-[#4A5568]">{activeScreening.unitId}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase text-[#4A5568] font-semibold">Blood Type</p>
                        <p className="font-bold text-[#F0F4F8]">{activeDonor.bloodType}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase text-[#4A5568] font-semibold">Bag Code</p>
                        <p className="font-mono text-[#F0F4F8]">{bagBarcode}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase text-[#4A5568] font-semibold">Duration</p>
                        <p className="font-bold text-[#F0F4F8]">{formatTime(elapsedSeconds)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase text-[#4A5568] font-semibold">Collected By</p>
                        <p className="text-[#F0F4F8]">Dr. Smith</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase text-[#4A5568] font-semibold">Status</p>
                        <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-[#FFB800] text-xs font-bold">QUARANTINE</span>
                    </div>
                </div>

                <button
                    onClick={handleFinalize}
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60 disabled:pointer-events-none"
                >
                    {isSubmitting ? (
                        <>
                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Recording…
                        </>
                    ) : (
                        <>
                            <Package className="w-4 h-4" />
                            Record Collection & Send to Quarantine
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
