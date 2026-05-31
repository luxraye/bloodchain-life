import { Link } from 'react-router-dom'
import { FlaskConical, ChevronRight, Users, TestTube2 } from 'lucide-react'
import { useStudies } from '../context/StudyContext'
import ConstellationBoundary from '../components/ConstellationBoundary'

const STATUS_STYLE = {
  DRAFT: { bg: 'rgba(255,255,255,0.06)', color: '#8899A8' },
  IRB_APPROVED: { bg: 'rgba(58,130,184,0.15)', color: '#5BA4D4' },
  ACTIVE: { bg: 'rgba(0,255,136,0.1)', color: '#00FF88' },
  CLOSED: { bg: 'rgba(255,255,255,0.04)', color: '#4A5568' },
}

export default function StudiesDashboard() {
  const { studies, loading } = useStudies()

  return (
    <div className="max-w-5xl mx-auto">
      <ConstellationBoundary />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FlaskConical className="w-7 h-7" style={{ color: 'var(--burg-300)' }} />
          Research studies
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Clinical trial specimen governance — pre-analytical through IRB export.
        </p>
      </div>

      {loading && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading from API…</p>}

      <div className="space-y-4">
        {studies.map((study) => {
          const st = STATUS_STYLE[study.status] ?? STATUS_STYLE.DRAFT
          return (
            <Link
              key={study.id}
              to={`/studies/${study.id}`}
              className="card block p-5 hover:border-[rgba(168,31,56,0.35)] transition group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono-ui text-xs font-bold" style={{ color: 'var(--burg-300)' }}>{study.code}</span>
                    <span className="badge" style={{ background: st.bg, color: st.color }}>{study.status.replace('_', ' ')}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-white group-hover:text-[#EAA0AA] transition">{study.title}</h2>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    PI: {study.principalInvestigator} · {study.sponsor}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 shrink-0" style={{ color: 'var(--text-muted)' }} />
              </div>
              <div className="flex gap-6 mt-4 pt-4 border-t border-white/[0.06]">
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <Users className="w-3.5 h-3.5" /> {study.participants?.length ?? 0} participants
                </span>
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <TestTube2 className="w-3.5 h-3.5" /> {study.samples?.length ?? 0} specimens
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
