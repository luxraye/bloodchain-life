import { useState } from 'react';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import BarcodeScanner from '../components/hardware/BarcodeScanner';
import { CheckCircle2 } from 'lucide-react';

export default function CollectionSession() {
    const database = useDatabase();
    const [scannedUnits, setScannedUnits] = useState<{ uuid: string; timestamp: string }[]>([]);
    const [isScanning, setIsScanning] = useState(false); // To prevent duplicate rapid scans

    const handleScanSuccess = async (decodedText: string) => {
        if (isScanning) return; // Prevent double-trigger during the write
        
        // Basic deduplication for current session view
        if (scannedUnits.some((u) => u.uuid === decodedText)) {
            return;
        }

        setIsScanning(true);

        try {
            await database.write(async () => {
                const bloodUnitsCollection = database.collections.get('blood_units');
                await bloodUnitsCollection.create((unit: any) => {
                    unit.uuid = decodedText;
                    unit.status = 'COLLECTED';
                    unit.created_at = Date.now();
                    unit.updated_at = Date.now();
                    
                    // Defaults for a fast-scan collection. Typically these would be filled via secondary UI.
                    unit.blood_group = 'UNKNOWN'; 
                    unit.volume_ml = 450; 
                    unit.donor_id = 'pending-donor-auth'; 
                });
            });

            // Update UI
            setScannedUnits((prev) => [
                { uuid: decodedText, timestamp: new Date().toLocaleTimeString() },
                ...prev
            ]);
            
        } catch (error) {
            console.error("Failed to write to WatermelonDB:", error);
        } finally {
            // Add a small delay before allowing the next scan to prevent hardware flooding
            setTimeout(() => {
                setIsScanning(false);
            }, 1500);
        }
    };

    return (
        <div className="flex flex-col h-full bg-neutral-950 p-4 gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Active Collection</h1>
                <p className="text-neutral-400 text-sm">Scan vacutainers to append directly to the offline ledger. Changes sync automatically when connection restores.</p>
            </div>

            {/* Scanner Viewfinder */}
            <div className="w-full aspect-square md:aspect-video rounded-xl overflow-hidden border-2 border-dashed border-neutral-700 relative">
                <BarcodeScanner onScanSuccess={handleScanSuccess} />
                
                {isScanning && (
                    <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                        <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2 animate-bounce" />
                        <span className="text-emerald-400 font-semibold tracking-wide">Unit Secured</span>
                    </div>
                )}
            </div>

            {/* Local Ledger Feed */}
            <div className="flex flex-col gap-3 flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-neutral-200">Session Log</h2>
                    <span className="bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-full text-xs font-medium">
                        {scannedUnits.length} Units
                    </span>
                </div>
                
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl flex-1 overflow-y-auto p-2 space-y-2">
                    {scannedUnits.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-neutral-500 text-sm">
                            Awaiting first scan...
                        </div>
                    ) : (
                        scannedUnits.map((unit, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg border border-neutral-700/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-neutral-200 font-mono text-sm">{unit.uuid}</span>
                                        <span className="text-neutral-500 text-xs">Offline Queued</span>
                                    </div>
                                </div>
                                <span className="text-neutral-400 text-xs">{unit.timestamp}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
