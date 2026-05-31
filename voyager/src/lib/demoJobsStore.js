/**
 * Mutable demo dispatch store — coordinator actions persist across refreshes in-session.
 */
import { DEMO_JOBS } from '../data/seedVoyager.js'

function cloneJobs() {
  return JSON.parse(JSON.stringify(DEMO_JOBS))
}

let jobs = cloneJobs()

export function getDemoJobs() {
  return jobs
}

export function setDemoJobs(next) {
  jobs = next
}

export function resetDemoJobs() {
  jobs = cloneJobs()
}

export function patchDemoJob(jobId, patch) {
  jobs = jobs.map((j) => (j.id === jobId ? { ...j, ...patch, updatedAt: new Date().toISOString() } : j))
  return jobs
}

export function patchDemoJobColdChain(jobId, coldPatch) {
  jobs = jobs.map((j) =>
    j.id === jobId
      ? {
          ...j,
          coldChain: { ...j.coldChain, ...coldPatch },
          updatedAt: new Date().toISOString(),
        }
      : j,
  )
  return jobs
}
