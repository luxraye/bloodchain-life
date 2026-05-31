import { useState } from 'react'

const INQUIRY_LABELS = {
  general:     'General enquiry',
  partnership: 'Partnership / pilot',
  media:       'Media / demo request',
}

const FIELDS = [
  { id: 'name',         label: 'Full name',       hint: 'Your full name',                        type: 'text',  required: true  },
  { id: 'organization', label: 'Organisation',    hint: 'Hospital, ministry, NGO, university…',  type: 'text',  required: false },
  { id: 'email',        label: 'Email address',   hint: 'We will reply here',                    type: 'email', required: true  },
  { id: 'phone',        label: 'Phone',           hint: '+267 7XX XXX XX (optional)',             type: 'tel',   required: false },
]

export default function ContactFormModal({ isOpen, onClose, inquiryType = 'general' }) {
  const [form, setForm]     = useState({ name: '', organization: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  if (!isOpen) return null

  const endpoint = import.meta.env.VITE_FORMSPREE_URL

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!endpoint) {
      console.warn('VITE_FORMSPREE_URL not set — submission skipped.')
      setStatus('success')
      return
    }
    setStatus('submitting')
    try {
      const res = await fetch(endpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify({ ...form, inquiryType: INQUIRY_LABELS[inquiryType] }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  function handleClose() {
    setForm({ name: '', organization: '', email: '', phone: '', message: '' })
    setStatus('idle')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md max-h-[92vh] flex flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-bc-raised shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(168,31,56,0.15)' }}
      >
        {/* Accent bar */}
        <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, #A81F38, #C4304E, #A81F38)' }} />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-burg-400 mb-1">
              {INQUIRY_LABELS[inquiryType]}
            </p>
            <h2 className="text-lg font-extrabold text-white">Get in touch</h2>
            <p className="mt-1 text-xs leading-relaxed text-[#8899A8]">
              Leave your details and we will follow up directly.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-[#8899A8] text-xs transition hover:bg-white/[0.08] hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="h-px mx-6 bg-white/[0.06]" />

        {status === 'success' ? (
          <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-neon-green/30 bg-neon-green/10">
              <svg className="h-7 w-7 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <p className="text-base font-bold text-white mb-1">Message received</p>
              <p className="text-sm text-[#8899A8] leading-relaxed">
                We will be in touch shortly. Keep an eye on your inbox.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="mt-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-[#8899A8] transition hover:text-white hover:bg-white/[0.07]"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto px-6 pb-6 pt-5 space-y-4">
            {FIELDS.map(({ id, label, hint, type, required }) => (
              <div key={id}>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <label htmlFor={id} className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8899A8]">
                    {label}{required && <span className="ml-0.5 text-burg-400">*</span>}
                  </label>
                  <span className="text-[10px] text-[#4A5568]">{hint}</span>
                </div>
                <input
                  id={id}
                  type={type}
                  required={required}
                  value={form[id]}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-[#2E3548] outline-none transition focus:border-burg-500/60 focus:bg-burg-500/[0.05] focus:ring-1 focus:ring-burg-500/25"
                />
              </div>
            ))}

            <div>
              <div className="mb-1.5 flex items-baseline justify-between">
                <label htmlFor="message" className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8899A8]">
                  Message
                </label>
                <span className="text-[10px] text-[#4A5568]">Optional</span>
              </div>
              <textarea
                id="message"
                rows={3}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us about your context or what you would like to discuss…"
                className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-[#2E3548] outline-none transition focus:border-burg-500/60 focus:bg-burg-500/[0.05] focus:ring-1 focus:ring-burg-500/25"
              />
            </div>

            {status === 'error' && (
              <p className="rounded-xl border border-neon-red/20 bg-neon-red/[0.08] px-4 py-2.5 text-xs text-neon-red">
                Something went wrong. Please try again or email us directly.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full rounded-xl bg-burg-500 py-3 text-sm font-bold text-white shadow-glow-burg transition hover:bg-burg-400 hover:shadow-[0_0_28px_rgba(168,31,56,0.55)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'submitting' ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Sending…
                </span>
              ) : 'Send message'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
