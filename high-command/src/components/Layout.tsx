import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    Orbit,
    Users,
    BookOpen,
    FileBarChart2,
    ShieldCheck,
    ChevronLeft,
    Activity,
} from 'lucide-react';
import Navbar from './Navbar';
import { useAuth } from '../hooks/useAuth';

const navItems = [
    { to: '/',             label: 'National command', icon: LayoutDashboard },
    { to: '/constellation',label: 'Constellation',    icon: Orbit           },
    { to: '/users',        label: 'Keymaster',        icon: Users           },
    { to: '/ledger',       label: 'Master Ledger',    icon: BookOpen        },
    { to: '/reports',      label: 'Ministry Reporter',icon: FileBarChart2   },
    { to: '/verifications',label: 'Citizen Auditing', icon: ShieldCheck     },
];

export default function Layout() {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useAuth();

    const initials = user?.name
        ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
        : 'HC';

    return (
        <div className="flex h-screen bg-oled overflow-hidden font-inter">
            {/* ── Sidebar ── */}
            <aside
                className={`${collapsed ? 'w-[68px]' : 'w-[240px]'} flex flex-col border-r border-surface-400/50 bg-surface-50 transition-all duration-300 ease-in-out shrink-0`}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 h-14 border-b border-surface-400/50 shrink-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0" style={{ background: 'rgba(168,31,56,0.2)', color: '#D96070', border: '1px solid rgba(168,31,56,0.35)' }}>
                        ⬟
                    </div>
                    {!collapsed && (
                        <div className="animate-fade-in min-w-0">
                            <h1 className="text-xs font-bold text-white tracking-widest uppercase">High Command</h1>
                            <p className="text-[9px] text-neutral-600 font-mono tracking-widest truncate">PROGRAMME COCKPIT</p>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                                    isActive
                                        ? 'bg-[rgba(168,31,56,0.12)] text-[#D96070] border border-[rgba(168,31,56,0.25)]'
                                        : 'text-neutral-500 hover:text-white hover:bg-surface-200 border border-transparent'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon
                                        size={16}
                                        className={`shrink-0 ${isActive ? 'text-[#D96070]' : 'text-neutral-600 group-hover:text-neutral-300'}`}
                                    />
                                    {!collapsed && (
                                        <span className="animate-fade-in truncate text-[13px]">{label}</span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* System status */}
                {!collapsed && (
                    <div className="px-4 py-3 border-t border-surface-400/50 animate-fade-in">
                        <div className="flex items-center gap-2">
                            <Activity size={11} className="text-emerald-500" />
                            <span className="text-[10px] text-neutral-500 font-mono">System online · v2.4.0</span>
                        </div>
                    </div>
                )}

                {/* User strip + collapse toggle */}
                <div className="border-t border-surface-400/50 p-2 shrink-0">
                    {!collapsed && user && (
                        <div className="flex items-center gap-2.5 px-2 py-2 mb-1 animate-fade-in">
                            <div className="w-7 h-7 rounded-full bg-command-gold/15 border border-command-gold/25 flex items-center justify-center text-[10px] font-bold text-command-gold shrink-0">
                                {initials}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-neutral-200 truncate">{user.name}</p>
                                <p className="text-[10px] text-neutral-600 font-mono truncate">{user.role}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center justify-center gap-2 px-2.5 py-2 rounded-lg text-neutral-600 hover:text-neutral-300 hover:bg-surface-200 transition-all text-sm"
                        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <ChevronLeft
                            size={15}
                            className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
                        />
                        {!collapsed && <span className="text-[11px]">Collapse</span>}
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <div className="flex-1 overflow-auto p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
