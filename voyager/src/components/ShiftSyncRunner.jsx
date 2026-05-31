import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { startShiftSyncBackground, stopShiftSyncBackground } from '../lib/shiftSyncBackground.js'

/** Mounts background shift-sync polling while the session is active. Renders nothing. */
export default function ShiftSyncRunner() {
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      stopShiftSyncBackground()
      return undefined
    }
    startShiftSyncBackground()
    return () => stopShiftSyncBackground()
  }, [user])

  return null
}
