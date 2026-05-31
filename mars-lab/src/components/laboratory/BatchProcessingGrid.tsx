import { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react'
import { useReactTable, getCoreRowModel, flexRender, type ColumnDef } from '@tanstack/react-table'
import { useWedgeScanner } from '../../hooks/useWedgeScanner'
import { ScanLine } from 'lucide-react'
import ReactiveModal, { type Pathogen } from './ReactiveModal'

// ── Types ──────────────────────────────────────────────────────────────
type TtiResult = 'PENDING' | 'NEGATIVE' | 'REACTIVE'

export interface BloodUnit {
  id:         string
  bloodGroup: string
  collectedAt: string   // ISO timestamp
  hiv:        TtiResult
  hbsag:      TtiResult
  hcv:        TtiResult
  syphilis:   TtiResult
  malaria:    TtiResult
  status:     'IN_PROCESSING' | 'SAFE' | 'DISCARD' | 'SPLIT'
}

export interface BatchProcessingGridRef {
  getProcessedUnits: () => BloodUnit[]
}

// ── Seed data — realistic batch queue ─────────────────────────────────
const SEED: BloodUnit[] = [
  { id: 'BC-2026-0044', bloodGroup: 'O+',  collectedAt: new Date(Date.now()-2*3600000).toISOString(), hiv:'PENDING', hbsag:'PENDING', hcv:'PENDING', syphilis:'PENDING', malaria:'PENDING', status:'IN_PROCESSING' },
  { id: 'BC-2026-0043', bloodGroup: 'A−',  collectedAt: new Date(Date.now()-3*3600000).toISOString(), hiv:'PENDING', hbsag:'PENDING', hcv:'PENDING', syphilis:'PENDING', malaria:'PENDING', status:'IN_PROCESSING' },
  { id: 'BC-2026-0042', bloodGroup: 'B+',  collectedAt: new Date(Date.now()-4*3600000).toISOString(), hiv:'PENDING', hbsag:'PENDING', hcv:'PENDING', syphilis:'PENDING', malaria:'PENDING', status:'IN_PROCESSING' },
  { id: 'BC-2026-0041', bloodGroup: 'AB−', collectedAt: new Date(Date.now()-5*3600000).toISOString(), hiv:'PENDING', hbsag:'PENDING', hcv:'PENDING', syphilis:'PENDING', malaria:'PENDING', status:'IN_PROCESSING' },
  { id: 'BC-2026-0040', bloodGroup: 'O−',  collectedAt: new Date(Date.now()-6*3600000).toISOString(), hiv:'PENDING', hbsag:'PENDING', hcv:'PENDING', syphilis:'PENDING', malaria:'PENDING', status:'IN_PROCESSING' },
]

// ── TTI chip ───────────────────────────────────────────────────────────
function TtiChip({ value, isMalaria }: { value: TtiResult; isMalaria?: boolean }) {
  if (value === 'REACTIVE') {
    const color = isMalaria ? '#FFB800' : '#FF2D55'
    const bg    = isMalaria ? 'rgba(255,184,0,0.1)' : 'rgba(255,45,85,0.1)'
    const border= isMalaria ? 'rgba(255,184,0,0.4)' : 'rgba(255,45,85,0.4)'
    return (
      <span
        className="tti-reactive inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] font-bold"
        style={{ background: bg, border: `1px solid ${border}`, color }}
      >
        <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
        RX
      </span>
    )
  }
  if (value === 'NEGATIVE') {
    return (
      <span
        className="inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] font-semibold"
        style={{ background: 'rgba(0,255,136,0.07)', border: '1px solid rgba(0,255,136,0.2)', color: '#00FF88' }}
      >
        <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: '#00FF88' }} />
        NEG
      </span>
    )
  }
  return (
    <span
      className="inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px]"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#4A5568' }}
    >
      —
    </span>
  )
}

// ── Status chip ────────────────────────────────────────────────────────
function StatusChip({ value }: { value: BloodUnit['status'] }) {
  const cfg = {
    IN_PROCESSING: { label: 'Processing', bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)', color: '#8899A8' },
    SAFE:          { label: 'Cleared',    bg: 'rgba(0,255,136,0.08)',   border: 'rgba(0,255,136,0.25)',   color: '#00FF88' },
    DISCARD:       { label: 'Discard',    bg: 'rgba(255,45,85,0.08)',   border: 'rgba(255,45,85,0.3)',    color: '#FF2D55' },
    SPLIT:         { label: 'Split',      bg: 'rgba(91,164,212,0.1)',   border: 'rgba(91,164,212,0.3)',   color: '#5BA4D4' },
  }[value]
  return (
    <span
      className="inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] font-semibold"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
    >
      {cfg.label}
    </span>
  )
}

// ── Keyboard shortcut hint ─────────────────────────────────────────────
function Key({ k, label, color }: { k: string; label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <kbd
        className="inline-flex items-center justify-center rounded font-mono text-[10px] font-bold px-1.5 py-0.5 min-w-[22px]"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#F0F4F8' }}
      >
        {k}
      </kbd>
      <span className="text-[10px] font-medium" style={{ color }}>{label}</span>
    </span>
  )
}

// ── Time formatting ────────────────────────────────────────────────────
function formatAge(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 60)  return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  return `${hrs}h ${mins % 60}m ago`
}

// ── Main component ─────────────────────────────────────────────────────
const BatchProcessingGrid = forwardRef<BatchProcessingGridRef>((_, ref) => {
  const scannedCode = useWedgeScanner()

  const [data,          setData]          = useState<BloodUnit[]>(SEED)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [reactiveModal, setReactiveModal] = useState(false)

  useImperativeHandle(ref, () => ({ getProcessedUnits: () => data }))

  // Scanner: jump to scanned unit
  useEffect(() => {
    if (!scannedCode) return
    const idx = data.findIndex(u => u.id === scannedCode)
    if (idx !== -1) setSelectedIndex(idx)
  }, [scannedCode, data])

  // Keyboard macros
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (data.length === 0) return
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.closest('[role="dialog"]')) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, data.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === '1') {
        e.preventDefault()
        setData(prev => {
          const next = [...prev]
          next[selectedIndex] = {
            ...next[selectedIndex],
            hiv: 'NEGATIVE', hbsag: 'NEGATIVE', hcv: 'NEGATIVE',
            syphilis: 'NEGATIVE', malaria: 'NEGATIVE',
            status: 'SAFE',
          }
          return next
        })
      } else if (e.key === '2') {
        e.preventDefault()
        setReactiveModal(true)
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault()
        setData(prev => {
          const next = [...prev]
          const parent = next[selectedIndex]
          next.splice(selectedIndex, 1,
            { ...parent, id: `${parent.id}-RBC`, status: 'SPLIT' },
            { ...parent, id: `${parent.id}-FFP`, status: 'SPLIT' },
            { ...parent, id: `${parent.id}-PLT`, status: 'SPLIT' },
          )
          return next
        })
      }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [selectedIndex, data])

  // Reactive modal confirmation
  const handleReactiveConfirm = (pathogens: Pathogen[]) => {
    setData(prev => {
      const next = [...prev]
      const updates: Partial<BloodUnit> = { status: 'DISCARD' }
      pathogens.forEach(p => {
        const key = p === 'hbsag' ? 'hbsag' : p as keyof BloodUnit
        ;(updates as Record<string, TtiResult>)[key] = 'REACTIVE'
      })
      next[selectedIndex] = { ...next[selectedIndex], ...updates }
      return next
    })
    setReactiveModal(false)
  }

  const columns = useMemo<ColumnDef<BloodUnit>[]>(() => [
    {
      accessorKey: 'id',
      header: 'Unit ID',
      cell: info => (
        <span className="font-mono-ui text-[11px] font-semibold" style={{ color: '#8EC4E8' }}>
          {info.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: 'bloodGroup',
      header: 'Grp',
      cell: info => (
        <span className="font-mono-ui text-sm font-extrabold" style={{ color: '#D96070' }}>
          {info.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: 'collectedAt',
      header: 'Age',
      cell: info => (
        <span className="font-mono text-[10px]" style={{ color: '#4A5568' }}>
          {formatAge(info.getValue() as string)}
        </span>
      ),
    },
    {
      accessorKey: 'hiv',
      header: 'HIV 1/2',
      cell: info => <TtiChip value={info.getValue() as TtiResult} />,
    },
    {
      accessorKey: 'hbsag',
      header: 'HBsAg',
      cell: info => <TtiChip value={info.getValue() as TtiResult} />,
    },
    {
      accessorKey: 'hcv',
      header: 'HCV Ab',
      cell: info => <TtiChip value={info.getValue() as TtiResult} />,
    },
    {
      accessorKey: 'syphilis',
      header: 'RPR',
      cell: info => <TtiChip value={info.getValue() as TtiResult} />,
    },
    {
      accessorKey: 'malaria',
      header: 'Malaria',
      cell: info => <TtiChip value={info.getValue() as TtiResult} isMalaria />,
    },
    {
      accessorKey: 'status',
      header: 'Result',
      cell: info => <StatusChip value={info.getValue() as BloodUnit['status']} />,
    },
  ], [])

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

  const selectedUnit = data[selectedIndex]

  return (
    <>
      <div
        className="w-full h-full flex flex-col rounded-xl overflow-hidden"
        style={{ background: '#0C0F1A', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* ── Grid header ─────────────────────────────────────────── */}
        <div
          className="shrink-0 flex items-center justify-between gap-4 px-5 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#111422' }}
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: '#4A5568' }}>
                Active batch · {data.length} units
              </span>
              {selectedUnit && (
                <span className="font-mono text-[10px]" style={{ color: '#4A5568' }}>
                  · selected: <span style={{ color: '#8EC4E8' }}>{selectedUnit.id}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <Key k="↑↓" label="Navigate"         color="#8899A8" />
              <Key k="1"  label="All negative"      color="#00FF88" />
              <Key k="2"  label="Mark reactive"     color="#FF2D55" />
              <Key k="S"  label="Split component"   color="#5BA4D4" />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {scannedCode && (
              <div
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-[11px]"
                style={{ background: 'rgba(0,200,255,0.07)', border: '1px solid rgba(0,200,255,0.22)', color: '#00C8FF' }}
              >
                <ScanLine className="h-3.5 w-3.5" />
                {scannedCode}
              </div>
            )}
            {/* Reactive button — keyboard shortcut alternative */}
            <button
              type="button"
              onClick={() => setReactiveModal(true)}
              disabled={!selectedUnit || selectedUnit.status !== 'IN_PROCESSING'}
              className="rounded-lg px-3 py-1.5 text-[11px] font-bold transition disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background:   'rgba(255,45,85,0.08)',
                border:       '1px solid rgba(255,45,85,0.3)',
                color:        '#FF2D55',
              }}
              onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = 'rgba(255,45,85,0.14)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,45,85,0.08)' }}
            >
              Mark Reactive
            </button>
          </div>
        </div>

        {/* ── Table ─────────────────────────────────────────────── */}
        <div className="flex-1 overflow-auto scroll-thin">
          <table className="w-full text-left border-collapse">
            <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: '#0C0F1A' }}>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {hg.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-4 py-2.5 font-mono text-[9px] font-semibold uppercase tracking-[0.16em]"
                      style={{ color: '#4A5568' }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row, idx) => {
                const isSelected = idx === selectedIndex
                const unit       = row.original
                const isReactive = unit.status === 'DISCARD'

                return (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedIndex(idx)}
                    className="cursor-pointer transition-colors"
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      borderLeft:   isSelected
                        ? '2px solid #A81F38'
                        : isReactive
                          ? '2px solid rgba(255,45,85,0.35)'
                          : '2px solid transparent',
                      background: isSelected
                        ? 'rgba(168,31,56,0.07)'
                        : isReactive
                          ? 'rgba(255,45,85,0.03)'
                          : 'transparent',
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isReactive ? 'rgba(255,45,85,0.03)' : 'transparent' }}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>

          {data.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16" style={{ color: '#4A5568' }}>
              <div className="font-mono text-[11px] uppercase tracking-widest">No units in queue</div>
              <div className="font-mono text-[10px] mt-1" style={{ color: '#2E3548' }}>
                Use Intake to log incoming specimens
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reactive modal */}
      {reactiveModal && selectedUnit && (
        <ReactiveModal
          unitId={selectedUnit.id}
          bloodType={selectedUnit.bloodGroup}
          onClose={() => setReactiveModal(false)}
          onConfirm={handleReactiveConfirm}
        />
      )}
    </>
  )
})

BatchProcessingGrid.displayName = 'BatchProcessingGrid'
export default BatchProcessingGrid
