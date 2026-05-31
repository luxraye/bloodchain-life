import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

const TERMS_SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: `By creating an account on Bloodchain Azure, you explicitly agree to these Terms of Service. This agreement constitutes a legally binding contract between you (the Data Subject) and the Nakedi Research Institute (the Data Controller), governed by the Botswana Data Protection Act, 2024.`,
  },
  {
    title: '2. Nature of Data Collection (Section 39 & 40)',
    body: `To facilitate safe blood donation, we collect the following:

Personal Data: Your name, National ID (Omang) number, and contact details.

Sensitive Personal Data: Your health history, lifestyle questionnaire responses, and blood screening results (including TTI status).

Location Data: Used to suggest the nearest donation centers.`,
  },
  {
    title: '3. Explicit Consent for Health Data (Section 30)',
    body: `By using this service, you provide explicit, informed consent for Bloodchain to process your health data. This data is used solely for:

Determining donation eligibility.

Ensuring the safety of the national blood supply.

Maintaining a digital chain of custody from "Vein to Vein."`,
  },
  {
    title: '4. Your Rights as a Data Subject (Part VIII)',
    body: `Under the Act, you maintain the following rights:

Right to Withdraw: You may withdraw your consent at any time. Note that withdrawal does not affect the lawfulness of processing occurred prior to withdrawal.

Right to Erasure ("Right to be Forgotten"): You may request the deletion of your profile.

Right to Access: You may request a machine-readable copy of all data we hold about you.`,
  },
  {
    title: '5. Data Security & Retention (Section 62)',
    body: `We implement enterprise-grade encryption and technical safeguards to protect your information. In the unlikely event of a data breach, we are committed to notifying the Information and Data Protection Commission within 72 hours.`,
  },
]

type TermsModalProps = {
  open: boolean
  onClose: () => void
}

export default function TermsModal({ open, onClose }: TermsModalProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-[100]">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6">
        <DialogPanel
          transition
          className="flex max-h-[min(90vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <DialogTitle className="text-lg font-bold tracking-tight text-slate-900">
              Bloodchain Azure: Terms of Service & Privacy Disclosure
            </DialogTitle>
            <p className="mt-1 text-xs text-slate-500">Last Updated: March 29, 2026</p>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
            <div className="space-y-4 text-xs leading-relaxed text-slate-600">
              {TERMS_SECTIONS.map((section) => (
                <section key={section.title}>
                  <h3 className="mb-1.5 font-semibold text-slate-800">{section.title}</h3>
                  <p className="whitespace-pre-line text-slate-500">{section.body}</p>
                </section>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="h-11 w-full rounded-xl bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
