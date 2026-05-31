import { useState, useRef, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';

export default function SlideToConfirm({ onConfirm, label = 'Slide to Confirm', color = 'orange' }) {
    const [progress, setProgress] = useState(0);
    const [confirmed, setConfirmed] = useState(false);
    const trackRef = useRef(null);
    const dragging = useRef(false);
    const startX = useRef(0);

    const colorClasses = {
        orange: {
            thumb: 'bg-orange-500 shadow-orange-500/40',
            fill: 'bg-orange-500/20',
            text: 'text-orange-400',
            confirmed: 'bg-orange-500',
        },
        green: {
            thumb: 'bg-emerald-500 shadow-emerald-500/40',
            fill: 'bg-emerald-500/20',
            text: 'text-emerald-400',
            confirmed: 'bg-emerald-500',
        },
        red: {
            thumb: 'bg-red-500 shadow-red-500/40',
            fill: 'bg-red-500/20',
            text: 'text-red-400',
            confirmed: 'bg-red-500',
        },
    };

    const c = colorClasses[color] || colorClasses.orange;

    const getProgress = useCallback((clientX) => {
        if (!trackRef.current) return 0;
        const rect = trackRef.current.getBoundingClientRect();
        const thumbWidth = 56;
        const maxTravel = rect.width - thumbWidth;
        const rawProgress = (clientX - rect.left - thumbWidth / 2) / maxTravel;
        return Math.max(0, Math.min(1, rawProgress));
    }, []);

    const handleStart = useCallback((clientX) => {
        if (confirmed) return;
        dragging.current = true;
        startX.current = clientX;
    }, [confirmed]);

    const handleMove = useCallback((clientX) => {
        if (!dragging.current || confirmed) return;
        setProgress(getProgress(clientX));
    }, [getProgress, confirmed]);

    const handleEnd = useCallback(() => {
        if (!dragging.current || confirmed) return;
        dragging.current = false;
        if (progress > 0.85) {
            setProgress(1);
            setConfirmed(true);
            onConfirm?.();
        } else {
            setProgress(0);
        }
    }, [progress, confirmed, onConfirm]);

    const thumbWidth = 56;

    return (
        <div
            ref={trackRef}
            className="slide-track min-h-[72px] w-full relative select-none rounded-xl"
            onMouseDown={(e) => handleStart(e.clientX)}
            onMouseMove={(e) => handleMove(e.clientX)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            onTouchEnd={handleEnd}
        >
            {/* Progress fill */}
            <div
                className={`absolute inset-y-0 left-0 rounded-l-full transition-none ${c.fill}`}
                style={{ width: `${progress * 100}%` }}
            />

            {/* Label */}
            <div className={`absolute inset-0 flex items-center justify-center text-sm font-semibold ${c.text} pointer-events-none transition-opacity ${progress > 0.3 ? 'opacity-0' : 'opacity-60'}`}>
                {confirmed ? '✓ Confirmed' : label}
                {!confirmed && <ChevronRight className="w-4 h-4 ml-1 animate-pulse" />}
            </div>

            {/* Thumb */}
            <div
                className={`absolute top-1 bottom-1 rounded-full flex items-center justify-center transition-none shadow-lg ${confirmed ? c.confirmed : c.thumb}`}
                style={{
                    width: `${thumbWidth}px`,
                    left: confirmed
                        ? `calc(100% - ${thumbWidth + 4}px)`
                        : `${Math.max(4, progress * (trackRef.current?.offsetWidth - thumbWidth - 4 || 200))}px`,
                }}
            >
                {confirmed ? (
                    <span className="text-white text-lg font-bold">✓</span>
                ) : (
                    <ChevronRight className="w-5 h-5 text-white" />
                )}
            </div>
        </div>
    );
}
