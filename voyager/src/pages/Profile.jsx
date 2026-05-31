import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMyProfile, updateMyProfile } from '../services/api.js';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function Profile() {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ name: '', facilityId: '' });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getMyProfile().then(p => {
            if (p) { setProfile(p); setForm({ name: p.name || '', facilityId: p.facilityId || '' }); }
        });
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true); setError(''); setSaved(false);
        try {
            const updated = await updateMyProfile(form);
            setProfile(updated);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            setError(err?.response?.data?.error || 'Failed to save');
        } finally { setSaving(false); }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-slate-900 p-4 pb-20 lg:px-8 lg:pb-8">
            <div className="mx-auto max-w-2xl space-y-4">
                <h1 className="text-lg font-bold text-white">My Profile</h1>

                {/* Avatar card */}
                <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center text-2xl font-black text-white">
                            {(profile?.name || user?.name || '?')[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold text-white">{profile?.name || user?.name}</p>
                            <p className="text-xs text-slate-400 font-mono">{profile?.email || user?.email}</p>
                            <span className="inline-block mt-1 text-[11px] font-mono font-bold text-sky-400 bg-sky-500/10 rounded px-1.5 py-0.5">
                                {profile?.role || user?.role}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="space-y-3">
                        <div>
                            <label className="text-xs text-slate-400 font-medium">Display Name</label>
                            <input className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/40 transition"
                                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 font-medium">Base / Depot</label>
                            <input className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/40 transition"
                                placeholder="e.g. NBTS Gaborone Depot" value={form.facilityId} onChange={e => setForm({ ...form, facilityId: e.target.value })} />
                        </div>

                        {error && <p className="text-xs text-red-400 bg-red-900/30 border border-red-700 rounded-lg px-3 py-2">{error}</p>}
                        {saved && <p className="text-xs text-emerald-400 bg-emerald-900/30 border border-emerald-700 rounded-lg px-3 py-2">✓ Saved</p>}

                        <button type="submit" disabled={saving}
                            className="w-full rounded-xl bg-sky-600 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-60 transition">
                            {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Info */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Account</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><p className="text-slate-500">Status</p><p className={`font-bold ${profile?.status === 'ACTIVE' ? 'text-emerald-400' : 'text-red-400'}`}>{profile?.status ?? 'ACTIVE'}</p></div>
                        <div><p className="text-slate-500">Member Since</p><p className="text-slate-300">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}</p></div>
                    </div>
                </div>

                <button onClick={() => logout()} className="w-full rounded-xl border border-slate-700 py-2.5 text-sm font-medium text-slate-400 hover:text-red-400 hover:border-red-700 transition">
                    Sign Out
                </button>
            </div>
        </div>
    );
}
