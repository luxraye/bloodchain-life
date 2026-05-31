import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyProfile, updateMyProfile } from '../services/api';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function ProfilePage() {
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

    const roleColor = { MEDICAL: 'text-emerald-400', LAB: 'text-amber-400', TRANSIT: 'text-sky-400', ADMIN: 'text-yellow-400', PUBLIC: 'text-[#4A5568]' };

    return (
        <div className="min-h-full p-6">
            <div className="max-w-lg mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#F0F4F8]">My Profile</h1>
                        <p className="text-sm text-[#8899A8] mt-0.5">Manage your account details</p>
                    </div>
                    <span className={`text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-[rgba(255,255,255,0.05)] ${roleColor[user?.role] || 'text-[#8899A8]'}`}>
                        {user?.role}
                    </span>
                </div>

                {/* Card */}
                <div className="card overflow-hidden">
                    <div className="h-20" style={{ background: 'linear-gradient(90deg, #6B1423, #A81F38)' }} />
                    <div className="px-6 pb-6">
                        <div className="-mt-8 mb-4 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black border-4"
                          style={{ background: '#111422', borderColor: '#0C0F1A', color: '#00FF88' }}>
                            {(profile?.name || user?.name || '?')[0].toUpperCase()}
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-[#8899A8] mb-1">Full Name</label>
                                <input className="w-full rounded-lg border border-white/[0.08] bg-[#111422] px-3 py-2 text-sm text-[#F0F4F8] outline-none focus:border-brand-red-400 focus:ring-2 focus:ring-brand-red-100 transition"
                                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#8899A8] mb-1">Email</label>
                                <input className="w-full rounded-lg border border-white/[0.08] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-sm text-[#8899A8] cursor-not-allowed" value={profile?.email || user?.email || ''} disabled />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#8899A8] mb-1">Facility / Hospital</label>
                                <input className="w-full rounded-lg border border-white/[0.08] bg-[#111422] px-3 py-2 text-sm text-[#F0F4F8] outline-none focus:border-brand-red-400 focus:ring-2 focus:ring-brand-red-100 transition"
                                    placeholder="e.g. Princess Marina Hospital" value={form.facilityId} onChange={e => setForm({ ...form, facilityId: e.target.value })} />
                            </div>

                            {error && <p className="text-xs text-[#FF2D55] bg-[rgba(255,45,85,0.08)] border border-[rgba(255,45,85,0.25)] rounded-lg px-3 py-2">{error}</p>}
                            {saved && <p className="text-xs text-[#00FF88] bg-[rgba(0,255,136,0.08)] border border-emerald-200 rounded-lg px-3 py-2">✓ Profile saved</p>}

                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={saving}
                                    className="flex-1 rounded-lg bg-brand-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-700 disabled:opacity-60 transition">
                                    {saving ? 'Saving…' : 'Save Changes'}
                                </button>
                                <button type="button" onClick={() => logout()}
                                    className="rounded-lg border border-white/[0.08] px-4 py-2.5 text-sm font-medium text-[#8899A8] hover:bg-[#111422] transition">
                                    Sign Out
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Info panel */}
                <div className="card p-5 space-y-3">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-[#4A5568]">Account Info</h2>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><p className="text-xs text-[#4A5568]">User ID</p><p className="font-mono text-[#E2E8F0] truncate text-xs">{profile?.id?.slice(0, 12) ?? '—'}…</p></div>
                        <div><p className="text-xs text-[#4A5568]">Role</p><p className="font-semibold text-[#E2E8F0]">{profile?.role ?? user?.role}</p></div>
                        <div><p className="text-xs text-[#4A5568]">Status</p><p className={`font-semibold ${profile?.status === 'ACTIVE' ? 'text-[#00FF88]' : 'text-[#FF2D55]'}`}>{profile?.status ?? 'ACTIVE'}</p></div>
                        <div><p className="text-xs text-[#4A5568]">Member Since</p><p className="text-[#E2E8F0]">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
