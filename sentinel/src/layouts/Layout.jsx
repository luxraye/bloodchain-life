import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import { useCompliance } from '../context/ComplianceContext'
import {
  LayoutDashboard, Inbox, FileStack, ScrollText, Settings, ChevronLeft, ChevronRight,
} from 'lucide-react'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Command', badge: null, end: true },
  { to: '/queue', icon: Inbox, label: 'Review queue', badge: 'queue' },
  { to: '/templates', icon: FileStack, label: 'Templates', badge: null },
  { to: '/audit', icon: ScrollText, label: 'Audit log', badge: null },
  { to: '/settings', icon: Settings, label: 'Settings', badge: null },
]

export default function Layout() {
  const { stats, notifications } = useCompliance()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <aside
        className="flex flex-col relative transition-all duration-300"
        style={{ width: collapsed ? 60 : 220, background: 'var(--bg-surface)', borderRight: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="h-14 flex items-center px-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold badge-regulatory">⬛</div>
            {!collapsed && (
              <div>
                <h1 className="text-sm font-bold text-white">Sentinel</h1>
                <p className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Bloodchain</p>
              </div>
            )}
          </div>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {!collapsed && (
            <p className="text-[9px] font-semibold uppercase tracking-widest mb-2 px-2" style={{ color: 'var(--text-muted)' }}>
              Regulator
            </p>
          )}
          {NAV.map(({ to, icon: Icon, label, badge, end }) => {
            const count = badge === 'queue' ? stats.queue : 0
            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                title={label}
                className={({ isActive }) => `flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium relative ${collapsed ? 'justify-center' : ''}`}
                style={({ isActive }) =>
                  isActive
                    ? { background: 'rgba(124,58,237,0.15)', color: 'var(--sentinel-300)', border: '1px solid rgba(124,58,237,0.25)' }
                    : { color: 'var(--text-muted)', border: '1px solid transparent' }
                }
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
                {count > 0 && (
                  <span
                    className={`${collapsed ? 'absolute -top-1 -right-1' : 'ml-auto'} min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold text-white px-1`}
                    style={{ background: 'var(--sentinel-500)' }}
                  >
                    {count}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="absolute -right-3 top-16 w-6 h-6 rounded-full flex items-center justify-center z-10"
          style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} /> : <ChevronLeft className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />}
        </button>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="animate-slide-in px-4 py-3 rounded-lg text-sm font-medium text-white max-w-sm"
              style={{
                background: n.type === 'success' ? 'rgba(0,255,136,0.9)' : n.type === 'error' ? 'rgba(255,45,85,0.95)' : '#111422',
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
