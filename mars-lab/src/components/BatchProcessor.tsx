import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { Camera, Filter, RefreshCw } from 'lucide-react'
import useSound from 'use-sound'
import type { LabAsset, LabAssetStatus } from '../types'
import { getAssets, scanAsset, splitAsset } from '../lib/assetsApi'
import { formatIsbt128 } from '../lib/isbt128'
import StatusBadge, { ViralBadge } from './StatusBadge'
import CustodyDrawer from './CustodyDrawer'
import SplitComponentModal from './SplitComponentModal'
import SupervisorVerifyModal from './SupervisorVerifyModal'

const successBeep = '/sounds/success-beep.mp3'
const alertBuzz = '/sounds/alert-buzz.mp3'

type StatusFilter = 'ALL' | LabAssetStatus

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })

function daysUntilExpiry(iso: string): number {
  return Math.floor((Date.parse(iso) - Date.now()) / 86_400_000)
}

function derivedViralStatus(asset: LabAsset): 'PENDING' | 'SAFE' | 'BIOHAZARD' {
  if (asset.status === 'BIOHAZARD' || asset.status === 'DISCARDED') return 'BIOHAZARD'
  if (!asset.viralScreening) return 'PENDING'
  const markers = Object.values(asset.viralScreening)
  if (markers.some((m) => m === 'POSITIVE')) return 'BIOHAZARD'
  if (markers.some((m) => m === 'PENDING')) return 'PENDING'
  return 'SAFE'
}

export function BatchProcessor() {
  const [units, setUnits] = useState<LabAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const fetchQueue = useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const list = await getAssets('COLLECTED')
      setUnits(list)
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : 'Failed to load queue')
      setUnits([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchQueue() }, [fetchQueue])

  const [barcode, setBarcode] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [bloodTypeFilter, setBloodTypeFilter] = useState('ALL')
  const [selectedAsset, setSelectedAsset] = useState<LabAsset | null>(null)

  // Modals
  const [splitTarget, setSplitTarget] = useState<LabAsset | null>(null)
  const [discardTarget, setDiscardTarget] = useState<LabAsset | null>(null)

  const [playSuccess] = useSound(successBeep, { volume: 0.35 })
  const [playAlert] = useSound(alertBuzz, { volume: 0.5 })

  // --- Summaries ---
  const summary = useMemo(() => {
    let incoming = 0, testing = 0, quarantine = 0, released = 0, biohazard = 0
    for (const u of units) {
      if (u.status === 'INCOMING') incoming++
      else if (u.status === 'TESTING') testing++
      else if (u.status === 'QUARANTINE') quarantine++
      else if (u.status === 'RELEASED') released++
      else if (u.status === 'BIOHAZARD' || u.status === 'DISCARDED') biohazard++
    }
    return { incoming, testing, quarantine, released, biohazard, total: units.length }
  }, [units])

  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      if (statusFilter !== 'ALL' && u.status !== statusFilter) return false
      if (bloodTypeFilter !== 'ALL' && u.bloodType !== bloodTypeFilter) return false
      return true
    })
  }, [units, statusFilter, bloodTypeFilter])

  const distinctBloodTypes = useMemo(
    () => Array.from(new Set(units.map((u) => u.bloodType))).sort(),
    [units],
  )

  // --- Actions ---
  const handleRelease = useCallback(async (asset: LabAsset) => {
    try {
      await scanAsset(asset.id, 'RELEASED', 'NBTS Main Lab')
      playSuccess()
      await fetchQueue()
    } catch {
      setFetchError('Failed to release unit')
    }
  }, [fetchQueue, playSuccess])

  const handleDiscardRequest = useCallback((asset: LabAsset) => {
    playAlert()
    setDiscardTarget(asset)
  }, [playAlert])

  const handleDiscardVerified = useCallback(async (assetId: string) => {
    try {
      await scanAsset(assetId, 'DISCARDED', 'NBTS Main Lab')
      await fetchQueue()
      setDiscardTarget(null)
      setSelectedAsset(null)
    } catch {
      setFetchError('Failed to discard unit')
    }
  }, [fetchQueue])

  const handleSplitConfirm = useCallback(async (assetId: string, components: string[]) => {
    try {
      await splitAsset(assetId, components)
      await fetchQueue()
    } catch {
      setFetchError('Failed to split unit')
    }
    setSplitTarget(null)
  }, [fetchQueue])

  // --- Barcode scan ---
  function handleScanSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = barcode.trim()
    if (!trimmed) return

    const existing = units.find((u) => u.id === trimmed)
    if (existing) {
      setSelectedAsset(existing)
      setBarcode('')
      return
    }

    const now = new Date().toISOString()
    const next: LabAsset = {
      id: trimmed,
      donorId: 'unknown',
      collectionTimestamp: now,
      expirationDate: new Date(Date.now() + 35 * 86_400_000).toISOString(),
      bloodType: 'O+',
      componentType: 'Whole Blood',
      viralScreening: { hiv: 'PENDING', hepB: 'PENDING', hepC: 'PENDING', syphilis: 'PENDING' },
      status: 'INCOMING',
      chainOfCustody: [{ actor: 'Scanner', action: 'SCANNED', time: now }],
    }
    setUnits((prev) => [next, ...prev])
    setSelectedAsset(next)
    playSuccess()
    setBarcode('')
  }

  // --- Keyboard shortcuts ---
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
      if (!selectedAsset) return
      if (event.key === '1') {
        event.preventDefault()
        handleRelease(selectedAsset)
      }
      if (event.key === '9') {
        event.preventDefault()
        if (selectedAsset.status !== 'BIOHAZARD' && selectedAsset.status !== 'DISCARDED') {
          handleDiscardRequest(selectedAsset)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedAsset, handleRelease, handleDiscardRequest])

  // --- Table columns ---
  const columns = useMemo<ColumnDef<LabAsset>[]>(
    () => [
      {
        accessorKey: 'id',
        header: () => <span className="font-mono-ui">ISBT-128</span>,
        cell: ({ row }) => (
          <span className="font-mono-ui text-xs text-cyan-300 whitespace-nowrap">
            {formatIsbt128(row.original.id)}
          </span>
        ),
        size: 170,
      },
      {
        accessorKey: 'bloodType',
        header: () => 'TYPE',
        cell: ({ getValue }) => (
          <span className="font-mono-ui rounded border border-slate-600 bg-slate-800 px-1.5 py-0.5 text-xs">
            {getValue() as string}
          </span>
        ),
        size: 60,
      },
      {
        accessorKey: 'collectionTimestamp',
        header: () => 'COLLECTED',
        cell: ({ getValue }) => (
          <span className="text-xs text-slate-300">{formatDate(getValue() as string)}</span>
        ),
        size: 90,
      },
      {
        id: 'expiry',
        header: () => 'EXPIRY',
        cell: ({ row }) => {
          const days = daysUntilExpiry(row.original.expirationDate)
          let color = 'text-emerald-400'
          if (days <= 0) color = 'text-red-400'
          else if (days <= 5) color = 'text-red-400'
          else if (days <= 14) color = 'text-amber-400'
          return <span className={`font-mono-ui text-xs font-medium ${color}`}>{days > 0 ? `${days}d` : 'EXP'}</span>
        },
        size: 55,
      },
      {
        id: 'viralStatus',
        header: () => 'SCREEN',
        cell: ({ row }) => <ViralBadge status={derivedViralStatus(row.original)} />,
        size: 100,
      },
      {
        accessorKey: 'status',
        header: () => 'STATUS',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
        size: 120,
      },
      {
        id: 'actions',
        header: () => 'ACTION',
        cell: ({ row }) => {
          const a = row.original
          const dead = a.status === 'RELEASED' || a.status === 'DISCARDED'
          if (dead) return <span className="text-[10px] text-slate-600">—</span>
          return (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-500"
                onClick={(e) => { e.stopPropagation(); handleRelease(a) }}
              >
                Release
              </button>
              <button
                type="button"
                className="rounded bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-red-500"
                onClick={(e) => { e.stopPropagation(); handleDiscardRequest(a) }}
              >
                Discard
              </button>
            </div>
          )
        },
        size: 160,
      },
    ],
    [handleRelease, handleDiscardRequest],
  )

  const table = useReactTable({
    data: filteredUnits,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  })

  return (
    <div className="flex flex-1 overflow-hidden bg-slate-950">
      {/* Main panel */}
      <div className="flex flex-1 flex-col">
        {/* Toolbar */}
        <header className="flex items-center justify-between border-b border-slate-800 px-5 py-2">
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">NBTS · Mars Lab</div>
              <div className="font-mono-ui text-sm text-slate-100">Processing Board</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1 rounded border border-slate-700 bg-slate-900 px-2 py-1 font-mono-ui text-slate-400">
              <span className="text-emerald-400">1</span> RELEASE
              <span className="mx-1 text-slate-700">|</span>
              <span className="text-red-400">9</span> DISCARD
            </div>
            <button
              type="button"
              onClick={fetchQueue}
              className="flex items-center gap-1 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300 hover:bg-slate-800"
            >
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
          </div>
        </header>

        {/* Summary cards */}
        <div className="grid grid-cols-6 gap-2 px-5 py-2">
          <SummaryCell label="Total" value={summary.total} tone="slate" />
          <SummaryCell label="Incoming" value={summary.incoming} tone="cyan" />
          <SummaryCell label="Testing" value={summary.testing} tone="sky" />
          <SummaryCell label="Quarantine" value={summary.quarantine} tone="amber" />
          <SummaryCell label="Released" value={summary.released} tone="green" />
          <SummaryCell label="Biohazard" value={summary.biohazard} tone="red" />
        </div>

        {/* Scan bar */}
        <div className="flex items-center gap-3 border-y border-slate-800 bg-slate-900/40 px-5 py-2">
          <form onSubmit={handleScanSubmit} className="flex flex-1 items-center gap-2">
            <label htmlFor="barcode" className="font-mono-ui text-[10px] uppercase tracking-[0.16em] text-slate-500">
              SCAN
            </label>
            <input
              id="barcode"
              autoFocus
              className="flex-1 rounded border border-slate-700 bg-slate-950 px-3 py-1.5 font-mono-ui text-sm text-cyan-200 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Present unit to scanner…"
            />
            <button
              type="button"
              onClick={() => { console.log('[CameraScan] Triggered — PWA integration pending') }}
              className="flex items-center gap-1 rounded border border-slate-600 bg-slate-800 px-2.5 py-1.5 text-[11px] text-slate-300 hover:bg-slate-700"
            >
              <Camera className="h-3.5 w-3.5" /> Scan with Camera
            </button>
          </form>
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <select
              className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-300"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            >
              <option value="ALL">All Status</option>
              <option value="INCOMING">Incoming</option>
              <option value="TESTING">Testing</option>
              <option value="QUARANTINE">Quarantine</option>
              <option value="RELEASED">Released</option>
              <option value="BIOHAZARD">Biohazard</option>
            </select>
            <select
              className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-300"
              value={bloodTypeFilter}
              onChange={(e) => setBloodTypeFilter(e.target.value)}
            >
              <option value="ALL">All Types</option>
              {distinctBloodTypes.map((bt) => (
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center gap-2 px-5 py-6 text-xs text-slate-400">
              <div className="h-4 w-4 border-2 border-cyan-500/40 border-t-cyan-400 rounded-full animate-spin" />
              Loading queue…
            </div>
          )}
          {fetchError && !loading && (
            <div className="flex items-center justify-between border-b border-red-500/40 bg-red-950/30 px-5 py-2 text-[11px] text-red-300">
              <span>{fetchError}</span>
              <button type="button" onClick={fetchQueue} className="rounded border border-red-500/50 px-2 py-0.5 hover:bg-red-900/50">
                Retry
              </button>
            </div>
          )}
          {!loading && !fetchError && filteredUnits.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-500">
              <div className="text-3xl">🧪</div>
              <p className="text-sm font-medium">No units in queue</p>
              <p className="text-xs">Collected blood units will appear here for processing.</p>
            </div>
          )}
          {!loading && filteredUnits.length > 0 && (
            <div className="h-full overflow-auto scroll-thin">
              <table className="min-w-full border-separate border-spacing-0 text-[11px]">
                <thead className="bg-slate-900/95">
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id}>
                      {hg.headers.map((h) => (
                        <th key={h.id} className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/95 px-2 py-1.5 text-left font-medium uppercase tracking-[0.16em] text-slate-500">
                          {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => {
                    const isBiohazard = row.original.status === 'BIOHAZARD' || row.original.status === 'DISCARDED'
                    const isSelected = selectedAsset?.id === row.original.id
                    return (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedAsset(row.original)}
                        className={[
                          'cursor-pointer border-b border-slate-800/60 transition-colors',
                          isBiohazard
                            ? 'bg-red-950/40 hover:bg-red-950/60'
                            : isSelected
                              ? 'bg-cyan-950/30 hover:bg-cyan-950/40'
                              : 'hover:bg-slate-900/80',
                        ].join(' ')}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-2 py-1.5 align-middle">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              {table.getPageCount() > 1 && (
                <div className="flex items-center justify-between border-t border-slate-800 px-4 py-2 text-[11px] text-slate-500">
                  <span>
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} ·{' '}
                    {filteredUnits.length} units
                  </span>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="rounded border border-slate-700 px-2 py-0.5 hover:bg-slate-800 disabled:opacity-30">
                      Prev
                    </button>
                    <button type="button" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="rounded border border-slate-700 px-2 py-0.5 hover:bg-slate-800 disabled:opacity-30">
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Side drawer */}
      {selectedAsset && (
        <CustodyDrawer
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onSplit={(a) => setSplitTarget(a)}
          onDiscard={(a) => handleDiscardRequest(a)}
          onRelease={(a) => handleRelease(a)}
        />
      )}

      {/* Modals */}
      {splitTarget && (
        <SplitComponentModal
          asset={splitTarget}
          onClose={() => setSplitTarget(null)}
          onConfirm={handleSplitConfirm}
        />
      )}
      {discardTarget && (
        <SupervisorVerifyModal
          asset={discardTarget}
          onClose={() => setDiscardTarget(null)}
          onVerified={handleDiscardVerified}
        />
      )}
    </div>
  )
}

type SummaryTone = 'slate' | 'cyan' | 'sky' | 'amber' | 'green' | 'red'

function SummaryCell({ label, value, tone }: { label: string; value: number; tone: SummaryTone }) {
  const colors: Record<SummaryTone, string> = {
    slate: 'text-slate-300',
    cyan: 'text-cyan-400',
    sky: 'text-sky-400',
    amber: 'text-amber-400',
    green: 'text-emerald-400',
    red: 'text-red-400',
  }
  return (
    <div className="rounded border border-slate-800 bg-slate-900/50 px-2.5 py-1.5">
      <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className={`font-mono-ui text-lg font-medium ${colors[tone]}`}>{value.toString().padStart(3, '0')}</div>
    </div>
  )
}
