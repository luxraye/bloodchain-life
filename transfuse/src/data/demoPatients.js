/** Demo hospital patients for transfusion workflow (no national donor IDs). */
export const DEMO_PATIENTS = [
  { id: 'PAT-2026-001', name: 'M. Sithole', bloodType: 'O+', ward: 'Trauma Unit · Block A' },
  { id: 'PAT-2026-002', name: 'K. Moagi', bloodType: 'B+', ward: 'Surgery · Ward 4' },
  { id: 'PAT-2026-003', name: 'L. Kgosana', bloodType: 'A-', ward: 'ICU · Level 2' },
  { id: 'PAT-2026-004', name: 'P. Tshosa', bloodType: 'O-', ward: 'Maternity · Ward 2' },
  { id: 'PAT-2026-005', name: 'N. Batsumi', bloodType: 'AB+', ward: 'Oncology · Ward 6' },
]

export function findDemoPatient(id) {
  const key = (id || '').trim().toUpperCase()
  return DEMO_PATIENTS.find(p => p.id.toUpperCase() === key) ?? null
}
