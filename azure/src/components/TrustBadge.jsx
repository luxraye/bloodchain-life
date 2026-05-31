import { useState } from 'react'
import { Upload, ShieldCheck, Loader2, X, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { uploadVerificationDoc, submitForVerification } from '../services/api'

const TRUST = {
    1: { label: 'Bronze', sub: 'Self-Registered', color: 'from-amber-700 to-yellow-600', badge: '🟤', ring: 'ring-amber-700/40' },
    2: { label: 'Silver', sub: 'Verification Pending', color: 'from-slate-400 to-slate-300', badge: '⚪', ring: 'ring-slate-400/40' },
    3: { label: 'Gold', sub: 'Programme verified', color: 'from-emerald-500 to-teal-400', badge: '🔵', ring: 'ring-emerald-500/40' },
}

export default function TrustBadge({ trustLevel = 1, onUpgraded }) {
    const trust = TRUST[trustLevel] ?? TRUST[1]
    const [uploading, setUploading] = useState(false)
    const [file, setFile] = useState(null)
    const [error, setError] = useState(null)
    const [showUpload, setShowUpload] = useState(false)

    const handleUpload = async () => {
        if (!file) return
        setUploading(true)
        setError(null)
        try {
            const url = await uploadVerificationDoc(file)
            await submitForVerification(url)
            setShowUpload(false)
            onUpgraded?.()
        } catch (e) {
            setError(e.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key={trustLevel}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className={`flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-gradient-to-r ${trust.color} shadow-sm`}
                >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 text-2xl shadow-inner backdrop-blur-md">
                        {trust.badge}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                            <p className="text-base font-bold text-white drop-shadow-sm leading-none">{trust.label} Donor</p>
                            {trustLevel === 3 && <ShieldCheck className="w-4 h-4 text-emerald-100 drop-shadow-sm" />}
                        </div>
                        <p className="text-[11px] font-medium text-white/80 leading-snug mt-1">{trust.sub}</p>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Level 1 → 2 CTA */}
            {trustLevel === 1 && (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
                    <div>
                        <p className="text-sm font-bold text-amber-700">Verify your identity</p>
                        <p className="text-xs font-medium text-amber-900/60 mt-0.5">Upload your Omang (ID) to unlock fast-track donations and reach Silver status.</p>
                    </div>
                    {!showUpload ? (
                        <button
                            onClick={() => setShowUpload(true)}
                            className="flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-xl bg-amber-100 border border-amber-200 text-amber-700 text-sm font-bold hover:bg-amber-200 transition-colors shadow-sm"
                        >
                            <Upload className="w-4 h-4" /> Upload Omang / Medical PDF
                        </button>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="space-y-3 p-3 rounded-xl bg-white border border-amber-100 shadow-sm"
                        >
                            <div className="flex items-start gap-2">
                                <label className="flex-1 cursor-pointer rounded-xl border-2 border-dashed border-amber-200 hover:border-amber-400 bg-amber-50/50 p-4 text-center text-xs font-medium text-amber-700 hover:text-amber-600 transition-all flex flex-col items-center justify-center gap-2">
                                    {file ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Upload className="w-6 h-6 text-amber-400" />}
                                    {file ? file.name : 'Tap to select PDF or Image'}
                                    <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={e => setFile(e.target.files[0])} />
                                </label>
                                <button onClick={() => { setShowUpload(false); setFile(null); }} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            {error && <p className="text-xs font-medium text-red-500 bg-red-50 p-2 rounded-lg">{error}</p>}
                            <button
                                disabled={!file || uploading}
                                onClick={handleUpload}
                                className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-md"
                            >
                                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                                {uploading ? 'Encrypting & Uploading…' : 'Submit for Review'}
                            </button>
                        </motion.div>
                    )}
                </div>
            )}

            {/* Level 2 — waiting */}
            {trustLevel === 2 && (
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mt-0.5">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                        </span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-700">Verification in progress</p>
                        <p className="mt-0.5 text-[11px] font-medium text-slate-500">Your documents are under review by the national programme team. You will be notified upon approval.</p>
                    </div>
                </div>
            )}
        </div>
    )
}
