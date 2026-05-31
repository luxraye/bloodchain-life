/**
 * Shift sync — background poll only (no UI panel).
 * Keeps cross-facility activity warm for future map/queue hooks.
 */
import apiClient from './api.js'
import { isDemoSession } from './isDemoSession.js'
import { DEMO_SHIFT_LOGS } from '../data/seedVoyager.js'

const POLL_MS = 30_000
let intervalId = null
let latestLogs = []

export function getShiftSyncLogs() {
  return latestLogs
}

async function poll() {
  if (isDemoSession()) {
    latestLogs = DEMO_SHIFT_LOGS
    return
  }
  try {
    const { data } = await apiClient.get('/activity/shift-sync')
    const rows = data.data ?? []
    latestLogs = rows.length ? rows : (import.meta.env.DEV ? DEMO_SHIFT_LOGS : [])
  } catch {
    if (import.meta.env.DEV) latestLogs = DEMO_SHIFT_LOGS
  }
}

export function startShiftSyncBackground() {
  if (intervalId != null) return
  poll()
  intervalId = setInterval(poll, POLL_MS)
}

export function stopShiftSyncBackground() {
  if (intervalId != null) {
    clearInterval(intervalId)
    intervalId = null
  }
  latestLogs = []
}
