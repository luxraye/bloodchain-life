import { useState, useEffect, useCallback } from 'react'
import { Clock, RefreshCw, X } from 'lucide-react'
import apiClient from '../lib/api'
import { mockLabAssets } from '../mockData'

// ── Action colour map (BC token colours) ──────────────────────────────
const ACTION_COLOR: Record<string, { bg: string; text: string }> = {
  Released:              { bg: 'rgba(0,255,136,0.1)',    text: '#00FF88' },
  Screened:              { bg: 'rgba(0,200,255,0.1)',    text: '#00C8FF' },
  Collected:             { bg: 'rgba(91,164,212,0.1)',   text: '#5BA4D4' },
  Quarantined:           { bg: 'rgba(255,184,0,0.1)',    text: '#FFB800' },
  'Dispatched for Transit': { bg: 'rgba(255,184,0,0.1)', text: '#FFB800' },
  Administered:          { bg: 'rgba(168,31,56,0.12)',   text: '#D96070' },
  Discarded:             { bg: 'rgba(255,45,85,0.1)',    text: '#FF2D55' },
}

function fallback(c: { bg: string; text: string }) { return c }
function actionStyle(action: string) {
  return fallback(ACTION_COLOR[action] ?? { bg: 'rgba(255,255,255,0.05)', text: '#8899A8' })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

// ── Mock entries derived from mockData ─────────────────────────────────
const MOCK_ENTRIES = mockLabAssets.flatMap(asset =>
  asset.chainOfCustody.map((evt, i) => ({
    id:              `${asset.id}-${i}`,
    assetId:         asset.id,
    actionPerformed: evt.action.split('—')[0].trim().split(' ').slice(0, 2).join(' '),
    userName:        evt.actor,
    userRole:        'LAB',
    facility:        'Gaborone HQ',
    createdAt:       evt.time,
  }))
).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 20)

interface LogEntry {
  id: string
  assetId: string | null
  actionPerformed: string
  userName: string
  userRole: string
  facility: string
  createdAt: string
}

interface Props {
  onClose?: () => void
}

export default function ShiftSyncLog({ onClose }: Props) {
  const [logs,        setLogs]        = useState<LogEntry[]>([])
  const [loading,     setLoading]     = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchLogs = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/activity/shift-sync')
      setLogs(data.data ?? [])
      setLastUpdated(new Date())
    } catch {
      // No backend — use mock data
      setLogs(MOCK_ENTRIES)
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLogs()
    const interval = setInterval(fetchLogs, 30_000)
    return () => clearInterval(interval)
  }, [fetchLogs])

  return (
    <div
      className="fixed right-0 top-0 h-full w-72 z-40 flex flex-col animate-slide-in-right"
      style={{
        background:  '#0C0F1A',
        borderLeft:  '1px solid rgba(255,255,255,0.07)',
        boxShadow:   '-12px 0 40px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#111422' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: '#00C8FF', boxShadow: '0 0 6px rgba(0,200,255,0.5)', animation: 'glow-pulse 2s ease-in-out infinite' }}
          />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: '#00C8FF' }}>
            Shift Sync
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={fetchLogs}
            className="flex h-7 w-7 items-center justify-center rounded-lg transition"
            style={{ color: '#4A5568' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#8899A8' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4A5568' }}
            title="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg transition"
              style={{ color: '#4A5568' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#F0F4F8' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4A5568' }}
              title="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {lastUpdated && (
        <div
          className="px-4 py-1.5 font-mono text-[9px]"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#2E3548' }}
        >
          Updated {lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} · auto-refresh 30s
        </div>
      )}

      {/* Log entries */}
      <div className="flex-1 overflow-y-auto scroll-thin py-1.5">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div
              className="h-5 w-5 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgba(255,255,255,0.1)', borderTopColor: '#00C8FF' }}
            />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Clock className="h-7 w-7 mb-2" style={{ color: '#2E3548' }} />
            <p className="text-xs" style={{ color: '#4A5568' }}>No team activity today</p>
          </div>
        ) : logs.map(log => {
          const style  = actionStyle(log.actionPerformed)
          const unitId = log.assetId ? log.assetId.slice(-7).toUpperCase() : null
          return (
            <div
              key={log.id}
              className="px-4 py-2.5 transition-colors"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span
                  className="inline-flex rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide"
                  style={{ background: style.bg, color: style.text }}
                >
                  {log.actionPerformed}
                </span>
                <span className="font-mono text-[9px] shrink-0" style={{ color: '#4A5568' }}>
                  {formatTime(log.createdAt)}
                </span>
              </div>
              <p className="text-xs" style={{ color: '#8899A8' }}>
                <span style={{ color: '#F0F4F8', fontWeight: 600 }}>{log.userName.split(' ')[0]}</span>
                {' '}
                <span style={{ color: '#4A5568' }}>({log.userRole})</span>
                {unitId && (
                  <span className="font-mono-ui" style={{ color: '#4A5568' }}> · {unitId}</span>
                )}
              </p>
              <p className="font-mono text-[9px] mt-0.5 truncate" style={{ color: '#2E3548' }}>
                {log.facility}
              </p>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div
        className="px-4 py-2.5 shrink-0 font-mono text-[9px]"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: '#2E3548' }}
      >
        {logs.length} event{logs.length !== 1 ? 's' : ''} this shift
      </div>
    </div>
  )
}
