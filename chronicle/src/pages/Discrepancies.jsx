import { FileWarning } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useRegistry } from '../context/RegistryContext'
import ConstellationBoundary from '../components/ConstellationBoundary'

export default function Discrepancies() {
  const { discrepancies } = useRegistry()

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <ConstellationBoundary />
      <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-6"><FileWarning style={{ color: 'var(--neon-amber)' }} /> Data quality</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Problem list vs billing reconciliation (demo nightly audit).</p>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--bg-raised)' }}>
              {['Registry ID', 'Issue', 'Status', 'Detected', ''].map((h) => (
                <th key={h} className="text-left px-4 py-2 font-mono-ui text-[9px] uppercase" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {discrepancies.map((d) => (
              <tr key={d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="px-4 py-3 font-mono-ui text-xs" style={{ color: 'var(--burg-300)' }}>{d.registryId}</td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{d.issue}</td>
                <td className="px-4 py-3"><span className="badge-chronic">{d.status}</span></td>
                <td className="px-4 py-3 text-xs">{d.detectedAt}</td>
                <td className="px-4 py-3"><Link to={`/patients/${d.patientId}`} className="text-xs" style={{ color: 'var(--azure-300)' }}>Chart</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
