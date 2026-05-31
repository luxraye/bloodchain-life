import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface BarcodeScannerProps {
    onScanSuccess: (decodedText: string) => void;
}

export default function BarcodeScanner({ onScanSuccess }: BarcodeScannerProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        // Initialize the scanner when the component mounts
        scannerRef.current = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        const handleScanSuccess = (decodedText: string) => {
            // Trigger Haptic Feedback
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }

            // Trigger Audio Feedback
            try {
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                if (audioCtx) {
                    const oscillator = audioCtx.createOscillator();
                    const gainNode = audioCtx.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(audioCtx.destination);

                    oscillator.type = 'sine';
                    oscillator.frequency.value = 1000; // 1000Hz beep

                    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); // volume

                    oscillator.start(audioCtx.currentTime);
                    oscillator.stop(audioCtx.currentTime + 0.1); // 0.1s duration
                }
            } catch (e) {
                console.error("Audio API not supported", e);
            }

            // Pass the decoded UUID back to parent
            onScanSuccess(decodedText);
        };

        const handleScanFailure = (error: string) => {
            // Usually we ignore continuous scan failures unless debugging
        };

        scannerRef.current.render(handleScanSuccess, handleScanFailure);

        // Cleanup function to prevent camera lock on unmount
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner. ", error);
                });
            }
        };
    }, [onScanSuccess]);

    return (
        <div className="w-full flex-1 min-h-[300px] flex items-center justify-center bg-black/50 rounded-lg overflow-hidden border border-neutral-800">
            <div id="reader" className="w-full h-full text-white [&>div]:!border-none [&_button]:!bg-neutral-800 [&_button]:!text-white [&_button]:!px-4 [&_button]:!py-2 [&_button]:!rounded-lg [&_select]:!bg-neutral-800 [&_select]:!text-white [&_select]:!px-2 [&_select]:!py-1 [&_select]:!rounded"></div>
        </div>
    );
}
