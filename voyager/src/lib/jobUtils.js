/** Cold-chain alert still needs coordinator acknowledgement */
export function needsColdChainAck(job) {
  if (!job?.coldChain) return false
  const { status, acknowledgedAt } = job.coldChain
  return (status === 'WARNING' || status === 'BREACH') && !acknowledgedAt
}

export function isUnassigned(job) {
  return !job?.courierId || job.courierId === 'Unassigned'
}
