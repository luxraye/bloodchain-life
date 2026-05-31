import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import ConstellationBoundary from '../components/ConstellationBoundary'
import { useApp } from '../context/AppContext'
import {
  LayoutDashboard, GitPullRequest, Users, FileHeart, ShieldAlert,
  ChevronLeft, ChevronRight,
} from 'lucide-react'

const NAV = [
  { to: '/inventory',       icon: LayoutDashboard, label: 'Inventory',        badge: null },
  { to: '/requests',        icon: GitPullRequest,  label: 'Requests',         badge: 'pending' },
  { to: '/standby',         icon: Users,           label: 'Standby Donors',   badge: null },
  { to: '/transfusion',     icon: FileHeart,       label: 'Transfusion Log',  badge: null },
  { to: '/haemovigilance',  icon: ShieldAlert,     label: 'Haemovigilance',   badge: 'adverse' },
]

export default function Layout() {
  const { requests, notifications, adverseEvents } = useApp()
  const [collapsed, setCollapsed] = useState(false)

  const pendingCount = requests.filter(r => r.status === 'PENDING').length
  const openAdverse = adverseEvents.filter(a => a.status !== 'CLOSED').length

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#07090F' }}>

      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col relative transition-all duration-300"
        style={{
          width: collapsed ? 60 : 216,
          background: '#0C0F1A',
          borderRight: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* App identity */}
        <div className="h-14 flex items-center px-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1B3E5E, #3A82B8)', boxShadow: '0 2px 8px rgba(58,130,184,0.3)' }}
            >
              <FileHeart className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <h1 className="text-sm font-bold tracking-tight" style={{ color: '#F0F4F8' }}>Transfuse</h1>
                <p className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: '#4A5568' }}>Bloodchain</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {!collapsed && (
            <p className="text-[9px] font-semibold uppercase tracking-widest mb-2 px-2" style={{ color: '#4A5568', letterSpacing: '0.14em' }}>Clinical</p>
          )}
          {NAV.map(({ to, icon: Icon, label, badge }) => {
            const count = badge === 'pending' ? pendingCount : badge === 'adverse' ? openAdverse : 0
            return (
              <NavLink
                key={to}
                to={to}
                title={label}
                className={({ isActive }) => [
                  'flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative',
                  collapsed ? 'justify-center px-2' : '',
                ].join(' ')}
                style={({ isActive }) => isActive
                  ? { background: 'rgba(168,31,56,0.15)', color: '#D96070', border: '1px solid rgba(168,31,56,0.25)' }
                  : { color: '#4A5568', border: '1px solid transparent' }
                }
                onMouseEnter={e => { if (!e.currentTarget.style.background.includes('168')) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#8899A8' } }}
                onMouseLeave={e => { if (!e.currentTarget.style.background.includes('168')) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4A5568' } }}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                {!collapsed && <span className="animate-fade-in truncate">{label}</span>}
                {count > 0 && (
                  <span className={`${collapsed ? 'absolute -top-1 -right-1' : 'ml-auto'} min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold text-white px-1`}
                    style={{ background: '#FF2D55' }}>
                    {count}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="absolute -right-3 top-16 w-6 h-6 rounded-full flex items-center justify-center transition-colors z-10"
          style={{ background: '#0C0F1A', border: '1px solid rgba(255,255,255,0.12)' }}
          onMouseEnter={e => e.currentTarget.style.background = '#111422'}
          onMouseLeave={e => e.currentTarget.style.background = '#0C0F1A'}
        >
          {collapsed
            ? <ChevronRight className="w-3.5 h-3.5" style={{ color: '#4A5568' }} />
            : <ChevronLeft  className="w-3.5 h-3.5" style={{ color: '#4A5568' }} />}
        </button>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#07090F' }}>
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6" style={{ background: '#07090F' }}>
          <ConstellationBoundary />
          <Outlet />
        </main>

        {/* Toast notifications */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          {notifications.map(n => (
            <div key={n.id} className="animate-slide-in px-4 py-3 rounded-lg shadow-lg text-sm font-medium max-w-sm text-white" style={{
              background: n.type === 'success' ? 'rgba(0,255,136,0.9)' :
                n.type === 'error' ? 'rgba(255,45,85,0.95)' :
                n.type === 'warning' ? 'rgba(255,184,0,0.95)' : '#111422',
              border: '1px solid rgba(255,255,255,0.12)',
            }}>
              {n.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
