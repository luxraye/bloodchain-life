import { useState } from 'react'
import { Droplets } from 'lucide-react'

export default function BrandLogo({ size = 32, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl shrink-0 ${className}`}
        style={{
          width: size,
          height: size,
          background: 'rgba(0, 200, 255, 0.12)',
          border: '1px solid rgba(0, 200, 255, 0.35)',
        }}
      >
        <Droplets style={{ width: size * 0.55, height: size * 0.55, color: '#00C8FF' }} />
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
