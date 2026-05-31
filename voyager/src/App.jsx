import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { JobProvider } from './context/JobContext';
import ShiftSyncRunner from './components/ShiftSyncRunner.jsx';
import { useAuth } from './hooks/useAuth';
import BottomNav from './components/BottomNav';
import Navbar from './components/Navbar';
import DevSyncTool from './components/DevSyncTool';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import JobFeed from './pages/JobFeed';
import ActiveJob from './pages/ActiveJob';
import MapView from './pages/MapView';
import Profile from './pages/Profile';
import LoginScreen from './components/LoginScreen';
import BrandLogo from './components/BrandLogo';
import {
  LayoutDashboard, ClipboardList, Truck, Map, User, Lock, LogOut, Activity,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Command', end: true },
  { to: '/queue', icon: ClipboardList, label: 'Dispatch' },
  { to: '/active', icon: Truck, label: 'Active' },
  { to: '/map', icon: Map, label: 'Map' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const ALLOWED_ROLES = ['TRANSIT', 'LOGISTICS_COMMAND', 'ADMIN', 'SUPER_ADMIN'];

function DesktopSidebar() {
  const { user, logout } = useAuth();
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? 'LG';

  return (
    <aside
      className="hidden lg:flex flex-col w-[220px] shrink-0 border-r border-white/10"
      style={{ background: 'var(--bg-surface)' }}
    >
      <div className="flex items-center gap-3 px-4 h-14 border-b border-white/10 shrink-0">
        <BrandLogo size={32} />
        <div className="min-w-0">
          <h1 className="text-xs font-bold text-white tracking-widest uppercase">Voyager</h1>
          <p className="text-[9px] font-mono tracking-widest truncate" style={{ color: 'var(--text-muted)' }}>
            LOGISTICS COMMAND
          </p>
        </div>
      </div>
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'border border-[rgba(132,204,22,0.25)]'
                  : 'border border-transparent text-neutral-500 hover:text-white hover:bg-white/5'
              }`
            }
            style={({ isActive }) => (isActive ? { background: 'rgba(132,204,22,0.12)', color: '#a3e635' } : {})}
          >
            <Icon size={16} className="shrink-0" />
            <span className="text-[13px]">{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Activity size={11} style={{ color: '#84cc16' }} />
          <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>Logistics online</span>
        </div>
      </div>
      <div className="border-t border-white/10 p-2 shrink-0">
        {user && (
          <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{ background: 'rgba(132,204,22,0.15)', color: '#a3e635', border: '1px solid rgba(132,204,22,0.3)' }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-neutral-200 truncate">{user.name}</p>
              <p className="text-[10px] font-mono truncate" style={{ color: 'var(--text-muted)' }}>{user.role}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 px-2.5 py-2 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-white/5 transition-all text-xs"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </aside>
  );
}

function AccessDenied() {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center" style={{ background: 'var(--bg-base)' }}>
      <div className="w-14 h-14 rounded-full bg-red-950 flex items-center justify-center">
        <Lock size={22} className="text-red-400" />
      </div>
      <h1 className="text-xl font-bold text-white">Access Denied</h1>
      <p className="text-sm max-w-sm" style={{ color: 'var(--text-secondary)' }}>
        Role <span className="font-mono" style={{ color: '#84cc16' }}>{user?.role}</span> cannot access Voyager.
      </p>
      <button type="button" onClick={() => logout()} className="btn-lime mt-2 rounded-lg px-5 py-2 text-sm font-medium text-white">
        Log out
      </button>
    </div>
  );
}

export default function App() {
  const { user, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <div className="h-8 w-8 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(132,204,22,0.2)', borderTopColor: '#84cc16' }} />
      </div>
    );
  }
  if (!user) return <LoginScreen />;
  if (!hasRole(...ALLOWED_ROLES)) return <AccessDenied />;

  return (
    <>
      <BrowserRouter>
        <JobProvider>
          <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--bg-base)' }}>
            <DesktopSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <div className="lg:hidden">
                <Navbar />
              </div>
              <div className="min-h-0 flex-1 overflow-hidden">
                <Routes>
                  <Route path="/" element={<CoordinatorDashboard />} />
                  <Route path="/queue" element={<JobFeed />} />
                  <Route path="/active" element={<ActiveJob />} />
                  <Route path="/map" element={<MapView />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </div>
              <BottomNav />
            </div>
          </div>
        </JobProvider>
        <ShiftSyncRunner />
        <DevSyncTool />
      </BrowserRouter>
    </>
  );
}
