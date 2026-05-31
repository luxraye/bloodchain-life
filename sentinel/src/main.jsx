import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../packages/ui/src/styles/globals.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="bc-app">
      <App />
    </div>
  </StrictMode>,
)
