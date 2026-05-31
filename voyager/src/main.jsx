import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '../../packages/ui/src/styles/globals.css'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

const isGuestDemo =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('guest') === '1'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: isGuestDemo ? false : undefined,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className="bc-app">
        <AuthProvider>
          <App />
        </AuthProvider>
      </div>
    </QueryClientProvider>
  </StrictMode>,
)
