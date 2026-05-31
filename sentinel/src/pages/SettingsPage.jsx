import { ExternalLink } from 'lucide-react'
import { useCompliance } from '../context/ComplianceContext'
import { instancesApiConfigured } from '../lib/instancesApi.js'

export default function SettingsPage() {
  const { instancesAdminUrl, apiConnected, isDemoData, refresh } = useCompliance()
  const configured = instancesApiConfigured()

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      <div className="card p-5 space-y-4 mb-4">
        <p className="text-sm font-semibold text-white">Instances integration</p>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt style={{ color: 'var(--text-muted)' }}>API URL</dt>
            <dd className="font-mono-ui text-xs text-right truncate" style={{ color: 'var(--text-secondary)' }}>
              {import.meta.env.VITE_INSTANCES_API_URL || '(not set)'}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt style={{ color: 'var(--text-muted)' }}>API key</dt>
            <dd style={{ color: 'var(--text-secondary)' }}>{configured ? 'Configured' : 'Missing'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt style={{ color: 'var(--text-muted)' }}>Connection</dt>
            <dd style={{ color: apiConnected ? '#00FF88' : 'var(--text-secondary)' }}>
              {isDemoData ? 'Demo seed' : apiConnected ? 'Live' : 'Unreachable'}
            </dd>
          </div>
        </dl>
        <button type="button" onClick={refresh} className="btn-ghost w-full">
          Test connection / refresh
        </button>
      </div>

      <a
        href={instancesAdminUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="card p-5 flex items-center justify-between gap-3 hover:border-[rgba(124,58,237,0.35)] transition"
      >
        <div>
          <p className="text-sm font-semibold text-white">Open full Instances console</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Template authoring, tenant admin, licensee provisioning
          </p>
        </div>
        <ExternalLink className="w-5 h-5 shrink-0" style={{ color: 'var(--sentinel-300)' }} />
      </a>

      <p className="mt-6 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        Copy <code className="font-mono-ui">sentinel/.env.example</code> to <code className="font-mono-ui">.env.local</code>.
        Run Instances from <code className="font-mono-ui">instances-extract/g-instances-main</code> (includes GET list patch for Sentinel).
      </p>
    </div>
  )
}
