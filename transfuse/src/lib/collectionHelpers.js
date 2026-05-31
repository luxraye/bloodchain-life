// Shared utility functions — used by InventoryDashboard and TransfusionLog

export function daysUntilExpiry(unit) {
  if (!unit?.expiresAt) return null
  return Math.floor((new Date(unit.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))
}

export function getInventoryByType(units) {
  const counts = {}
  ;(units || []).filter(u => u.status === 'AVAILABLE').forEach(u => {
    const t = u.bloodType || u.type
    counts[t] = (counts[t] || 0) + 1
  })
  const types = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']
  return types.map(type => ({
    type,
    units: counts[type] || 0,
    color: type.startsWith('O') ? '#dc2626' : '#64748b',
  }))
}
