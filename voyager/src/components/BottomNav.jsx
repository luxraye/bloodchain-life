import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Truck, Map, User } from 'lucide-react';

const tabs = [
    { to: '/', icon: LayoutDashboard, label: 'Command' },
    { to: '/queue', icon: ClipboardList, label: 'Queue' },
    { to: '/active', icon: Truck, label: 'Active' },
    { to: '/map', icon: Map, label: 'Map' },
    { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
    return (
        <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 backdrop-blur-lg lg:hidden" style={{ background: 'rgba(12,15,26,0.95)' }}>
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-around">
                {tabs.map(tab => (
                    <NavLink
                        key={tab.to}
                        to={tab.to}
                        end={tab.to === '/'}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all ${isActive ? '' : 'text-neutral-500'}`
                        }
                        style={({ isActive }) => (isActive ? { color: '#84cc16' } : {})}
                    >
                        <tab.icon className="w-5 h-5" />
                        <span className="text-[9px] font-semibold">{tab.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
