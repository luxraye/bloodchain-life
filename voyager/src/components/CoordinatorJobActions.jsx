import { useState } from 'react'
import { UserPlus, Zap, ShieldCheck, ChevronDown } from 'lucide-react'
import { useJobs } from '../context/JobContext'
import { useCoordinatorMode } from '../hooks/useCoordinatorMode'
import { needsColdChainAck, isUnassigned } from '../lib/jobUtils'
import AssignCourierModal from './AssignCourierModal'

export default function CoordinatorJobActions({ job, compact = false }) {
  const { isCoordinator, user } = useCoordinatorMode()
  const { assignCourier, expediteStat, acknowledgeColdChain } = useJobs()
  const [showAssign, setShowAssign] = useState(false)

  if (!isCoordinator) return null

  const canAssign = job.status === 'PENDING' && isUnassigned(job)
  const canExpedite = job.priority !== 'STAT' && ['PENDING', 'IN_TRANSIT', 'FLAGGED'].includes(job.status)
  const canAck = needsColdChainAck(job)

  if (!canAssign && !canExpedite && !canAck && compact) return null

  const btn =
    'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition border'

  return (
    <>
      <div className={`flex flex-wrap gap-2 ${compact ? '' : 'mt-3 pt-3 border-t border-white/10'}`} onClick={(e) => e.stopPropagation()}>
        {canAssign && (
          <button
            type="button"
            className={btn}
            style={{ borderColor: 'rgba(132,204,22,0.35)', color: '#a3e635', background: 'rgba(132,204,22,0.08)' }}
            onClick={() => setShowAssign(true)}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Assign courier
          </button>
        )}
        {canExpedite && (
          <button
            type="button"
            className={btn}
            style={{ borderColor: 'rgba(255,45,85,0.35)', color: '#FF6B8A', background: 'rgba(255,45,85,0.08)' }}
            onClick={() => expediteStat(job.id)}
          >
            <Zap className="w-3.5 h-3.5" />
            Expedite STAT
          </button>
        )}
        {canAck && (
          <button
            type="button"
            className={btn}
            style={{ borderColor: 'rgba(255,184,0,0.35)', color: '#FFB800', background: 'rgba(255,184,0,0.08)' }}
            onClick={() => acknowledgeColdChain(job.id, user?.name ?? 'Coordinator')}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Acknowledge alert
          </button>
        )}
        {!compact && job.courierId && job.courierId !== 'Unassigned' && (
          <span className="text-[10px] text-neutral-500 flex items-center gap-1 ml-auto">
            <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
            {job.courierId}
          </span>
        )}
      </div>
      {showAssign && (
        <AssignCourierModal
          job={job}
          onClose={() => setShowAssign(false)}
          onAssign={(courier) => {
            assignCourier(job.id, courier.label, user?.name)
            setShowAssign(false)
          }}
        />
      )}
    </>
  )
}
