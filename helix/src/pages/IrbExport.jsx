import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Download, FileText } from 'lucide-react'
import { useStudies } from '../context/StudyContext'
import { buildIrbExport, toCsv } from '../data/seedStudies'

export default function IrbExport() {
  const { studyId } = useParams()
  const { getStudy } = useStudies()
  const study = getStudy(studyId)

  const pack = useMemo(() => (study ? buildIrbExport(study) : null), [study])

  if (!study || !pack) {
    return <p style={{ color: '#8899A8' }}>Study not found.</p>
  }

  const { summary, participantRows, sampleRows, deviations, actionLog } = pack

  const download = (filename, content, mime = 'text/csv') => {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const participantsCsv = toCsv(participantRows, ['studyParticipantId', 'arm', 'consent', 'consentDate', 'site', 'enrolledAt'])
  const samplesCsv = toCsv(sampleRows, ['sampleId', 'participantId', 'visit', 'specimenType', 'status', 'lastCustody', 'eventCount'])

  const summaryText = [
    `Bloodchain Helix — IRB Export Summary`,
    `Study: ${summary.studyCode}`,
    `Title: ${study.title}`,
    `Generated: ${summary.generatedAt}`,
    ``,
    `Enrolled: ${summary.enrolled}`,
    `Consented: ${summary.consented}`,
    `Withdrawn: ${summary.withdrawn}`,
    `Pending consent: ${summary.pendingConsent}`,
    `Specimens: ${summary.specimens}`,
    `In analysis: ${summary.inAnalysis}`,
    `Protocol deviations: ${summary.protocolDeviations}`,
    `Custody gaps (fewer than 4 events): ${summary.custodyGaps}`,
    `Receipt rejected: ${summary.receiptRejected ?? 0}`,
    `Worksheets on QC hold: ${summary.worksheetsHeld ?? 0}`,
    ``,
    `This export is generated from Helix research custody records.`,
    `Operational NBTS blood units (BloodAsset) are separate unless explicitly bridged.`,
  ].join('\n')

  const downloadAll = () => {
    download(`${study.code}-participants.csv`, participantsCsv)
    download(`${study.code}-specimens.csv`, samplesCsv)
    download(`${study.code}-summary.txt`, summaryText, 'text/plain')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link to={`/studies/${study.id}?tab=overview`} className="inline-flex items-center gap-1.5 text-xs mb-6" style={{ color: '#8899A8' }}>
        <ArrowLeft className="w-3.5 h-3.5" /> Back to study
      </Link>

      <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
        <FileText className="w-6 h-6" style={{ color: 'var(--burg-300)' }} />
        IRB export packet
      </h1>
      <p className="text-sm mb-8" style={{ color: '#8899A8' }}>
        {study.code} — for ethics committee review. Institution-agnostic; no row-level national donor identifiers.
      </p>

      <div className="card p-6 mb-6 space-y-4">
        <h2 className="text-sm font-semibold text-white">Summary</h2>
        <dl className="grid grid-cols-2 gap-3 text-xs">
          {Object.entries(summary).filter(([k]) => k !== 'title').map(([k, v]) => (
            <div key={k}>
              <dt className="uppercase tracking-wider font-semibold mb-0.5" style={{ color: '#4A5568' }}>{k.replace(/([A-Z])/g, ' $1')}</dt>
              <dd className="text-white font-mono">{String(v)}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <button type="button" onClick={downloadAll} className="btn-primary flex items-center gap-2">
          <Download className="w-4 h-4" /> Download all files
        </button>
        <button type="button" onClick={() => download(`${study.code}-participants.csv`, participantsCsv)} className="btn-ghost text-xs">
          Participants CSV
        </button>
        <button type="button" onClick={() => download(`${study.code}-specimens.csv`, samplesCsv)} className="btn-ghost text-xs">
          Specimens CSV
        </button>
        <button type="button" onClick={() => download(`${study.code}-summary.txt`, summaryText, 'text/plain')} className="btn-ghost text-xs">
          Summary TXT
        </button>
      </div>

      {deviations.length > 0 && (
        <div className="card p-5 mb-4">
          <h3 className="text-sm font-semibold text-white mb-2">Deviations ({deviations.length})</h3>
          <ul className="text-xs space-y-2" style={{ color: '#8899A8' }}>
            {deviations.map(d => <li key={d.id}>{d.description}</li>)}
          </ul>
        </div>
      )}

      <div className="card p-5">
        <h3 className="text-sm font-semibold text-white mb-2">Recent audit entries ({actionLog.length})</h3>
        <ul className="text-xs space-y-2 max-h-48 overflow-y-auto" style={{ color: '#8899A8' }}>
          {actionLog.slice().reverse().map((e, i) => (
            <li key={i}>{e.action} — {e.userName}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
