import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserCheck, ClipboardList, Syringe, ChevronLeft, ChevronRight, Droplets } from 'lucide-react'
import Navbar from '../components/Navbar'
import ConstellationBoundary from '../components/ConstellationBoundary'
import { useApp } from '../context/AppContext'

const NAV = [
  { to: '/collection/check-in', icon: UserCheck, label: 'Check-In', step: '1' },
  { to: '/collection/screening', icon: ClipboardList, label: 'Screening', step: '2' },
  { to: '/collection/phlebotomy', icon: Syringe, label: 'Phlebotomy', step: '3' },
]

export default function Layout() {
  const { user } = useAuth()
  const { notifications } = useApp()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#07090F' }}>

      <aside
        className="flex flex-col relative transition-all duration-300 shrink-0"
        style={{
          width: collapsed ? 60 : 216,
          background: '#0C0F1A',
          borderRight: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="h-14 flex items-center px-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #4A1020, #A81F38)', boxShadow: '0 2px 8px rgba(168,31,56,0.3)' }}
            >
              <Droplets className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <h1 className="text-sm font-bold tracking-tight" style={{ color: '#F0F4F8' }}>Scyther</h1>
                <p className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: '#4A5568' }}>Bloodchain</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {!collapsed && (
            <p className="text-[9px] font-semibold uppercase tracking-widest mb-2 px-2" style={{ color: '#4A5568', letterSpacing: '0.14em' }}>
              Workflow
            </p>
          )}
          {NAV.map(({ to, icon: Icon, label, step }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              className={({ isActive }) => [
                'flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative min-h-[44px]',
                collapsed ? 'justify-center px-2' : '',
              ].join(' ')}
              style={({ isActive }) => isActive
                ? { background: 'rgba(168,31,56,0.15)', color: '#D96070', border: '1px solid rgba(168,31,56,0.25)' }
                : { color: '#4A5568', border: '1px solid transparent' }
              }
            >
              {collapsed ? (
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              ) : (
                <>
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-[10px] font-bold"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {step}
                  </span>
                  <span className="animate-fade-in truncate">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/[0.06] p-2.5">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg p-2.5 transition min-h-[44px] ${isActive ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'} ${collapsed ? 'justify-center' : ''}`
            }
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white"
              style={{ background: '#A81F38' }}
            >
              {(user?.name || 'U')[0].toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-sm font-semibold text-white truncate">{user?.name ?? '—'}</p>
                <p className="text-[10px] font-mono uppercase" style={{ color: '#4A5568' }}>{user?.role ?? ''}</p>
              </div>
            )}
          </NavLink>
        </div>

        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="absolute -right-3 top-16 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-colors"
          style={{ background: '#0C0F1A', border: '1px solid rgba(255,255,255,0.12)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#111422' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#0C0F1A' }}
        >
          {collapsed
            ? <ChevronRight className="w-3.5 h-3.5" style={{ color: '#4A5568' }} />
            : <ChevronLeft className="w-3.5 h-3.5" style={{ color: '#4A5568' }} />}
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ background: '#07090F' }}>
        <Navbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          <ConstellationBoundary />
          <Outlet />
        </main>

        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="animate-slide-in px-4 py-3 rounded-lg shadow-lg text-sm font-medium pointer-events-auto text-white"
              style={{
                background: n.type === 'success' ? 'rgba(0,255,136,0.9)' :
                  n.type === 'error' ? 'rgba(255,45,85,0.95)' :
                  n.type === 'warning' ? 'rgba(255,184,0,0.95)' : '#111422',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              {n.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
