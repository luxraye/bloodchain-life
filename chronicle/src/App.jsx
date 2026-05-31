import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { RegistryProvider } from './context/RegistryContext'
import LoginScreen from './components/LoginScreen'
import Layout from './layouts/Layout'
import CommandDashboard from './pages/CommandDashboard'
import ExceptionQueue from './pages/ExceptionQueue'
import PatientRegistry from './pages/PatientRegistry'
import PatientDetail from './pages/PatientDetail'
import Cohorts from './pages/Cohorts'
import Discrepancies from './pages/Discrepancies'
import ReportsHub from './pages/ReportsHub'

const ALLOWED = ['CHRONIC_CARE_COORDINATOR', 'MEDICAL', 'NURSE', 'ADMIN', 'SUPER_ADMIN']

function AccessDenied() {
  const { user, logout } = useAuth()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center" style={{ background: 'var(--bg-base)' }}>
      <h1 className="text-xl font-bold text-white">Access Denied</h1>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Role <span className="font-mono" style={{ color: 'var(--burg-300)' }}>{user?.role}</span> cannot access Chronicle.
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
        <div className="h-8 w-8 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(168,31,56,0.2)', borderTopColor: 'var(--burg-500)' }} />
      </div>
    )
  }

  if (!user) return <LoginScreen />
  if (!hasRole(...ALLOWED)) return <AccessDenied />

  return (
    <RegistryProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CommandDashboard />} />
          <Route path="exceptions" element={<ExceptionQueue />} />
          <Route path="patients" element={<PatientRegistry />} />
          <Route path="patients/:patientId" element={<PatientDetail />} />
          <Route path="cohorts" element={<Cohorts />} />
          <Route path="discrepancies" element={<Discrepancies />} />
          <Route path="reports" element={<ReportsHub />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </RegistryProvider>
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
