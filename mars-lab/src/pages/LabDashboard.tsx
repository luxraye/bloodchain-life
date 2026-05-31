import { useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import BatchProcessingGrid, { type BatchProcessingGridRef } from '../components/laboratory/BatchProcessingGrid'
import IntakeView   from '../components/laboratory/IntakeView'
import ResultsView  from '../components/laboratory/ResultsView'
import { generateCustodyManifest } from '../lib/pdf/ComplianceManifest'
import {
  FlaskConical, ArrowDownToLine,
  BarChart3, FileText, Thermometer, Activity, Cpu,
} from 'lucide-react'

// ── View definitions ───────────────────────────────────────────────────
type ViewId = 'screening' | 'intake' | 'results'

const VIEWS: { id: ViewId; icon: React.ReactNode; label: string; shortLabel: string }[] = [
  {
    id:          'screening',
    icon:        <FlaskConical className="h-4 w-4" />,
    label:       'Screening Queue',
    shortLabel:  'Screen',
  },
  {
    id:          'intake',
    icon:        <ArrowDownToLine className="h-4 w-4" />,
    label:       'Specimen Intake',
    shortLabel:  'Intake',
  },
  {
    id:          'results',
    icon:        <BarChart3 className="h-4 w-4" />,
    label:       'Shift Results',
    shortLabel:  'Results',
  },
]

// ── Instrument telemetry data ──────────────────────────────────────────
const INSTRUMENTS = [
  {
    id:     'centrifuge-a',
    name:   'Centrifuge A',
    model:  'Hettich ROTINA 380R',
    status: 'running' as const,
    detail: '12 min remaining',
    icon:   <Activity className="h-3.5 w-3.5" />,
  },
  {
    id:     'analyzer',
    name:   'TTI Analyzer',
    model:  'Abbott Architect i1000SR',
    status: 'idle' as const,
    detail: 'Awaiting rack',
    icon:   <Cpu className="h-3.5 w-3.5" />,
  },
  {
    id:     'fridge-4',
    name:   'Refrigerator 4',
    model:  'Helmer iLR105',
    status: 'nominal' as const,
    detail: '4.2°C ± 0.1',
    icon:   <Thermometer className="h-3.5 w-3.5" />,
  },
]

const INSTRUMENT_STYLE = {
  running: { dot: '#FF2D55', label: '#FF2D55', glow: 'rgba(255,45,85,0.5)', ping: true  },
  idle:    { dot: '#00FF88', label: '#00FF88', glow: 'rgba(0,255,136,0.4)', ping: false },
  nominal: { dot: '#00C8FF', label: '#00C8FF', glow: 'rgba(0,200,255,0.4)', ping: false },
  alert:   { dot: '#FFB800', label: '#FFB800', glow: 'rgba(255,184,0,0.5)', ping: true  },
}

// ── Main dashboard ─────────────────────────────────────────────────────
export default function LabDashboard() {
  const { user }    = useAuth()
  const gridRef     = useRef<BatchProcessingGridRef>(null)
  const [view, setView] = useState<ViewId>('screening')

  const handleExportManifest = () => {
    if (gridRef.current) {
      generateCustodyManifest(
        `BATCH-${new Date().getTime().toString().slice(-6)}`,
        gridRef.current.getProcessedUnits(),
        user?.name || 'Unknown Analyst',
      )
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: '#07090F' }}>

      {/* ── Top sub-header: title + instruments + export ─────────────── */}
      <div
        className="shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0C0F1A' }}
      >
        {/* Title row */}
        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: '#A81F38' }}
              >
                Mars · Lab Workstation
              </span>
              <span
                className="font-mono text-[9px] font-semibold uppercase tracking-widest rounded px-1.5 py-0.5"
                style={{ background: 'rgba(168,31,56,0.1)', color: '#D96070', border: '1px solid rgba(168,31,56,0.2)' }}
              >
                TTI Screening
              </span>
            </div>
            <div className="h-4 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <h1 className="text-sm font-semibold" style={{ color: '#F0F4F8' }}>
              {VIEWS.find(v => v.id === view)?.label}
            </h1>
          </div>

          <button
            onClick={handleExportManifest}
            className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition"
            style={{
              background:  'rgba(255,255,255,0.04)',
              border:      '1px solid rgba(255,255,255,0.09)',
              color:       '#8899A8',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background   = 'rgba(0,255,136,0.06)'
              e.currentTarget.style.borderColor  = 'rgba(0,255,136,0.3)'
              e.currentTarget.style.color        = '#00FF88'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background   = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.borderColor  = 'rgba(255,255,255,0.09)'
              e.currentTarget.style.color        = '#8899A8'
            }}
          >
            <FileText className="h-3.5 w-3.5" />
            Export MoH Manifest
          </button>
        </div>

        {/* Instrument telemetry strip */}
        <div
          className="grid gap-px"
          style={{
            gridTemplateColumns: `repeat(${INSTRUMENTS.length}, 1fr)`,
            background: 'rgba(255,255,255,0.04)',
            borderTop:  '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {INSTRUMENTS.map(inst => {
            const s = INSTRUMENT_STYLE[inst.status]
            return (
              <div
                key={inst.id}
                className="flex items-center gap-3 px-5 py-2.5"
                style={{ background: '#07090F' }}
              >
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.04)', color: s.label, border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  {inst.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="relative flex-shrink-0">
                      {s.ping && (
                        <span
                          className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-60"
                          style={{ background: s.dot }}
                        />
                      )}
                      <span
                        className="relative flex h-1.5 w-1.5 rounded-full"
                        style={{ background: s.dot, boxShadow: `0 0 5px ${s.glow}` }}
                      />
                    </div>
                    <span
                      className="font-mono text-[9px] font-semibold uppercase tracking-widest"
                      style={{ color: s.label }}
                    >
                      {inst.status}
                    </span>
                  </div>
                  <p className="truncate text-[11px] font-medium" style={{ color: '#F0F4F8' }}>{inst.name}</p>
                  <p className="truncate font-mono text-[9px]" style={{ color: '#4A5568' }}>
                    {inst.model} · {inst.detail}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Body: sidebar nav + view ──────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Sidebar */}
        <nav
          className="flex flex-col shrink-0 py-3 gap-1"
          style={{
            width:       '56px',
            background:  '#0C0F1A',
            borderRight: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {VIEWS.map(v => {
            const active = view === v.id
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setView(v.id)}
                title={v.label}
                className="relative mx-1.5 flex items-center justify-center rounded-lg h-9 transition-all duration-150"
                style={{
                  background:  active ? 'rgba(168,31,56,0.15)' : 'transparent',
                  border:      `1px solid ${active ? 'rgba(168,31,56,0.3)' : 'transparent'}`,
                  color:       active ? '#A81F38' : '#4A5568',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#8899A8' } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4A5568' } }}
              >
                {v.icon}
                {active && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full"
                    style={{ background: '#A81F38', boxShadow: '0 0 6px rgba(168,31,56,0.6)' }}
                  />
                )}
              </button>
            )
          })}

          {/* Divider */}
          <div className="my-2 mx-2 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

        </nav>

        {/* Main content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          {view === 'screening' && (
            <div className="h-full p-4">
              <BatchProcessingGrid ref={gridRef} />
            </div>
          )}
          {view === 'intake'    && <IntakeView />}
          {view === 'results'   && <ResultsView />}
        </div>
      </div>

    </div>
  )
}
