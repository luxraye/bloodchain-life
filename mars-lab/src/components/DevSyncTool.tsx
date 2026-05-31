/**
 * DevSyncTool — floating DB inspector/sync panel (dev-only).
 *
 * Because each app runs on a different port, localStorage is isolated per
 * origin. This tool lets the presenter physically "move" data between apps
 * during a demo by copying and pasting the shared bloodchain_db JSON.
 *
 * Hidden automatically in production builds (import.meta.env.DEV).
 */
import { useState } from 'react'

const DB_KEY = 'bloodchain_db'

export default function DevSyncTool() {
    if (!import.meta.env.DEV) return null

    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState<string | null>(null)

    function flash(msg: string) {
        setStatus(msg)
        setTimeout(() => setStatus(null), 2500)
    }

    function copyDb() {
        const raw = localStorage.getItem(DB_KEY)
        if (!raw) { flash('⚠ DB is empty'); return }
        navigator.clipboard.writeText(raw)
            .then(() => {
                const count = (JSON.parse(raw).assets ?? []).length
                flash(`✓ Copied (${count} assets)`)
            })
            .catch(() => flash('✗ Clipboard denied — use HTTPS or localhost'))
    }

    function importDb() {
        const json = window.prompt('Paste bloodchain_db JSON:')
        if (!json) return
        try {
            JSON.parse(json) // validate
            localStorage.setItem(DB_KEY, json)
            flash('✓ Imported — reloading…')
            setTimeout(() => window.location.reload(), 800)
        } catch {
            flash('✗ Invalid JSON')
        }
    }

    function clearDb() {
        if (!window.confirm('Clear bloodchain_db? This resets all data.')) return
        localStorage.removeItem(DB_KEY)
        flash('✓ Cleared — reloading…')
        setTimeout(() => window.location.reload(), 800)
    }

    function dbStats() {
        try {
            const raw = localStorage.getItem(DB_KEY)
            if (!raw) return 'Empty'
            const db = JSON.parse(raw)
            return `${(db.assets ?? []).length} assets · ${(db.users ?? []).length} users`
        } catch { return 'Parse error' }
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 font-mono text-xs select-none">
            {/* Toggle button */}
            <button
                onClick={() => setOpen((o) => !o)}
                title="Dev Sync Tool"
                className="flex items-center gap-1.5 rounded-full border border-amber-500/60 bg-slate-950/90 px-3 py-1.5 text-amber-400 shadow-lg backdrop-blur hover:bg-slate-900 transition"
            >
                <span className="text-base leading-none">🧬</span>
                <span className="hidden sm:inline">DEV DB</span>
            </button>

            {/* Panel */}
            {open && (
                <div className="absolute bottom-10 right-0 w-64 rounded-lg border border-amber-500/40 bg-slate-950/95 p-3 shadow-2xl backdrop-blur">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest text-amber-500">Phantom Backend</span>
                        <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-300">✕</button>
                    </div>

                    <div className="mb-3 rounded border border-slate-800 bg-slate-900/60 px-2 py-1.5 text-[10px] text-slate-400">
                        {dbStats()}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <button
                            onClick={copyDb}
                            className="w-full rounded border border-amber-600/50 bg-amber-950/40 px-2 py-1.5 text-left text-amber-300 hover:bg-amber-950/70 transition"
                        >
                            📋 Copy DB to Clipboard
                        </button>
                        <button
                            onClick={importDb}
                            className="w-full rounded border border-sky-600/50 bg-sky-950/40 px-2 py-1.5 text-left text-sky-300 hover:bg-sky-950/70 transition"
                        >
                            📥 Import DB (paste JSON)
                        </button>
                        <button
                            onClick={clearDb}
                            className="w-full rounded border border-red-800/50 bg-red-950/30 px-2 py-1.5 text-left text-red-400 hover:bg-red-950/60 transition"
                        >
                            🗑 Clear DB
                        </button>
                    </div>

                    {status && (
                        <div className="mt-2 rounded bg-slate-800/80 px-2 py-1 text-[10px] text-slate-300">
                            {status}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
