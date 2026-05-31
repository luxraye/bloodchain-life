import { useState } from 'react'
import './index.css'
import LabDashboard from './pages/LabDashboard'
import { LoginScreen } from './components/LoginScreen'
import { ProfilePage } from './components/ProfilePage'
import Navbar from './components/Navbar'
import DevSyncTool from './components/DevSyncTool'
import { useAuth } from './context/AuthContext'

const ALLOWED_ROLES = ['LAB', 'LAB_TECH', 'LAB_SUPERVISOR', 'SUPER_ADMIN']

function AccessDenied() {
  const { user, logout } = useAuth()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 p-6 text-center">
      <div className="w-14 h-14 rounded-full bg-red-950 flex items-center justify-center mb-2">
        <span className="text-2xl">🔒</span>
      </div>
      <h1 className="text-xl font-bold text-slate-100">Access Denied</h1>
      <p className="text-sm text-slate-400 max-w-sm">
        <span className="font-medium text-slate-200">{user?.name}</span>, your role
        (<span className="font-mono text-cyan-400">{user?.role}</span>) does not have
        access to Mars Lab. Only <span className="font-mono text-cyan-400">LAB</span>, <span className="font-mono text-cyan-400">LAB_TECH</span>, <span className="font-mono text-cyan-400">LAB_SUPERVISOR</span>, or <span className="font-mono text-cyan-400">SUPER_ADMIN</span> users can use this app.
      </p>
      <button onClick={() => logout()} className="mt-2 rounded-lg bg-cyan-600 px-5 py-2 text-sm font-medium text-white hover:bg-cyan-500 transition">
        Log out
      </button>
    </div>
  )
}

function App() {
  const { user, loading, hasRole } = useAuth()
  const [view, setView] = useState<'main' | 'profile'>('main')

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="h-8 w-8 rounded-full border-2 border-cyan-800 border-t-cyan-400 animate-spin" />
    </div>
  )
  if (!user) return <LoginScreen />
  if (!hasRole(...ALLOWED_ROLES)) {
    return <AccessDenied />
  }
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-950">
      <Navbar onProfile={() => setView((v: 'main' | 'profile') => v === 'profile' ? 'main' : 'profile')} />
      {view === 'profile' ? <ProfilePage /> : <LabDashboard />}
      <DevSyncTool />
    </div>
  )
}

export default App
