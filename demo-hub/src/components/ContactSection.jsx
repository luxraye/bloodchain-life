import { useState } from 'react'
import { SITE } from '../content/site'
import ContactFormModal from './ContactFormModal'

const ACTIONS = [
  { key: 'general',     label: 'General enquiry',    primary: true },
  { key: 'partnership', label: 'Partnership / pilot', primary: false },
  { key: 'media',       label: 'Media / demo',        primary: false },
]

export default function ContactSection() {
  const [activeForm, setActiveForm] = useState(null)

  return (
    <>
      <section id="contact" className="relative py-20 border-t border-white/[0.06]">

        {/* Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-1/2 -z-10 -translate-y-1/2 h-96 w-80 rounded-full opacity-[0.06] blur-[80px]"
          style={{ background: '#A81F38' }}
        />

        <div className="mx-auto max-w-3xl px-6">

          <p className="mb-2 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-burg-400">
            Get in touch
          </p>
          <h2 className="mb-3 text-center text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Ready to see it live?
          </h2>
          <p className="mx-auto mb-10 max-w-md text-center text-sm leading-relaxed text-[#8899A8]">
            We work directly with health ministries, hospitals, blood services, and NGOs. Reach out to{' '}
            <span className="font-semibold text-white">{SITE.contactName}</span>{' '}
            to arrange a guided walkthrough or discuss a pilot.
          </p>

          {/* Contact details card */}
          <div className="mb-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
            <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(168,31,56,0.5), transparent)' }} />
            <div className="flex flex-col items-center justify-center gap-4 p-6 sm:flex-row sm:gap-8">
              <a
                href={`mailto:${SITE.contactEmail}`}
                className="inline-flex items-center gap-2 font-mono text-sm text-[#8899A8] transition hover:text-white"
              >
                <span className="text-burg-400">✉</span>
                {SITE.contactEmail}
              </a>
              <span className="hidden text-white/10 sm:inline">·</span>
              <a
                href={`tel:${SITE.contactPhoneTel}`}
                className="inline-flex items-center gap-2 font-mono text-sm text-[#8899A8] transition hover:text-white"
              >
                <span className="text-burg-400">☏</span>
                {SITE.contactPhoneDisplay}
              </a>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            {ACTIONS.map(({ key, label, primary }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveForm(key)}
                className={
                  primary
                    ? 'inline-flex items-center justify-center gap-2 rounded-xl bg-burg-500 px-6 py-3 text-sm font-bold text-white shadow-glow-burg transition hover:bg-burg-400 hover:shadow-[0_0_28px_rgba(168,31,56,0.55)] hover:-translate-y-0.5'
                    : 'inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-6 py-3 text-sm font-semibold text-[#8899A8] backdrop-blur-sm transition hover:border-white/20 hover:text-white hover:-translate-y-0.5'
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <ContactFormModal
        isOpen={activeForm !== null}
        onClose={() => setActiveForm(null)}
        inquiryType={activeForm ?? 'general'}
      />
    </>
  )
}
