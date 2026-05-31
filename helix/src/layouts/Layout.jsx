import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Layout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden" style={{ background: '#07090F' }}>
      <Navbar />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  )
}
