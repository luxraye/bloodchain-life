import { Thermometer, Clock, AlertTriangle } from 'lucide-react'
import { COLD_CHAIN_STATUS } from '../data/seedVoyager.js'

export default function ColdChainPanel({ coldChain, compact = false, showAck = true }) {
  if (!coldChain) return null
  const meta = COLD_CHAIN_STATUS[coldChain.status] || COLD_CHAIN_STATUS.OK
  const acked = !!coldChain.acknowledgedAt
  const expiry = coldChain.expiryAt ? new Date(coldChain.expiryAt) : null
  const hoursLeft = expiry ? Math.max(0, Math.round((expiry - Date.now()) / 3600000)) : null

  if (compact) {
    return (
      <div
        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs"
        style={{ background: meta.bg, border: `1px solid ${meta.color}33` }}
      >
        <Thermometer className="w-3.5 h-3.5 shrink-0" style={{ color: meta.color }} />
        <span style={{ color: meta.color }} className="font-mono font-semibold">
          {coldChain.currentTempC}°C
        </span>
        <span className="text-neutral-500">· {meta.label}</span>
        {showAck && acked && <span className="text-neutral-600">· ack</span>}
      </div>
    )
  }

  return (
    <div className="glass-card p-4" style={{ borderColor: `${meta.color}33` }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">Cold chain</span>
        {coldChain.status !== 'OK' && (
          <AlertTriangle className="w-4 h-4" style={{ color: meta.color }} />
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-[10px] text-neutral-500 uppercase">Pack temp</p>
          <p className="text-xl font-bold font-mono" style={{ color: meta.color }}>
            {coldChain.currentTempC}°C
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">
            Target {coldChain.targetTempC.min}–{coldChain.targetTempC.max}°C
          </p>
        </div>
        <div>
          <p className="text-[10px] text-neutral-500 uppercase">Status</p>
          <p className="font-semibold" style={{ color: meta.color }}>{meta.label}</p>
          <p className="text-[10px] text-neutral-500 mt-1">{coldChain.packType}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-4 text-[10px] text-neutral-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Reading {new Date(coldChain.lastReadingAt).toLocaleTimeString()}
        </span>
        {hoursLeft != null && (
          <span>Unit expiry window: ~{hoursLeft}h</span>
        )}
        {showAck && acked && (
          <span className="text-emerald-500/80">
            Acknowledged {new Date(coldChain.acknowledgedAt).toLocaleTimeString()} · {coldChain.acknowledgedBy}
          </span>
        )}
      </div>
    </div>
  )
}
