import { useState } from 'react'
import { Shield } from 'lucide-react'

export default function BrandLogo({ size = 32, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl shrink-0 ${className}`}
        style={{
          width: size,
          height: size,
          background: 'rgba(124,58,237,0.15)',
          border: '1px solid rgba(124,58,237,0.35)',
        }}
      >
        <Shield style={{ width: size * 0.55, height: size * 0.55, color: 'var(--sentinel-300)' }} />
      </div>
    )
  }

  return (
    <img
      src="/branding/logo.svg"
      alt="Bloodchain"
      width={size}
      height={size}
      className={`object-contain shrink-0 rounded-lg ${className}`}
      onError={() => setFailed(true)}
    />
  )
}
