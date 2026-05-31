# @bloodchain/ui

Bloodchain shared component library. One design system, all constellation apps.

---

## Setup in an app

### 1. Declare the dependency
In the app's `package.json`:
```json
{
  "dependencies": {
    "@bloodchain/ui": "*"
  }
}
```
Then run `yarn install` from the repo root.

### 2. Import the global styles — once, at your app entry
```tsx
// main.tsx or main.jsx
import '@bloodchain/ui/styles'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="bc-app">   {/* ← required wrapper for scoped tokens */}
      <App />
    </div>
  </React.StrictMode>
)
```

### 3. Add the Tailwind preset (optional — only if the app uses Tailwind)
```js
// tailwind.config.js
const bcPreset = require('@bloodchain/ui/tailwind.preset')

module.exports = {
  presets: [bcPreset],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui/src/**/*.{js,jsx,ts,tsx}',  // scan library source
  ],
}
```

---

## Usage

```tsx
import {
  Button,
  Input,
  GlassCard,
  Accordion,
  AccordionItem,
  StatCard,
  Modal,
  Badge,
  BloodUnitBadge,
  AuditEntry,
  DonorCard,
} from '@bloodchain/ui'

// Button
<Button variant="primary" onClick={save}>Confirm Donation</Button>
<Button variant="danger"  onClick={discard}>Discard Unit</Button>
<Button variant="success" loading={submitting}>Approve</Button>

// Input with communicative feedback
<Input
  label="Donor ID"
  annotation="Format: BC-YYYY-NNNNNN"
  state={valid ? 'valid' : error ? 'error' : 'idle'}
  feedback={{
    hint:  'Enter the Bloodchain donor ID from the collection form.',
    valid: '✓ Valid Bloodchain donor ID.',
    error: '✕ Format must be BC-YYYY-NNNNNN.',
  }}
  value={donorId}
  onChange={e => setDonorId(e.target.value)}
/>

// Glass card with accent
<GlassCard accent="burg" interactive onClick={open}>
  <p>Unit BC-2026-0041</p>
</GlassCard>

// Accordion
<Accordion>
  <AccordionItem title="Screening Results">
    HIV: Non-reactive · HBsAg: Non-reactive
  </AccordionItem>
  <AccordionItem title="Cold Chain Log">
    All checkpoints within 2–6°C.
  </AccordionItem>
</Accordion>

// Domain components
<BloodUnitBadge status="QUARANTINED" />
<DonorCard
  donorId="BC-2026-0041"
  name="T. Nakedi"
  bloodType="O+"
  eligibility="eligible"
  lastDonation="2026-03-01"
  haemoglobin={14.2}
/>
<AuditEntry
  event="UNIT_STATUS_CHANGED"
  timestamp="2026-05-29T08:14:32Z"
  summary="Status changed QUARANTINED → CLEARED"
  actor="M. Dube"
  actorRole="ANALYST"
  facility="Gaborone HQ"
  signature="eyJ...a3f9"
/>
```

---

## Token reference

All design tokens are CSS custom properties on `:root`. Override any of them
in an app's own CSS to theme a specific deployment:

```css
/* In an app's globals — e.g. a dark MoH-branded build */
:root {
  --bc-burg-500: #7B1FA2;   /* swap primary to purple */
}
```

---

## Building

```bash
yarn workspace @bloodchain/ui build
```

Output goes to `packages/ui/dist/`. Apps consume from there via workspace resolution — no publish needed for local development.
