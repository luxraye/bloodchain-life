import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { findDemoPatient } from '../../data/demoPatients.js'
import { FileHeart, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Activity } from 'lucide-react'

const COMPATIBLE = {
  'O-': ['O-','O+','A-','A+','B-','B+','AB-','AB+'],
  'O+': ['O+','A+','B+','AB+'],
  'A-': ['A-','A+','AB-','AB+'],
  'A+': ['A+','AB+'],
  'B-': ['B-','B+','AB-','AB+'],
  'B+': ['B+','AB+'],
  'AB-': ['AB-','AB+'],
  'AB+': ['AB+'],
}
const isCompatible = (u, p) => COMPATIBLE[u]?.includes(p) ?? false

function ScanStep({ step, title, sub, children, locked }) {
  return (
    <div className={`card p-5 ${locked ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
          style={{ background: 'rgba(58,130,184,0.15)', border: '1px solid rgba(58,130,184,0.3)', color: '#5BA4D4' }}>
          {step}
        </div>
        <div>
          <h2 className="text-sm font-semibold" style={{ color: '#F0F4F8' }}>{title}</h2>
          <p className="text-xs" style={{ color: '#4A5568' }}>{sub}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

export default function TransfusionLog() {
  const { bloodUnits, transfusions, addTransfusion, addNotification } = useApp()
  const [patientScan,      setPatientScan]      = useState('')
  const [unitScan,         setUnitScan]         = useState('')
  const [patient,          setPatient]          = useState(null)
  const [unit,             setUnit]             = useState(null)
  const [crossMatchResult, setCrossMatchResult] = useState(null)

  const availableUnits = bloodUnits.filter(u => u.status === 'AVAILABLE')

  const handlePatientScan = () => {
    const found = findDemoPatient(patientScan)
    if (!found) {
      setPatient(null)
      setCrossMatchResult(null)
      addNotification('Patient not found — try PAT-2026-001 through PAT-2026-005', 'error')
      return
    }
    setPatient(found)
    addNotification(`Patient verified: ${found.name}`, 'success')
    if (unit) {
      const ok = isCompatible(unit.type || unit.bloodType, found.bloodType)
      setCrossMatchResult(ok ? 'pass' : 'fail')
    }
  }

  const handleUnitScan = () => {
    const found = availableUnits.find(u => u.id === unitScan.trim())
    if (!found) { addNotification('Unit not found or not available', 'error'); setUnit(null); setCrossMatchResult(null); return }
    setUnit(found)
    if (patient) {
      const ok = isCompatible(found.type || found.bloodType, patient.bloodType)
      setCrossMatchResult(ok ? 'pass' : 'fail')
      addNotification(`Cross-match ${ok ? 'PASS' : 'FAIL'}: ${found.type} → ${patient.bloodType}`, ok ? 'success' : 'error')
    }
  }

  const handleCommit = () => {
    if (!patient || !unit || crossMatchResult !== 'pass') return
    addTransfusion({
      id: `txn_${Date.now().toString(36)}`,
      patientId: patient.id, patientName: patient.name, patientType: patient.bloodType,
      unitId: unit.id, unitType: unit.type || unit.bloodType,
      performedBy: 'Clinician on duty', performedAt: new Date().toISOString(),
      ward: patient.ward ?? '—', status: 'COMPLETED',
    })
    setPatient(null); setUnit(null); setPatientScan(''); setUnitScan(''); setCrossMatchResult(null)
  }

  return (
    <div className="animate-fade-in">

      {/* Header */}
      <div className="mb-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] mb-1" style={{ color: '#A81F38' }}>Blood Bank · Transfusion</p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: '#F0F4F8' }}>Transfusion Log</h1>
        <p className="text-sm mt-1" style={{ color: '#4A5568' }}>Scan patient and blood unit, verify cross-match, commit the record.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

        {/* Step 1 — Patient */}
        <ScanStep step="1" title="Patient Identification" sub="Enter patient ID or scan wristband">
          <div className="flex gap-2 mb-3">
            <input value={patientScan} onChange={e => setPatientScan(e.target.value)} placeholder="Patient ID (e.g. PAT-2026-001)" className="input-field flex-1" />
            <button onClick={handlePatientScan} className="btn-secondary text-sm">Scan</button>
          </div>
          {patient ? (
            <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.25)' }}>
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#00FF88' }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: '#F0F4F8' }}>{patient.name}</p>
                <p className="text-xs" style={{ color: '#8899A8' }}>Type: <strong>{patient.bloodType}</strong> · {patient.ward}</p>
              </div>
            </div>
          ) : (
            <p className="text-xs" style={{ color: '#4A5568' }}>
              Demo IDs: PAT-2026-001 … PAT-2026-005 · Production uses hospital EMR integration
            </p>
          )}
        </ScanStep>

        {/* Step 2 — Unit */}
        <ScanStep step="2" title="Blood Unit Scan" sub="Enter unit ID or scan ISBT-128 barcode" locked={!patient}>
          <div className="flex gap-2 mb-3">
            <input value={unitScan} onChange={e => setUnitScan(e.target.value)}
              placeholder={`Available: ${availableUnits.map(u => u.id).slice(0, 2).join(', ')}…`}
              className="input-field flex-1" />
            <button onClick={handleUnitScan} className="btn-secondary text-sm">Scan</button>
          </div>
          {unit && (
            <div className="flex items-center gap-3 rounded-xl px-4 py-3 animate-slide-up"
              style={crossMatchResult === 'pass'
                ? { background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.25)' }
                : { background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.25)' }}>
              {crossMatchResult === 'pass'
                ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#00FF88' }} />
                : <XCircle    className="w-5 h-5 flex-shrink-0" style={{ color: '#FF2D55' }} />}
              <div>
                <p className="text-sm font-semibold" style={{ color: '#F0F4F8' }}>{unit.id} ({unit.type || unit.bloodType})</p>
                <p className="text-xs" style={{ color: '#8899A8' }}>
                  {crossMatchResult === 'pass' ? `✓ Compatible with ${patient?.bloodType}` : `✕ Incompatible with ${patient?.bloodType}`}
                </p>
              </div>
            </div>
          )}
        </ScanStep>
      </div>

      {/* Cross-match result */}
      {crossMatchResult && (
        <div className="card p-5 mb-5 animate-slide-up flex items-center justify-between"
          style={crossMatchResult === 'pass' ? { borderColor: 'rgba(0,255,136,0.3)' } : { borderColor: 'rgba(255,45,85,0.3)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: crossMatchResult === 'pass' ? 'rgba(0,255,136,0.15)' : 'rgba(255,45,85,0.15)' }}>
              {crossMatchResult === 'pass'
                ? <ShieldCheck className="w-5 h-5" style={{ color: '#00FF88' }} />
                : <AlertTriangle className="w-5 h-5" style={{ color: '#FF2D55' }} />}
            </div>
            <div>
              <h3 className="text-base font-bold" style={{ color: crossMatchResult === 'pass' ? '#00FF88' : '#FF2D55' }}>
                Cross-Match: {crossMatchResult === 'pass' ? 'COMPATIBLE' : 'INCOMPATIBLE'}
              </h3>
              <p className="text-xs" style={{ color: '#8899A8' }}>
                {crossMatchResult === 'pass'
                  ? `${unit?.type || unit?.bloodType} → ${patient?.bloodType} (${patient?.name})`
                  : 'Cannot proceed — select a compatible unit'}
              </p>
            </div>
          </div>
          {crossMatchResult === 'pass' && (
            <button onClick={handleCommit} className="btn-primary flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4" />Commit Transfusion
            </button>
          )}
        </div>
      )}

      {/* History */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#111422' }}>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: '#4A5568' }}>Transfusion History</p>
          <span className="text-xs" style={{ color: '#4A5568' }}>{transfusions.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0C0F1A' }}>
                {['ID', 'Patient', 'Pt Type', 'Unit', 'Unit Type', 'By', 'Date', 'Ward', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 font-mono text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#4A5568' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transfusions.map(txn => (
                <tr key={txn.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td className="px-4 py-3 font-mono text-[11px]" style={{ color: '#5BA4D4' }}>{txn.id}</td>
                  <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#F0F4F8' }}>{txn.patientName}</td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: '#D96070' }}>{txn.patientType}</td>
                  <td className="px-4 py-3 font-mono text-[11px]" style={{ color: '#8899A8' }}>{txn.unitId}</td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: '#D96070' }}>{txn.unitType}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#8899A8' }}>{txn.performedBy}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#8899A8' }}>{new Date(txn.performedAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#8899A8' }}>{txn.ward}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(0,255,136,0.1)', color: '#00FF88' }}>{txn.status}</span>
                  </td>
                </tr>
              ))}
              {transfusions.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-sm" style={{ color: '#4A5568' }}>No transfusions recorded this session</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
