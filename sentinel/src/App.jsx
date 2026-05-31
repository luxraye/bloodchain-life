import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ComplianceProvider } from './context/ComplianceContext'
import LoginScreen from './components/LoginScreen'
import Layout from './layouts/Layout'
import CommandDashboard from './pages/CommandDashboard'
import ReviewQueue from './pages/ReviewQueue'
import SubmissionDetail from './pages/SubmissionDetail'
import AuditLog from './pages/AuditLog'
import TemplatesPage from './pages/TemplatesPage'
import SettingsPage from './pages/SettingsPage'

const ALLOWED = ['REGULATOR_REVIEWER', 'REGULATOR_ADMIN', 'REVIEWER', 'TENANT_ADMIN', 'ADMIN', 'SUPER_ADMIN']

function AccessDenied() {
  const { user, logout } = useAuth()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center" style={{ background: 'var(--bg-base)' }}>
      <h1 className="text-xl font-bold text-white">Access Denied</h1>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Role <span className="font-mono" style={{ color: 'var(--sentinel-300)' }}>{user?.role}</span> cannot access Sentinel.
      </p>
      <button type="button" onClick={() => logout()} className="btn-primary">Sign out</button>
    </div>
  )
}

function AppRoutes() {
  const { user, loading, hasRole } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <div className="h-8 w-8 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(124,58,237,0.2)', borderTopColor: 'var(--sentinel-500)' }} />
      </div>
    )
  }

  if (!user) return <LoginScreen />
  if (!hasRole(...ALLOWED)) return <AccessDenied />

  return (
    <ComplianceProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CommandDashboard />} />
          <Route path="queue" element={<ReviewQueue />} />
          <Route path="submissions/:id" element={<SubmissionDetail />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="audit" element={<AuditLog />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ComplianceProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
