import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getMyProfile, updateMyProfile } from '../services/api'

export function ProfilePage() {
    const { user, logout } = useAuth()
    const [profile, setProfile] = useState<any>(null)
    const [form, setForm] = useState({ name: '', bloodType: '', facilityId: '' })
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        getMyProfile().then((p: any) => {
            if (p) { setProfile(p); setForm({ name: p.name || '', bloodType: p.bloodType || '', facilityId: p.facilityId || '' }) }
        })
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true); setError(''); setSaved(false)
        try {
            const updated = await updateMyProfile(form)
            setProfile(updated); setSaved(true)
            setTimeout(() => setSaved(false), 2500)
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Failed to save')
        } finally { setSaving(false) }
    }

    return (
        <div className="flex h-full flex-col bg-slate-950">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-xl font-bold text-slate-100 font-mono">Profile</h1>
                    <p className="text-xs text-slate-500 mt-0.5">NBTS · Mars Lab Workstation</p>
                </div>

                {/* Avatar + form */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-cyan-500/20">
                            {(profile?.name || user?.name || '?')[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-100">{profile?.name || user?.name}</p>
                            <p className="text-xs text-slate-500 font-mono">{profile?.email || user?.email}</p>
                            <span className="inline-block mt-1 text-[11px] font-mono font-bold text-cyan-400 bg-cyan-500/10 rounded px-1.5 py-0.5">
                                {profile?.role || user?.role}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="space-y-3">
                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Full Name</label>
                            <input className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 font-mono text-xs text-slate-200 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">NBTS Center / Facility</label>
                            <input className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 font-mono text-xs text-slate-200 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                                placeholder="e.g. NBTS Gaborone" value={form.facilityId} onChange={e => setForm({ ...form, facilityId: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Email</label>
                            <input className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-xs text-slate-500 cursor-not-allowed"
                                value={profile?.email || user?.email || ''} disabled />
                        </div>

                        {error && <p className="text-xs text-red-400 bg-red-950/60 border border-red-900 rounded-lg px-3 py-2">{error}</p>}
                        {saved && <p className="text-xs text-cyan-400 bg-cyan-950/60 border border-cyan-900 rounded-lg px-3 py-2">✓ Profile saved</p>}

                        <div className="flex gap-2 pt-1">
                            <button type="submit" disabled={saving}
                                className="flex-1 rounded-lg bg-cyan-600 py-2 text-xs font-semibold text-white hover:bg-cyan-500 disabled:opacity-60 transition">
                                {saving ? 'Saving…' : 'Save Changes'}
                            </button>
                            <button type="button" onClick={() => logout()}
                                className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-400 hover:text-red-400 hover:border-red-700 transition">
                                Sign Out
                            </button>
                        </div>
                    </form>
                </div>

                {/* Account info */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Account Details</p>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div><p className="text-slate-500">Status</p><p className={`font-bold ${profile?.status === 'ACTIVE' ? 'text-emerald-400' : 'text-red-400'}`}>{profile?.status ?? 'ACTIVE'}</p></div>
                        <div><p className="text-slate-500">Role</p><p className="font-bold text-cyan-400">{profile?.role ?? user?.role}</p></div>
                        <div className="col-span-2"><p className="text-slate-500">User ID</p><p className="font-mono text-slate-500 text-[10px]">{profile?.id ?? '—'}</p></div>
                        <div className="col-span-2"><p className="text-slate-500">Member Since</p><p className="text-slate-300">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}</p></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
