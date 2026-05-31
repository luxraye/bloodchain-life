import { AlertTriangle } from 'lucide-react';

export default function IncidentFAB({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/30 flex items-center justify-center hover:bg-yellow-400 active:scale-95 transition-all pulse-ring"
            aria-label="Report Incident"
        >
            <AlertTriangle className="w-6 h-6" />
        </button>
    );
}
