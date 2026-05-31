import { useAuth } from './useAuth.js'

const COORDINATOR_ROLES = ['LOGISTICS_COMMAND', 'ADMIN', 'SUPER_ADMIN']

/** True when the session is a desk coordinator (not field-only courier). */
export function useCoordinatorMode() {
  const { hasRole, user, isDemoMode } = useAuth()
  const isCoordinator = hasRole(...COORDINATOR_ROLES)
  return { isCoordinator, user, isDemoMode }
}
