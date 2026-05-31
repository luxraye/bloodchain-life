export default function StatusBadge({ status }) {
    const config = {
        PENDING: {
            bg: 'bg-slate-600/60',
            text: 'text-slate-300',
            dot: 'bg-slate-400',
            label: 'Pending',
        },
        COLLECTED: {
            bg: 'bg-slate-600/60',
            text: 'text-slate-300',
            dot: 'bg-slate-400',
            label: 'Collected',
        },
        IN_TRANSIT: {
            bg: 'bg-amber-500/20',
            text: 'text-amber-400',
            dot: 'bg-amber-500',
            label: 'In Transit',
        },
        DELIVERED: {
            bg: 'bg-emerald-500/20',
            text: 'text-emerald-400',
            dot: 'bg-emerald-500',
            label: 'Delivered',
        },
        FLAGGED: {
            bg: 'bg-red-500/20',
            text: 'text-red-400',
            dot: 'bg-red-500',
            label: 'Flagged',
        },
    };

    const c = config[status] || config.PENDING;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${status === 'IN_TRANSIT' ? 'animate-pulse' : ''}`} />
            {c.label}
        </span>
    );
}
