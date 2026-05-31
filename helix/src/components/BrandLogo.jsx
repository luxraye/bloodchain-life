import { useState } from 'react'
import { FlaskConical } from 'lucide-react'

/**
 * Tries /branding/logo.png then logo.svg (repo ships SVG from demo-hub favicon).
 */
export default function BrandLogo({ size = 32, className = '' }) {
  const [failed, setFailed] = useState(false)
  const src = failed ? null : '/branding/logo.svg'

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl shrink-0 ${className}`}
        style={{
          width: size,
          height: size,
          background: 'rgba(168,31,56,0.15)',
          border: '1px solid rgba(168,31,56,0.35)',
        }}
      >
        <FlaskConical style={{ width: size * 0.55, height: size * 0.55, color: '#D96070' }} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt="Bloodchain"
      width={size}
      height={size}
      className={`object-contain shrink-0 rounded-lg ${className}`}
      onError={() => setFailed(true)}
    />
  )
}
