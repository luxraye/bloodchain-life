import { useState, useEffect } from 'react';
import { ShieldCheck, ShieldX, ExternalLink, Clock, User2, Droplets } from 'lucide-react';

import { isDemoSession } from '../lib/isDemoSession';
import { DEMO_KYC_QUEUE } from '../data/seedHighCommand';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

async function authFetch(path: string, options: RequestInit = {}) {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    let token = null;
    if (keys[0]) { try { token = JSON.parse(localStorage.getItem(keys[0]) || '{}')?.access_token; } catch { } }
    return fetch(`${BASE}${path}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers ?? {}) },
    });
}

const TRUST_LABELS = { 1: 'Bronze', 2: 'Silver', 3: 'Gold' };
const TRUST_COLORS = {
    1: 'text-amber-700 bg-amber-100 border-amber-300',
    2: 'text-slate-500 bg-slate-100 border-slate-300',
    3: 'text-emerald-700 bg-emerald-100 border-emerald-300',
};

export default function VerificationsPage() {
    const [donors, setDonors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [acting, setActing] = useState<Record<string, string | null>>({});
    const [feedback, setFeedback] = useState<Record<string, string>>({});

    const fetchQueue = async () => {
        setLoading(true);
        try {
            if (isDemoSession()) {
                setDonors(DEMO_KYC_QUEUE);
                return;
            }
            const res = await authFetch('/admin/users?role=PUBLIC');
            const json = await res.json();
            // Only show Level 2 (Silver — pending admin review)
            setDonors((json.data ?? []).filter((u: any) => u.trustLevel === 2));
        } catch { setDonors([]); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchQueue(); }, []);

    const act = async (userId: string, action: string) => {
        setActing(a => ({ ...a, [userId]: action }));
        try {
            if (isDemoSession()) {
                setFeedback(f => ({ ...f, [userId]: action === 'verify' ? 'Demo approved locally' : 'Demo rejection recorded locally' }));
                setDonors(d => d.filter(u => u.id !== userId));
                return;
            }
            const payload = action === 'verify'
                ? { trustLevel: 3 }
                : { trustLevel: 1, verificationDocUrl: null };
            const res = await authFetch(`/admin/users/${userId}`, { method: 'PATCH', body: JSON.stringify(payload) });
            if (res.ok) {
                setFeedback(f => ({ ...f, [userId]: action === 'verify' ? '✓ Verified — Level 3 granted' : '✗ Rejected — donor returned to Level 1' }));
                setDonors(d => d.filter(u => u.id !== userId));
            }
        } catch { } finally { setActing(a => ({ ...a, [userId]: null })); }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-100 flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-command-gold" />
                        Verification Queue
                    </h1>
                    <p className="text-sm text-neutral-500 mt-1">Review donor identity submissions and grant Level 3 trust.</p>
                </div>
                <button onClick={fetchQueue} className="px-4 py-2 rounded-lg bg-neutral-800 text-xs font-semibold text-neutral-300 hover:bg-neutral-700 transition">
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-command-gold/30 border-t-command-gold rounded-full animate-spin" />
                </div>
            ) : donors.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <ShieldCheck className="w-14 h-14 text-neutral-700 mb-4" />
                    <p className="text-neutral-400 font-medium">No pending verifications</p>
                    <p className="text-sm text-neutral-600 mt-1">Donors who upload documents will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {donors.map(donor => (
                        <div key={donor.id} className="rounded-xl border border-neutral-700/60 bg-neutral-900/80 overflow-hidden">
                            <div className="p-5 flex flex-col md:flex-row gap-5">
                                {/* Donor info */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-lg font-black text-command-gold">
                                            {(donor.name ?? '?')[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-neutral-100">{donor.name}</p>
                                            <p className="text-xs text-neutral-500">{donor.email}</p>
                                        </div>
                                        <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold border ${TRUST_COLORS[donor.trustLevel as keyof typeof TRUST_COLORS] ?? ''}`}>
                                            {TRUST_LABELS[donor.trustLevel as keyof typeof TRUST_LABELS] ?? 'L' + donor.trustLevel} — Pending
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center gap-1.5 text-neutral-400">
                                            <Droplets className="w-3.5 h-3.5" />
                                            <span>Blood Type: <span className="font-semibold text-neutral-200">{donor.bloodType ?? '—'}</span></span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-neutral-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>Registered: <span className="font-semibold text-neutral-200">{new Date(donor.createdAt).toLocaleDateString('en-GB')}</span></span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-neutral-400 col-span-2">
                                            <User2 className="w-3.5 h-3.5" />
                                            <span className="truncate text-[11px] font-mono text-neutral-500">ID: {donor.id}</span>
                                        </div>
                                    </div>

                                    {/* Verification document */}
                                    {donor.verificationDocUrl ? (
                                        <a
                                            href={donor.verificationDocUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-command-gold hover:underline"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            View uploaded document (Omang / Medical)
                                        </a>
                                    ) : (
                                        <p className="text-xs text-neutral-600 italic">No document URL on record</p>
                                    )}
                                </div>

                                {/* Action buttons */}
                                <div className="flex md:flex-col gap-2 justify-end">
                                    <button
                                        disabled={!!acting[donor.id]}
                                        onClick={() => act(donor.id, 'verify')}
                                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-600/20 border border-emerald-600/40 text-emerald-400 text-xs font-bold hover:bg-emerald-600/30 disabled:opacity-50 transition"
                                    >
                                        <ShieldCheck className="w-4 h-4" />
                                        {acting[donor.id] === 'verify' ? 'Verifying…' : 'Verify — Grant Level 3'}
                                    </button>
                                    <button
                                        disabled={!!acting[donor.id]}
                                        onClick={() => act(donor.id, 'reject')}
                                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-red-900/20 border border-red-800/40 text-red-400 text-xs font-bold hover:bg-red-900/30 disabled:opacity-50 transition"
                                    >
                                        <ShieldX className="w-4 h-4" />
                                        {acting[donor.id] === 'reject' ? 'Rejecting…' : 'Reject & Re-upload'}
                                    </button>
                                </div>
                            </div>

                            {feedback[donor.id] && (
                                <div className="px-5 py-2 bg-neutral-800/60 border-t border-neutral-700/40 text-xs text-neutral-400">
                                    {feedback[donor.id]}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
