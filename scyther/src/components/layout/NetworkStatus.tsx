import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { syncWithCore } from '../../database/sync';
// Assuming `database` is exported globally or provided via Context, but for this component, we'll accept it as a prop or placeholder it.
// In a real app, you'd use the useDatabase() hook from @nozbe/watermelondb/DatabaseProvider

export default function NetworkStatus({ database }) {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleForceSync = async () => {
        if (!isOnline || !database) return;
        setIsSyncing(true);
        try {
            await syncWithCore(database);
        } catch (error) {
            console.error('Sync failed:', error);
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-sm font-medium">
            {!isOnline ? (
                <>
                    <WifiOff className="w-4 h-4 text-amber-500" />
                    <span className="text-amber-500">Offline Mode — Queuing locally</span>
                </>
            ) : (
                <>
                    <div className="flex items-center gap-2 text-emerald-500">
                        <Wifi className="w-4 h-4" />
                        <span>Connected</span>
                    </div>

                    <div className="w-px h-4 bg-neutral-700 mx-1"></div>

                    <button
                        onClick={handleForceSync}
                        disabled={isSyncing}
                        className="flex items-center gap-1.5 px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                        {isSyncing ? 'Syncing...' : 'Force Sync'}
                    </button>
                </>
            )}
        </div>
    );
}
