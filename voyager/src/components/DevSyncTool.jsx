/**
 * DevSyncTool — floating DB inspector/sync panel (dev-only).
 * Lets the presenter copy/paste bloodchain_db between browser tabs on
 * different ports (scyther:5173, mars-lab:5174, voyager:5175, etc.)
 */
import { useState } from 'react';

const DB_KEY = 'bloodchain_db';

export default function DevSyncTool() {
    if (!import.meta.env.DEV) return null;

    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(null);

    function flash(msg) {
        setStatus(msg);
        setTimeout(() => setStatus(null), 2500);
    }

    function copyDb() {
        const raw = localStorage.getItem(DB_KEY);
        if (!raw) { flash('⚠ DB is empty'); return; }
        navigator.clipboard.writeText(raw)
            .then(() => {
                const count = (JSON.parse(raw).assets ?? []).length;
                flash(`✓ Copied (${count} assets)`);
            })
            .catch(() => flash('✗ Clipboard denied'));
    }

    function importDb() {
        const json = window.prompt('Paste bloodchain_db JSON:');
        if (!json) return;
        try {
            JSON.parse(json);
            localStorage.setItem(DB_KEY, json);
            flash('✓ Imported — reloading…');
            setTimeout(() => window.location.reload(), 800);
        } catch {
            flash('✗ Invalid JSON');
        }
    }

    function clearDb() {
        if (!window.confirm('Clear bloodchain_db? Resets all data.')) return;
        localStorage.removeItem(DB_KEY);
        flash('✓ Cleared — reloading…');
        setTimeout(() => window.location.reload(), 800);
    }

    function dbStats() {
        try {
            const raw = localStorage.getItem(DB_KEY);
            if (!raw) return 'Empty';
            const db = JSON.parse(raw);
            return `${(db.assets ?? []).length} assets · ${(db.users ?? []).length} users`;
        } catch { return 'Parse error'; }
    }

    return (
        <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999, fontFamily: 'monospace', fontSize: 12 }}>
            <button
                onClick={() => setOpen(o => !o)}
                title="Dev Sync Tool"
                style={{ background: '#0f172a', border: '1px solid #d97706', borderRadius: 999, padding: '6px 12px', color: '#fbbf24', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
                🧬 DEV DB
            </button>

            {open && (
                <div style={{ position: 'absolute', bottom: 40, right: 0, width: 240, background: '#0f172acc', border: '1px solid #92400e66', borderRadius: 10, padding: 12, boxShadow: '0 8px 32px #000a' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ color: '#d97706', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Phantom Backend</span>
                        <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>✕</button>
                    </div>
                    <div style={{ background: '#1e293b', borderRadius: 6, padding: '6px 10px', color: '#94a3b8', fontSize: 10, marginBottom: 10 }}>
                        {dbStats()}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <button onClick={copyDb} style={{ background: '#422006aa', border: '1px solid #b45309aa', borderRadius: 6, padding: '6px 10px', color: '#fbbf24', cursor: 'pointer', textAlign: 'left' }}>
                            📋 Copy DB to Clipboard
                        </button>
                        <button onClick={importDb} style={{ background: '#0c4a6eaa', border: '1px solid #0284c7aa', borderRadius: 6, padding: '6px 10px', color: '#7dd3fc', cursor: 'pointer', textAlign: 'left' }}>
                            📥 Import DB (paste JSON)
                        </button>
                        <button onClick={clearDb} style={{ background: '#450a0aaa', border: '1px solid #991b1baa', borderRadius: 6, padding: '6px 10px', color: '#fca5a5', cursor: 'pointer', textAlign: 'left' }}>
                            🗑 Clear DB
                        </button>
                    </div>
                    {status && (
                        <div style={{ marginTop: 8, background: '#1e293b', borderRadius: 6, padding: '4px 8px', color: '#cbd5e1', fontSize: 10 }}>
                            {status}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
