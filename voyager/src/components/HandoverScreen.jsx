import { useState } from 'react';
import { QrCode, ScanLine, CheckCircle2, MapPin, Clock } from 'lucide-react';
import SlideToConfirm from './SlideToConfirm';
import { useJobs } from '../context/JobContext';

export default function HandoverScreen({ job, mode }) {
    const { confirmPickup, confirmDelivery } = useJobs();
    const [scanning, setScanning] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const isPickup = mode === 'pickup';

    const handleScan = () => {
        setScanning(true);
        // Simulate scan
        setTimeout(() => {
            setScanning(false);
            setScanned(true);
        }, 2000);
    };

    const handleConfirm = () => {
        if (isPickup) {
            confirmPickup(job.id, 'Nurse on duty');
        } else {
            confirmDelivery(job.id, 'Lab Tech on duty');
        }
        setConfirmed(true);
    };

    if (confirmed) {
        return (
            <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                    {isPickup ? 'Custody Received' : 'Delivery Confirmed'}
                </h3>
                <p className="text-sm text-slate-400 text-center px-8">
                    {isPickup
                        ? `Payload custody transferred to you at ${job.route.source}`
                        : `Payload delivered to ${job.route.destination}`
                    }
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date().toLocaleTimeString()}
                    </span>
                    <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        GPS Logged
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Title */}
            <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-1">
                    {isPickup ? 'Pickup — Scan Manifest QR' : 'Drop-off — Present Delivery QR'}
                </h3>
                <p className="text-sm text-slate-400">
                    {isPickup
                        ? 'Scan the QR code on the manifest to confirm pickup'
                        : 'Show this QR code to the receiving party'
                    }
                </p>
            </div>

            {/* QR Area */}
            <div className="flex justify-center">
                <div
                    className={`w-48 h-48 rounded-2xl border-2 flex items-center justify-center relative overflow-hidden ${scanned
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : scanning
                                ? 'border-orange-500 bg-slate-800 qr-scanner-overlay'
                                : 'border-slate-600 bg-slate-800'
                        }`}
                >
                    {scanned ? (
                        <div className="text-center animate-fade-in">
                            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                            <span className="text-xs text-emerald-400 font-semibold">Verified</span>
                        </div>
                    ) : scanning ? (
                        <div className="text-center">
                            <ScanLine className="w-12 h-12 text-orange-400 mx-auto mb-2 animate-pulse" />
                            <span className="text-xs text-orange-400 font-semibold">Scanning...</span>
                        </div>
                    ) : (
                        <div className="text-center">
                            <QrCode className="w-16 h-16 text-slate-600 mx-auto mb-2" />
                            <span className="text-xs text-slate-500">
                                {isPickup ? 'Tap to Scan' : 'QR Code'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Scan Button or Confirm Slider */}
            {!scanned ? (
                <button
                    onClick={handleScan}
                    disabled={scanning}
                    className={`w-full min-h-[56px] py-5 rounded-xl font-bold text-base transition-all ${scanning
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20'
                        }`}
                >
                    {scanning ? 'Scanning...' : isPickup ? 'Scan Manifest QR' : 'Generate Delivery QR'}
                </button>
            ) : (
                <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                        <div className="text-xs text-slate-400 mb-1">Manifest</div>
                        <div className="text-sm font-mono text-white">{job.manifestId}</div>
                    </div>
                    <div className="w-full min-h-[80px]">
                        <SlideToConfirm
                            onConfirm={handleConfirm}
                            label={isPickup ? 'Slide to Confirm Pickup' : 'Slide to Confirm Drop-off'}
                            color="green"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
