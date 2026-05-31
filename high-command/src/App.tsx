import { lazy, Suspense } from 'react';
import { Lock } from 'lucide-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import LoginScreen from './components/LoginScreen';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Constellation = lazy(() => import('./pages/Constellation'));
const Users = lazy(() => import('./pages/Users'));
const Ledger = lazy(() => import('./pages/Ledger'));
const Reports = lazy(() => import('./pages/Reports'));
const Verifications = lazy(() => import('./pages/IdentityVerification'));

const ALLOWED_ROLES = ['ADMIN', 'SUPER_ADMIN', 'MOH_AUDITOR'];

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-command-gold/30 border-t-command-gold rounded-full animate-spin"></div>
        <span className="text-xs text-neutral-500 font-mono">LOADING MODULE...</span>
      </div>
    </div>
  );
}

function AccessDenied() {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black p-6 text-center">
      <div className="w-14 h-14 rounded-full bg-red-950 flex items-center justify-center mb-2">
        <Lock size={22} className="text-red-400" />
      </div>
      <h1 className="text-xl font-bold text-neutral-100">Access Denied</h1>
      <p className="text-sm text-neutral-400 max-w-sm">
        <span className="font-medium text-neutral-200">{user?.name}</span>, your role
        (<span className="font-mono text-command-gold">{user?.role}</span>) does not have
        access to High Command. Only <span className="font-mono text-command-gold">ADMIN</span> users can use this app.
      </p>
      <button onClick={() => logout()} className="mt-2 rounded-lg bg-neutral-800 px-5 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-700 transition">
        Log out
      </button>
    </div>
  );
}

export default function App() {
  const { user, loading, hasRole } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <LoginScreen />;
  if (!hasRole(...ALLOWED_ROLES)) return <AccessDenied />;
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/constellation" element={<Constellation />} />
              <Route path="/users" element={<Users />} />
              <Route path="/ledger" element={<Ledger />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/verifications" element={<Verifications />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
