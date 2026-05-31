import { useEffect, useRef, useState } from 'react';

/**
 * A hook that listens for high-speed hardware "keyboard wedge" USB/Bluetooth barcode scanners.
 * Buffers keystrokes < 30ms apart. Clears the buffer if user types manually at normal human speed.
 * Yields the `scannedCode` when 'Enter' is caught by the wedge scanner.
 */
export function useWedgeScanner() {
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const bufferRef = useRef<string>('');
    const lastKeyTimeRef = useRef<number>(Date.now());

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if the user is typing in an actual input field
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
                return;
            }

            const now = Date.now();
            const timeDiff = now - lastKeyTimeRef.current;
            lastKeyTimeRef.current = now;

            // If more than 30ms elapsed, reset buffer (it's human typing, not a wedge scanner)
            if (timeDiff > 30) {
                bufferRef.current = '';
            }

            // Wedges typically append 'Enter' at the end of the barcode scan
            if (e.key === 'Enter') {
                if (bufferRef.current.length > 5) {
                    setScannedCode(bufferRef.current);
                    // Emit a custom browser event or alert depending on workflow, but state usually works fine.
                }
                bufferRef.current = '';
                return;
            }

            if (e.key.length === 1) {
                bufferRef.current += e.key;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return scannedCode;
}
