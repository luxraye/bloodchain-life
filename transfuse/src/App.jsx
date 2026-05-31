import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { useAuth } from './context/AuthContext'
import Layout from './layouts/Layout'
import LoginScreen from './components/LoginScreen'
import InventoryDashboard from './pages/clinical/InventoryDashboard'
import RequestManagement  from './pages/clinical/RequestManagement'
import StandbyDonors      from './pages/clinical/StandbyDonors'
import TransfusionLog     from './pages/clinical/TransfusionLog'
import Haemovigilance     from './pages/clinical/Haemovigilance'

const ALLOWED_ROLES = ['MEDICAL', 'NURSE', 'DOCTOR', 'CLINICAL', 'LAB_SUPERVISOR', 'SUPER_ADMIN', 'ADMIN']

function AccessDenied() {
  const { user, logout } = useAuth()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center" style={{ background: '#07090F' }}>
      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2"
        style={{ background: 'rgba(255,45,85,0.1)', border: '1px solid rgba(255,45,85,0.3)' }}>
        <span className="text-2xl">🔒</span>
      </div>
      <h1 className="text-xl font-bold text-white">Access Denied</h1>
      <p className="text-sm max-w-sm" style={{ color: '#8899A8' }}>
        <span className="font-semibold text-white">{user?.name}</span>, your role (
        <span className="font-mono" style={{ color: '#5BA4D4' }}>{user?.role}</span>
        ) does not have access to Transfuse.
      </p>
      <button onClick={logout}
        className="mt-2 rounded-lg px-5 py-2 text-sm font-medium text-white transition"
        style={{ background: '#1B3E5E' }}
        onMouseEnter={e => e.currentTarget.style.background = '#2A5F8F'}
        onMouseLeave={e => e.currentTarget.style.background = '#1B3E5E'}>
        Sign Out
      </button>
    </div>
  )
}

function App() {
  const { user, loading, hasRole } = useAuth()

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: '#07090F' }}>
      <div className="h-8 w-8 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(58,130,184,0.2)', borderTopColor: '#3A82B8' }} />
    </div>
  )

  if (!user) return <LoginScreen />
  if (!hasRole(...ALLOWED_ROLES)) return <AccessDenied />

  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/inventory" replace />} />
            <Route path="inventory"   element={<InventoryDashboard />} />
            <Route path="requests"    element={<RequestManagement />} />
            <Route path="standby"     element={<StandbyDonors />} />
            <Route path="transfusion" element={<TransfusionLog />} />
            <Route path="haemovigilance" element={<Haemovigilance />} />
            <Route path="*"           element={<Navigate to="/inventory" replace />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
