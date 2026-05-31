import React from 'react'
import ReactDOM from 'react-dom/client'
import '../../packages/ui/src/styles/globals.css'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="bc-app">
      <App />
    </div>
  </React.StrictMode>,
)
