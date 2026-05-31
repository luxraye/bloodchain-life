import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../packages/ui/src/styles/globals.css'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <div className="bc-app">
        <App />
      </div>
    </AuthProvider>
  </StrictMode>,
)
