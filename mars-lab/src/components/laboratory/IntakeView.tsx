import { useState } from 'react'
import { CheckCircle2, ScanLine } from 'lucide-react'

const BLOOD_TYPES  = ['O+', 'O−', 'A+', 'A−', 'B+', 'B−', 'AB+', 'AB−']
const COMPONENTS   = ['Whole Blood', 'RBC', 'Plasma', 'Platelets']
const FACILITIES   = ['Gaborone HQ', 'Francistown Regional', 'Princess Marina Hospital', 'Nyangabgwe Referral', 'BDF Medical', 'Gaborone Private Hospital']

interface FormState {
  unitId:      string
  donorId:     string
  bloodType:   string
  component:   string
  collectedAt: string
  facility:    string
  volume:      string
}

const EMPTY: FormState = {
  unitId:      '',
  donorId:     '',
  bloodType:   '',
  component:   '',
  collectedAt: '',
  facility:    '',
  volume:      '',
}

function Field({
  label, hint, children, required,
}: { label: string; hint?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: '#8899A8' }}>
          {label}{required && <span style={{ color: '#A81F38' }}> *</span>}
        </label>
        {hint && <span className="text-[10px]" style={{ color: '#4A5568' }}>{hint}</span>}
      </div>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width:        '100%',
  background:   '#0C0F1A',   // solid — transparent breaks native option colours
  border:       '1px solid rgba(255,255,255,0.09)',
  borderRadius: '10px',
  padding:      '9px 13px',
  fontFamily:   'inherit',
  fontSize:     '13px',
  color:        '#F0F4F8',
  outline:      'none',
  transition:   'border-color 0.18s, background 0.18s, box-shadow 0.18s',
}

function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={inputStyle}
      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(168,31,56,0.65)'; e.currentTarget.style.background = 'rgba(168,31,56,0.05)' }}
      onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
    />
  )
}

function StyledSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', paddingRight: '32px' }}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(168,31,56,0.65)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(168,31,56,0.1)' }}
        onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.boxShadow = 'none' }}
      >
        {props.children}
      </select>
      <span
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs"
        style={{ color: '#4A5568' }}
      >
        ▾
      </span>
    </div>
  )
}

export default function IntakeView() {
  const [form, setForm]       = useState<FormState>(EMPTY)
  const [submitted, setSubmit] = useState(false)
  const [lastId, setLastId]   = useState('')

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const valid = form.unitId && form.bloodType && form.component && form.collectedAt && form.facility

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return
    setLastId(form.unitId)
    setSubmit(true)
    setTimeout(() => { setSubmit(false); setForm(EMPTY) }, 3000)
  }

  return (
    <div className="h-full overflow-y-auto scroll-thin p-6">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <ScanLine className="h-4 w-4" style={{ color: '#5BA4D4' }} />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: '#5BA4D4' }}>
              Specimen Intake
            </span>
          </div>
          <h2 className="text-lg font-bold" style={{ color: '#F0F4F8' }}>Log incoming unit</h2>
          <p className="text-xs leading-relaxed mt-1" style={{ color: '#4A5568' }}>
            Register a blood unit received from Scyther collection. All fields marked * are required before the unit enters the screening queue.
          </p>
        </div>

        {/* Success flash */}
        {submitted && (
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6"
            style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.25)' }}
          >
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: '#00FF88' }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: '#00FF88' }}>Unit logged successfully</p>
              <p className="font-mono text-[10px]" style={{ color: '#4A5568' }}>
                {lastId} added to screening queue
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl overflow-hidden"
          style={{ background: '#0C0F1A', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="p-5 space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <Field label="Unit ID" hint="Scan or type" required>
                <StyledInput
                  type="text"
                  placeholder="BC-2026-NNNN"
                  value={form.unitId}
                  onChange={set('unitId')}
                  style={{ ...inputStyle, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(168,31,56,0.65)'; e.currentTarget.style.background = 'rgba(168,31,56,0.05)' }}
                  onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                />
              </Field>
              <Field label="Donor ID" hint="From collection record">
                <StyledInput
                  type="text"
                  placeholder="D-NNNN"
                  value={form.donorId}
                  onChange={set('donorId')}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Blood Type" required>
                <StyledSelect value={form.bloodType} onChange={set('bloodType')}>
                  <option value="" disabled>Select…</option>
                  {BLOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </StyledSelect>
              </Field>
              <Field label="Component Type" required>
                <StyledSelect value={form.component} onChange={set('component')}>
                  <option value="" disabled>Select…</option>
                  {COMPONENTS.map(c => <option key={c} value={c}>{c}</option>)}
                </StyledSelect>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Collection Timestamp" hint="From Scyther record" required>
                <StyledInput
                  type="datetime-local"
                  value={form.collectedAt}
                  onChange={set('collectedAt')}
                />
              </Field>
              <Field label="Volume (mL)" hint="Typical: 450 mL">
                <StyledInput
                  type="number"
                  placeholder="450"
                  min={200}
                  max={600}
                  value={form.volume}
                  onChange={set('volume')}
                />
              </Field>
            </div>

            <Field label="Collection Facility" required>
              <StyledSelect value={form.facility} onChange={set('facility')}>
                <option value="" disabled>Select facility…</option>
                {FACILITIES.map(f => <option key={f} value={f}>{f}</option>)}
              </StyledSelect>
            </Field>

          </div>

          {/* Intake notes section */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 20px 16px' }}>
            <Field label="Intake Notes" hint="Optional">
              <textarea
                rows={2}
                placeholder="Any observations at receipt — packaging condition, temperature deviation, etc."
                style={{
                  ...inputStyle,
                  resize: 'none',
                  lineHeight: '1.55',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(168,31,56,0.65)'; e.currentTarget.style.background = 'rgba(168,31,56,0.05)' }}
                onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              />
            </Field>
          </div>

          {/* Footer */}
          <div
            className="flex items-center gap-3 px-5 py-3.5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#111422' }}
          >
            <button
              type="button"
              onClick={() => setForm(EMPTY)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold transition"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: '#8899A8' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#F0F4F8'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#8899A8'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={!valid}
              className="flex-1 rounded-xl py-2.5 text-xs font-bold text-white transition disabled:opacity-35 disabled:cursor-not-allowed"
              style={{
                background: valid ? '#A81F38' : 'rgba(168,31,56,0.4)',
                boxShadow:  valid ? '0 0 16px rgba(168,31,56,0.3)' : 'none',
              }}
              onMouseEnter={e => { if (valid) e.currentTarget.style.background = '#C4304E' }}
              onMouseLeave={e => { e.currentTarget.style.background = valid ? '#A81F38' : 'rgba(168,31,56,0.4)' }}
            >
              Log Unit → Screening Queue
            </button>
          </div>
        </form>

        {/* Protocol note */}
        <p className="mt-4 text-center font-mono text-[10px]" style={{ color: '#2E3548' }}>
          All intake events are logged to the chain-of-custody ledger · Session: {new Date().toLocaleString('en-GB')}
        </p>
      </div>
    </div>
  )
}
