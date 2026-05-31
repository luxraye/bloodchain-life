import { Link } from 'react-router-dom'
import { Truck, Thermometer, AlertTriangle, ChevronRight, Radio } from 'lucide-react'
import { useJobs } from '../context/JobContext'
import { needsColdChainAck, isUnassigned } from '../lib/jobUtils'
import { getShiftSyncLogs } from '../lib/shiftSyncBackground.js'
import ConstellationBoundary from '../components/ConstellationBoundary'
import NationalBloodMap from '../components/map/NationalBloodMap'
import ColdChainPanel from '../components/ColdChainPanel'
import StatusBadge from '../components/StatusBadge'
import CoordinatorJobActions from '../components/CoordinatorJobActions'

export default function CoordinatorDashboard() {
  const { jobs, jobsLoading } = useJobs()

  const inTransit = jobs.filter((j) => j.status === 'IN_TRANSIT')
  const pendingAssign = jobs.filter((j) => j.status === 'PENDING' && isUnassigned(j))
  const coldAlerts = jobs.filter(needsColdChainAck)
  const flagged = jobs.filter((j) => j.status === 'FLAGGED')
  const recentSync = getShiftSyncLogs().slice(0, 3)

  const priorityQueue = [...jobs]
    .filter((j) => ['IN_TRANSIT', 'PENDING', 'FLAGGED'].includes(j.status))
    .sort((a, b) => {
      const order = { FLAGGED: 0, IN_TRANSIT: 1, PENDING: 2 }
      const pa = a.priority === 'STAT' ? -1 : 0
      const pb = b.priority === 'STAT' ? -1 : 0
      if (pa !== pb) return pa - pb
      return (order[a.status] ?? 9) - (order[b.status] ?? 9)
    })
    .slice(0, 6)

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 pt-6 pb-3 lg:px-8 shrink-0">
        <ConstellationBoundary />
        <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Truck className="w-5 h-5" style={{ color: '#84cc16' }} />
              Logistics command
            </h1>
            <p className="text-xs text-neutral-500 font-mono mt-1">
              NATIONAL DISPATCH · COLD CHAIN · CUSTODY
            </p>
          </div>
          <Link
            to="/queue"
            className="text-xs font-medium px-3 py-1.5 rounded-lg border transition"
            style={{ color: '#84cc16', borderColor: 'rgba(132,204,22,0.35)' }}
          >
            Full dispatch queue →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
          <div className="glass-card px-3 py-2 text-center">
            <p className="text-2xl font-bold" style={{ color: '#84cc16' }}>{inTransit.length}</p>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider">In transit</p>
          </div>
          <div className="glass-card px-3 py-2 text-center">
            <p className="text-2xl font-bold text-white">{pendingAssign.length}</p>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Unassigned</p>
          </div>
          <div className="glass-card px-3 py-2 text-center">
            <p className="text-2xl font-bold text-amber-400">{coldAlerts.length}</p>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider flex items-center justify-center gap-1">
              <Thermometer className="w-3 h-3" /> Cold (unacked)
            </p>
          </div>
          <div className="glass-card px-3 py-2 text-center">
            <p className="text-2xl font-bold text-red-400">{flagged.length}</p>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Flagged</p>
          </div>
        </div>

        {coldAlerts.length > 0 && (
          <div
            className="mb-4 flex items-center gap-2 rounded-xl px-4 py-2 text-xs"
            style={{ background: 'rgba(255,45,85,0.1)', border: '1px solid rgba(255,45,85,0.25)', color: '#FF2D55' }}
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {coldAlerts.length} cold-chain alert{coldAlerts.length > 1 ? 's' : ''} need acknowledgement — open job and tap Acknowledge.
          </div>
        )}

        {recentSync.length > 0 && (
          <div className="mb-4 rounded-xl px-3 py-2 border border-white/5" style={{ background: 'var(--glass-bg)' }}>
            <p className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 mb-1.5 flex items-center gap-1">
              <Radio className="w-3 h-3" style={{ color: '#84cc16' }} />
              Cross-facility activity (background sync)
            </p>
            <ul className="space-y-1">
              {recentSync.map((log) => (
                <li key={log.id} className="text-[10px] text-neutral-400 truncate">
                  <span className="text-neutral-300">{log.actionPerformed}</span> · {log.facility} · {log.userName}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 grid lg:grid-cols-5 gap-4 px-4 pb-20 lg:px-8 lg:pb-6">
        <div className="lg:col-span-3 min-h-[280px] lg:min-h-0">
          <NationalBloodMap height="100%" />
        </div>
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2 shrink-0">
            Priority dispatch
          </h2>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {jobsLoading && (
              <p className="text-sm text-neutral-500 p-4">Loading dispatches…</p>
            )}
            {!jobsLoading && priorityQueue.map((job) => (
              <div key={job.id} className="glass-card p-3">
                <Link
                  to={job.status === 'PENDING' ? '/queue' : `/active`}
                  state={{ jobId: job.id }}
                  className="block hover:opacity-90 transition"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <StatusBadge status={job.status} />
                    <span className="font-mono text-[10px] text-neutral-500">{job.shortId}</span>
                  </div>
                  <p className="text-sm font-medium text-white truncate">
                    {job.route.source} → {job.route.destination}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">{job.payload}</p>
                  {job.coldChain && (
                    <div className="mt-2">
                      <ColdChainPanel coldChain={job.coldChain} compact />
                    </div>
                  )}
                  <ChevronRight className="w-4 h-4 text-neutral-600 mt-2 ml-auto" />
                </Link>
                <CoordinatorJobActions job={job} compact />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
