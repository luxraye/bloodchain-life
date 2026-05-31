import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { StudyProvider } from './context/StudyContext'
import LoginScreen from './components/LoginScreen'
import Layout from './layouts/Layout'
import StudiesDashboard from './pages/StudiesDashboard'
import StudyDetail from './pages/StudyDetail'
import IrbExport from './pages/IrbExport'

const ALLOWED = ['RESEARCH_PI', 'RESEARCH_COORDINATOR', 'RESEARCH', 'ETHICS_READ', 'ADMIN', 'SUPER_ADMIN']

function AccessDenied() {
  const { user, logout } = useAuth()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center" style={{ background: '#07090F' }}>
      <h1 className="text-xl font-bold text-white">Access Denied</h1>
      <p className="text-sm max-w-sm" style={{ color: '#8899A8' }}>
        Role <span className="font-mono" style={{ color: 'var(--burg-300)' }}>{user?.role}</span> cannot access Helix.
      </p>
      <button type="button" onClick={() => logout()} className="btn-primary">Sign out</button>
    </div>
  )
}

function AppRoutes() {
  const { user, loading, hasRole } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#07090F' }}>
        <div className="h-8 w-8 rounded-full border-2 animate-spin"
          style={{ borderColor: 'rgba(168,31,56,0.2)', borderTopColor: 'var(--burg-500)' }} />
      </div>
    )
  }

  if (!user) return <LoginScreen />
  if (!hasRole(...ALLOWED)) return <AccessDenied />

  return (
    <StudyProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<StudiesDashboard />} />
          <Route path="studies/:studyId" element={<StudyDetail />} />
          <Route path="studies/:studyId/export" element={<IrbExport />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </StudyProvider>
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
