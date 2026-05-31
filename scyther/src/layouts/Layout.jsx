import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserCheck, ClipboardList, Syringe, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useApp } from '../context/AppContext'

const NAV = [
  { to: '/collection/check-in',  icon: UserCheck,     label: 'Check-In',   step: '1' },
  { to: '/collection/screening', icon: ClipboardList, label: 'Screening',  step: '2' },
  { to: '/collection/phlebotomy', icon: Syringe,      label: 'Phlebotomy', step: '3' },
]

export default function Layout() {
  const { user } = useAuth()
  const { notifications } = useApp()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#07090F' }}>

      <aside
        className={`${collapsed ? 'w-[72px]' : 'w-60'} flex flex-col transition-all duration-300 relative shrink-0`}
        style={{ background: '#0C0F1A', borderRight: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="h-16 flex items-center px-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm"
              style={{ background: 'rgba(0,255,136,0.12)', border: '1px solid rgba(0,255,136,0.35)', color: '#00FF88' }}>
              ✦
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight">Scyther</h1>
                <p className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: '#4A5568' }}>Collection</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {!collapsed && (
            <p className="text-[9px] font-semibold uppercase tracking-widest px-2 mb-2" style={{ color: '#4A5568' }}>
              Workflow
            </p>
          )}
          {NAV.map(({ to, icon: Icon, label, step }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all min-h-[48px] ${
                  isActive
                    ? 'text-white'
                    : 'hover:bg-white/[0.04]'
                } ${collapsed ? 'justify-center px-2' : ''}`
              }
              style={({ isActive }) => isActive ? {
                background: 'rgba(0,255,136,0.1)',
                borderLeft: collapsed ? 'none' : '3px solid #00FF88',
                color: '#00FF88',
              } : { color: '#8899A8' }}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-[10px] font-bold"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {collapsed ? <Icon className="w-4 h-4" /> : step}
              </span>
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/[0.06] p-2.5">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl p-2.5 transition min-h-[48px] ${isActive ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'} ${collapsed ? 'justify-center' : ''}`
            }
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white"
              style={{ background: '#A81F38' }}>
              {(user?.name || 'U')[0].toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name ?? '—'}</p>
                <p className="text-[10px] font-mono uppercase" style={{ color: '#4A5568' }}>{user?.role ?? ''}</p>
              </div>
            )}
          </NavLink>
        </div>

        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center z-10 transition"
          style={{ background: '#111422', border: '1px solid rgba(255,255,255,0.12)', color: '#8899A8' }}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
          <Outlet />
        </main>

        {notifications.length > 0 && (
          <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
            {notifications.map((n) => (
              <div key={n.id} className="rounded-xl px-4 py-3 text-sm font-medium shadow-lg pointer-events-auto"
                style={{
                  background: n.type === 'error' ? 'rgba(255,45,85,0.95)' : n.type === 'success' ? 'rgba(0,100,60,0.95)' : '#111422',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#F0F4F8',
                }}>
                {n.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
