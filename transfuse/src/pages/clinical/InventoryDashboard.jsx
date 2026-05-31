import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { daysUntilExpiry } from '../../lib/collectionHelpers.js'
import { formatIsbt128 } from '../../lib/isbt128.js'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { LayoutDashboard, Clock, Thermometer, Droplets, TrendingDown, Package, ShieldAlert } from 'lucide-react'

const BLOOD_COLORS = {
  'O+': '#dc2626', 'O-': '#ef4444',
  'A+': '#2563eb', 'A-': '#3b82f6',
  'B+': '#7c3aed', 'B-': '#8b5cf6',
  'AB+': '#059669', 'AB-': '#10b981',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#111422', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 8, padding: '8px 14px' }}>
      <p style={{ color: '#F0F4F8', fontWeight: 700, marginBottom: 2 }}>{label}</p>
      <p style={{ color: '#8899A8', fontSize: 12 }}>{payload[0].value} units available</p>
    </div>
  )
}

function StatTile({ icon: Icon, iconColor, label, value, sub, alert }) {
  return (
    <div className="card p-4" style={alert ? { borderColor: alert === 'red' ? 'rgba(255,45,85,0.3)' : 'rgba(255,184,0,0.3)' } : {}}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" style={{ color: iconColor }} />
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#4A5568' }}>{label}</span>
      </div>
      <p className="text-3xl font-extrabold tracking-tight" style={{ color: alert === 'red' ? '#FF2D55' : alert === 'amber' ? '#FFB800' : '#F0F4F8' }}>{value}</p>
      <p className="text-xs mt-0.5" style={{ color: '#4A5568' }}>{sub}</p>
    </div>
  )
}

export default function InventoryDashboard() {
  const { bloodUnits, unitsLoading, inventory } = useApp()

  const availableUnits = useMemo(() => bloodUnits.filter(u => u.status === 'AVAILABLE'), [bloodUnits])

  const chartData = useMemo(() => {
    const counts = {}
    availableUnits.forEach(u => { const t = u.type || u.bloodType; counts[t] = (counts[t] || 0) + 1 })
    return inventory.map(item => ({ type: item.type, units: (counts[item.type] || 0) + item.units, color: BLOOD_COLORS[item.type] || '#64748b' }))
  }, [availableUnits, inventory])

  const totalUnits     = chartData.reduce((s, d) => s + d.units, 0)
  const lowStock       = chartData.filter(d => d.units < 5)
  const expiring       = bloodUnits.filter(u => u.status === 'AVAILABLE' && daysUntilExpiry(u) != null && daysUntilExpiry(u) <= 3 && daysUntilExpiry(u) >= 0)
  const quarantine     = bloodUnits.filter(u => u.status === 'QUARANTINE')

  if (unitsLoading) return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] mb-1" style={{ color: '#A81F38' }}>Blood Bank · Inventory</p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: '#F0F4F8' }}>Inventory Dashboard</h1>
      </div>
      <div className="card p-12 text-center">
        <div className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-4" style={{ borderColor: 'rgba(58,130,184,0.3)', borderTopColor: '#3A82B8' }} />
        <p style={{ color: '#8899A8' }}>Loading inventory…</p>
      </div>
    </div>
  )

  return (
    <div className="animate-fade-in">

      {/* Header */}
      <div className="mb-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] mb-1" style={{ color: '#A81F38' }}>Blood Bank · Inventory</p>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: '#F0F4F8' }}>Inventory Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#4A5568' }}>Real-time stock levels, expiry alerts, and quarantine tracking.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatTile icon={Package}     iconColor="#5BA4D4" label="Total Stock"  value={totalUnits}   sub="units available" />
        <StatTile icon={Droplets}    iconColor="#D96070" label="Blood Types"  value={8}            sub="types tracked" />
        <StatTile icon={TrendingDown} iconColor={lowStock.length > 0 ? '#FF2D55' : '#4A5568'} label="Low Stock" value={lowStock.length}  sub="types below 5"   alert={lowStock.length > 0 ? 'red' : null} />
        <StatTile icon={Clock}       iconColor={expiring.length > 0 ? '#FFB800' : '#4A5568'} label="Expiring"  value={expiring.length} sub="within 3 days"  alert={expiring.length > 0 ? 'amber' : null} />
      </div>

      {/* Alerts */}
      {(lowStock.length > 0 || expiring.length > 0) && (
        <div className="space-y-2 mb-6">
          {lowStock.map(item => (
            <div key={item.type} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.25)' }}>
              <ShieldAlert className="w-4 h-4 flex-shrink-0" style={{ color: '#FF2D55' }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: '#FF2D55' }}>Low Stock: {item.type} — {item.units} unit(s)</p>
                <p className="text-xs" style={{ color: '#8899A8' }}>Request replenishment from NBTS via Request Management.</p>
              </div>
            </div>
          ))}
          {expiring.map(unit => (
            <div key={unit.id} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(255,184,0,0.07)', border: '1px solid rgba(255,184,0,0.25)' }}>
              <Clock className="w-4 h-4 flex-shrink-0" style={{ color: '#FFB800' }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: '#FFB800' }}>{unit.id} ({unit.type || unit.bloodType}) — {daysUntilExpiry(unit)} day(s) remaining</p>
                <p className="text-xs" style={{ color: '#8899A8' }}>{unit.location || unit.currentLocation} · Expires {new Date(unit.expiresAt).toLocaleDateString('en-GB')}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Chart */}
        <div className="lg:col-span-2 card p-6">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#4A5568' }}>Stock by Blood Type</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="type" tick={{ fontSize: 11, fill: '#8899A8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#4A5568' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="units" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fridge view */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#4A5568' }}>Fridge View</p>
          {chartData.map(item => (
            <div key={item.type} className="card-hover p-3 flex items-center justify-between"
              style={item.units < 5 ? { borderColor: 'rgba(255,45,85,0.3)', background: 'rgba(255,45,85,0.06)' } : {}}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: (BLOOD_COLORS[item.type] || '#64748b') + '20' }}>
                  <Droplets className="w-4 h-4" style={{ color: BLOOD_COLORS[item.type] || '#64748b' }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: '#F0F4F8' }}>{item.type}</p>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={
                    item.units < 5  ? { background: 'rgba(255,45,85,0.15)',  color: '#FF2D55' } :
                    item.units < 10 ? { background: 'rgba(255,184,0,0.15)',  color: '#FFB800' } :
                                      { background: 'rgba(0,255,136,0.12)',  color: '#00FF88' }
                  }>
                    {item.units < 5 ? 'LOW' : item.units < 10 ? 'MODERATE' : 'ADEQUATE'}
                  </span>
                </div>
              </div>
              <p className="text-2xl font-extrabold" style={{ color: item.units < 5 ? '#FF2D55' : '#F0F4F8' }}>{item.units}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quarantine */}
      {quarantine.length > 0 && (
        <div className="mt-6 card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Thermometer className="w-4 h-4" style={{ color: '#FFB800' }} />
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#4A5568' }}>In Quarantine ({quarantine.length})</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quarantine.map(unit => (
              <div key={unit.id} className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ background: 'rgba(255,184,0,0.07)', border: '1px solid rgba(255,184,0,0.2)' }}>
                <div>
                  <p className="font-mono text-sm font-bold" style={{ color: '#F0F4F8' }}>{formatIsbt128(unit.id)}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#8899A8' }}>{unit.type || unit.bloodType} · {unit.location || unit.currentLocation}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded" style={{ background: 'rgba(255,184,0,0.15)', color: '#FFB800' }}>HOLD</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
