import { Download, FileBarChart } from 'lucide-react'
import { useRegistry } from '../context/RegistryContext'
import ConstellationBoundary from '../components/ConstellationBoundary'
import {
  buildPatientReport,
  buildExceptionReport,
  buildProgressReport,
  buildPopulationReport,
  buildCareGapReport,
  buildFunderAuditReport,
} from '../lib/reportBuilders.js'

const REPORTS = [
  { id: 'patient', title: 'Patient report', desc: 'Point-of-care roster with care plans and open gaps', build: (p, e) => buildPatientReport(p) },
  { id: 'exception', title: 'Exception report', desc: 'Open outreach items for coordinators', build: (p, e) => buildExceptionReport(e) },
  { id: 'caregap', title: 'Care gap report', desc: 'All open care gaps incl. missed transfusions', build: (p) => buildCareGapReport(p) },
  { id: 'funder', title: 'Funder audit · BIPAI', desc: 'De-identified paediatric sickle cell adherence indicators for international funders (BIPAI / PEPFAR)', build: (p) => buildFunderAuditReport(p) },
  { id: 'progress', title: 'Progress report', desc: 'Site-level adherence and review burden', build: (p) => buildProgressReport(p) },
  { id: 'population', title: 'Population report', desc: 'Anonymised aggregates for BPOMAS / MoH (no names)', build: (p) => buildPopulationReport(p) },
]

function download(filename, content, mime = 'text/csv') {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function ReportsHub() {
  const { patients, exceptions } = useRegistry()

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <ConstellationBoundary />
      <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-2"><FileBarChart style={{ color: 'var(--burg-300)' }} /> Reports hub</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Enterprise registry report types — demo CSV export from local seed data.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORTS.map((r) => {
          const pack = r.build(patients, exceptions)
          return (
            <div key={r.id} className="card p-5 flex flex-col">
              <h2 className="text-sm font-semibold text-white mb-1">{r.title}</h2>
              <p className="text-xs flex-1 mb-4" style={{ color: 'var(--text-secondary)' }}>{r.desc}</p>
              <p className="text-[10px] font-mono-ui mb-3" style={{ color: 'var(--text-muted)' }}>{pack.summary}</p>
              <button type="button" className="btn-primary flex items-center justify-center gap-2 text-sm" onClick={() => download(pack.filename, pack.csv)}>
                <Download className="w-4 h-4" /> Download CSV
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
