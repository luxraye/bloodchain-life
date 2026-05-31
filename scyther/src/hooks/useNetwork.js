/**
 * useNetwork — FFT Mission 1
 * Tracks real-time connection state and triggers outbox sync when coming online.
 *
 * Returns: { isOnline, isSyncing }
 * - isOnline:  true = connected, false = offline
 * - isSyncing: true while processOutbox() is flushing pending records
 */
import { useState, useEffect, useCallback } from 'react';
import { processOutbox } from '../lib/api.js';

export function useNetwork() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleOnline = useCallback(async () => {
        setIsOnline(true);
        setIsSyncing(true);
        try {
            await processOutbox();
        } finally {
            setIsSyncing(false);
        }
    }, []);

    const handleOffline = useCallback(() => {
        setIsOnline(false);
    }, []);

    useEffect(() => {
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [handleOnline, handleOffline]);

    return { isOnline, isSyncing };
}
