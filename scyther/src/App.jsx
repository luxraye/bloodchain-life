import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { useAuth } from './context/AuthContext'
import Layout from './layouts/Layout'
import LoginScreen from './components/LoginScreen'
import DonorCheckIn from './pages/collection/DonorCheckIn'
import MedicalScreening from './pages/collection/MedicalScreening'
import Phlebotomy from './pages/collection/Phlebotomy'
import ProfilePage from './pages/ProfilePage'

const ALLOWED_ROLES = ['COLLECTION', 'STAFF', 'PHLEBOTOMY', 'MEDICAL', 'ADMIN', 'SUPER_ADMIN']

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
        <span className="font-mono" style={{ color: '#00FF88' }}>{user?.role}</span>
        ) does not have access to Scyther. Hospital clinical workflows use Transfuse.
      </p>
      <button type="button" onClick={() => logout()} className="btn-primary mt-2">
        Sign out
      </button>
    </div>
  )
}

function App() {
  const { user, loading, hasRole } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#07090F' }}>
        <div className="h-8 w-8 rounded-full border-2 animate-spin"
          style={{ borderColor: 'rgba(0,255,136,0.2)', borderTopColor: '#00FF88' }} />
      </div>
    )
  }

  if (!user) return <LoginScreen />
  if (!hasRole(...ALLOWED_ROLES)) return <AccessDenied />

  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/collection/check-in" replace />} />
            <Route path="collection/check-in" element={<DonorCheckIn />} />
            <Route path="collection/screening" element={<MedicalScreening />} />
            <Route path="collection/phlebotomy" element={<Phlebotomy />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/collection/check-in" replace />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
