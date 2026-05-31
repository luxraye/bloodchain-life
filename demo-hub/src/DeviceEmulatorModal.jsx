import { QRCodeSVG } from 'qrcode.react'

export default function DeviceEmulatorModal({ isOpen, onClose, app }) {
  if (!isOpen) return null

  const isPhone = app.deviceFrame === 'iphone'
  const isTablet = app.deviceFrame === 'ipad'

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
        {/* Header bar */}
        <div className="sticky top-0 z-20 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/95 px-6 py-3 shadow-xl backdrop-blur-xl">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold"
            style={{ background: app.accentColor + '20', color: app.accentColor, border: `1px solid ${app.accentColor}30` }}
          >
            {app.icon}
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">{app.name}</h2>
            <p className="font-mono text-[10px] text-slate-500">
              {isPhone ? 'iPhone · 390×844' : 'iPad Pro · 1024×768'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-8 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/8 text-sm text-slate-400 transition hover:bg-white/15 hover:text-white"
          >
            ✕
          </button>
        </div>

        {isPhone && (
          <div className="iphone-frame" style={{ width: 418, height: 872 }}>
            <div className="iphone-screen" style={{ width: 390, height: 844 }}>
              <iframe
                src={app.url}
                title={app.name}
                width={390}
                height={844}
                style={{ border: 'none', display: 'block' }}
                allow="camera; microphone"
              />
            </div>
          </div>
        )}

        {isTablet && (
          <div className="ipad-frame" style={{ width: 1072, height: 808 }}>
            <div className="ipad-screen" style={{ width: 1024, height: 768 }}>
              <iframe
                src={app.url}
                title={app.name}
                width={1024}
                height={768}
                style={{ border: 'none', display: 'block' }}
                allow="camera; microphone"
              />
            </div>
          </div>
        )}

        {app.showQr && (
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/80 px-5 py-3 shadow-md backdrop-blur-sm">
            <div className="shrink-0 rounded-lg border border-white/10 bg-white p-1.5">
              <QRCodeSVG value={app.url} size={52} bgColor="#fff" fgColor="#0f172a" level="M" />
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-slate-400">
              For a native experience, scan with your phone camera and tap{' '}
              <span className="font-semibold text-slate-200">"Add to Home Screen"</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
