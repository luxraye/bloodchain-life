# Prototype outreach memo — modular beachheads (June 2026)

**Audience:** Bloodchain Botswana leadership & anyone running discovery calls, briefings, or investor conversations.

**Purpose:** One place for (1) how the new prototypes are accessed, (2) who each app is for, (3) general outreach motion, (4) beachhead-specific playbooks, and (5) copy-paste **Gemini** prompts to generate pitch decks.

**Related files:** [`STRATEGY-module-teardown.md`](./STRATEGY-module-teardown.md) · [`pilots.md`](./pilots.md) · [`assumptions-log.md`](./assumptions-log.md) · [`emails.md`](./emails.md)

---

## 1. Marketing memo — the story in one breath

Bloodchain is **not** selling a national blood operating system to NBTS right now. MEDITECH is entrenched at headquarters; displacement is a multi-year conversation.

We are selling **three small, plug-and-play modules** to three fast-moving buyers — each with a **hydrated prototype** that speaks to their exact pain:

| Beachhead | Buyer | Module(s) | One-line pitch |
|-----------|-------|-----------|----------------|
| **A** | Blood for Life Botswana (BLB) | Scyther + Azure | Digitise community drives and bring donors back — chip at the **17,000-unit deficit** through retention, not headquarters software. |
| **B** | Gaborone Private Hospital (GPH) | Transfuse | Give the Hospital Transfusion Committee an **evidence base** — haemovigilance, SADCAS-ready incident reports, live review queue (WHO-flagged gap). |
| **C** | Baylor Children's CCE | Chronicle | **No child misses a transfusion** — 50-patient paediatric sickle cell registry with missed-transfusion alerts and BIPAI-ready exports. |

**Public posture:** https://www.bloodchain.life explains the modular platform. **Live simulators are shared privately** in calls — not linked from the main marketing carousel (by design).

**Lead with the number:** Botswana needs ~45,000 units/year and collects ~27,000. **17,000–20,000 units short.** Every beachhead pitch ties back to that gap or to a documented safety/coordination failure (WHO on HTxC, missed paediatric transfusions, paper drives).

**What we are not claiming:** Licensed medical device, NBTS replacement, or national rollout without pilot proof.

---

## 2. How prototypes are accessed (read this first)

### 2.1 The three layers

```
Layer 1 — Bespoke landing (demo-hub)     https://bloodchain.life/demo/<slug>
Layer 2 — Module simulator (private URL)  Scyther / Chronicle / Transfuse / Azure
Layer 3 — Demo data inside the app        Seeds + demo login (works without live API)
```

| Slug | Landing URL | Primary simulator | What was built for the demo |
|------|-------------|-----------------|-----------------------------|
| `blb` | https://bloodchain.life/demo/blb | **Scyther** (+ Azure for retention story) | Community drive seed, Omang verification, dedup, returning-donor history |
| `baylor` | https://bloodchain.life/demo/baylor | **Chronicle** | 50 paediatric sickle cell profiles, missed-transfusion alerts, BIPAI export |
| `gph` | https://bloodchain.life/demo/gph | **Transfuse** | HTC review queue, simulate adverse reaction, SADCAS incident report |

These landing pages are **unlisted** — they do not appear in the public site nav. You send the URL directly in email or WhatsApp.

### 2.2 Why “Open the GPH transfusion demo” opens your mail client

The bespoke landing **CTA button** reads an environment variable. If that variable is **empty in production**, the button falls back to a **mailto** briefing request (same posture as the public carousel — “demos by appointment”).

**Code:** `demo-hub/src/content/bespoke.js` — `launchUrl: env.VITE_DEMO_*_URL || ''`

**Fix (one-time, on demo-hub deploy):**

| Env var | Set to (example — use your real hosts) |
|---------|----------------------------------------|
| `VITE_DEMO_BLB_URL` | `https://scyther.bloodchain.life/collection/check-in` |
| `VITE_DEMO_BAYLOR_URL` | `https://chronicle.bloodchain.life/patients` |
| `VITE_DEMO_GPH_URL` | `https://transfuse.bloodchain.life/requests` |

If you use Render default hostnames instead of custom subdomains:

| Env var | Render example |
|---------|----------------|
| `VITE_DEMO_BLB_URL` | `https://bc-scyther.onrender.com/collection/check-in` |
| `VITE_DEMO_BAYLOR_URL` | `https://bc-chronicle.onrender.com/patients` |
| `VITE_DEMO_GPH_URL` | `https://bc-transfuse.onrender.com/requests` |

After setting vars: **rebuild and redeploy demo-hub** (Vite bakes `VITE_*` at build time).

**Outreach workaround until env is set:** Send **two links** in the email — landing + direct simulator:

> Preview: https://bloodchain.life/demo/gph  
> Live walkthrough: https://transfuse.bloodchain.life/requests (we'll screen-share)

### 2.3 Module URLs (private — share in calls only)

From [`docs/netlify.env.example`](../netlify.env.example) and [`DNS-bloodchain.life.md`](../DNS-bloodchain.life.md):

| Module | Custom subdomain (if configured) | Render pattern |
|--------|-----------------------------------|----------------|
| Demo hub | https://bloodchain.life | bc-demo-hub |
| Scyther | https://scyther.bloodchain.life | bc-scyther |
| Azure | https://azure.bloodchain.life | bc-azure |
| Chronicle | https://chronicle.bloodchain.life | bc-chronicle |
| Transfuse | https://transfuse.bloodchain.life | bc-transfuse |
| API | — | bc-api.onrender.com |

### 2.4 Deep links — where to click in each demo

**BLB — Scyther (field collection)**

| Step | Path | What to show |
|------|------|--------------|
| 1 | `/collection/check-in` | BLB drive banner, Omang lookup (try `485612901`), identity panel, returning donor + prior drives |
| 2 | Proceed → `/collection/screening` | Eligibility workflow |
| 3 | `/collection/phlebotomy` | Omang re-check strip before bleed |

**BLB — Azure (donor portal)** — second tab or follow-up email

| Path | What to show |
|------|--------------|
| `/` (donor home) | Registration, trust tiers, donation history (demo mode) |

**Baylor — Chronicle**

| Path | What to show |
|------|--------------|
| `/patients` | Filter “Missed transfusion”, 50 paediatric profiles, care-gap badges |
| `/exceptions` | Missed-transfusion filter, assign outreach |
| `/reports` | Download **Funder audit · BIPAI** CSV |

**GPH — Transfuse**

| Path | What to show |
|------|--------------|
| `/requests` | **Hospital Transfusion Committee** review queue at top |
| `/haemovigilance` | **Simulate reaction** → submit → **Generate** SADCAS report |
| `/transfusion` | Flag reaction from transfusion history |

### 2.5 Local rehearsal (before a call)

From repo root `bloodchain-constellation-main`:

```bash
yarn dev:demo-hub      # default :5173 — test /demo/blb locally
yarn dev:scyther       # :5173 — check-in demo
yarn dev:chronicle     # :5180
yarn dev:transfuse     # :5178
yarn dev:azure
```

Local bespoke URLs: `http://localhost:5173/demo/blb` (etc.)

**Demo login:** Most modules show a **Demo / guest** entry when Supabase is unset or `VITE_AUTH_BYPASS=true`. Scyther + Chronicle run **offline seeds** when the API is down — ideal for unreliable connectivity on briefing day.

### 2.6 Recommended link bundle per prospect (copy-paste)

**BLB**

```
Landing:  https://bloodchain.life/demo/blb
Scyther:  https://scyther.bloodchain.life/collection/check-in
Azure:    https://azure.bloodchain.life
Try Omang: 485612901 (returning donor) or 655310894 (first-time)
```

**Baylor**

```
Landing:   https://bloodchain.life/demo/baylor
Chronicle: https://chronicle.bloodchain.life/patients
Then:      Exceptions → filter MISSED TRANSFUSION → Reports → BIPAI export
```

**GPH**

```
Landing:    https://bloodchain.life/demo/gph
Transfuse:  https://transfuse.bloodchain.life/requests
Then:       Haemovigilance → Simulate reaction → Generate SADCAS report
```

---

## 3. App-to-audience map (full constellation, beachheads highlighted)

| Module | Primary users | Beachhead? | Pitch when |
|--------|---------------|------------|------------|
| **Scyther** | NGO field staff, mobile drive coordinators | **Yes — BLB** | Community drives on paper; retention wedge |
| **Azure** | Donors, public | **Yes — BLB (bundle)** | Donor portal + return scheduling; never sell alone first |
| **Transfuse** | Hospital clinicians, blood bank, HTxC | **Yes — GPH** | WHO HTxC gap, haemovigilance, accreditation |
| **Chronicle** | Chronic care coordinators | **Yes — Baylor** | Paediatric sickle cell; missed transfusions; funder reports |
| Mars Lab | Lab technologists | Later — Diagnofirm/BDF | Private lab outside MEDITECH |
| Voyager | Logistics coordinators | Bundle with NBTS later | Cold-chain — clarify sensor vs checkpoint first |
| Helix | Research PIs | Bundle — counter REDCap | Blood-specific custody only |
| Sentinel | Regulators | Bundle with national licence | BMRA governance sensitivity |
| High Command | MoH, programme directors | **Never first** | Empty dashboard — unlock after 2 pilots |
| Demo hub | Investors, general buyers | **Public** | Modular story; `/demo/*` for targeted sends |

**Rule:** Programmes have revenue, modules do not. Sell **one institution + one module**, expand from proof.

---

## 4. General outreach playbook

### 4.1 Motion (every beachhead)

1. **Listen first** — use [`assumptions-log.md`](./assumptions-log.md) interview questions; do not pitch national.
2. **Send landing + simulator** — two links; offer 30-minute screen-share.
3. **Walk the prototype** — 15 minutes on their pain screens only; no constellation tour.
4. **Close on pilot scope** — one number, 90 days ([`pilots.md`](./pilots.md)).
5. **Follow up** — PDF brief from `brief-*.md` only after they engage.

### 4.2 Talking points (always safe)

- “We built modular tools so you can start with **one workflow** — one drive, one ward, one clinic — without replacing MEDITECH at NBTS.”
- “Botswana’s blood gap is **17,000+ units a year**. BLB’s wedge is **bringing people back**, not only recruiting new donors.”
- “WHO documented missing **Hospital Transfusion Committees** at many sites. Transfuse is governance and audit trail, not another EMR.”
- “Baylor’s ask is narrow: **50 children, 90 days**, missed-transfusion alerts — not a national registry.”
- “This is demonstration software. Pilots come before any clinical certification claim.”

### 4.3 Talking points (avoid)

- “We will replace MEDITECH / NBTS system.”
- “National command dashboard ready for MoH today.”
- “Full constellation licence” before any paying beachhead.
- Open-sourcing module URLs on the public homepage (keep simulators private).

### 4.4 Objection handling

| Objection | Response |
|-----------|----------|
| “NBTS already has software.” | “Correct — MEDITECH at headquarters. We fill **NGO drives, private hospitals, and specialist clinics** where the gap is paper.” |
| “We need group IT approval.” | “That’s exactly why we scoping **GPH only** first — confirm local stack isn’t group-mandated ([assumptions-log Q3]).” |
| “Is this certified?” | “Pilot-ready demonstration. National/clinical certification follows **your** governance and BMRA path — we don’t skip that.” |
| “Why not Excel?” | “Excel doesn’t dedupe Omang at the drive, alert missed paediatric transfusions, or generate SADCAS incident reports on the spot.” |

### 4.5 Channels & order (90-day plan)

1. **BLB** — warmest, fastest procurement (Molibi Maphanyane).
2. **GPH** — parallel if blood bank lead is reachable.
3. **Baylor** — parallel if clinical coordinator confirms paper records.
4. **Investors / general** — https://bloodchain.life + modular hero; `/demo/*` only when targeting a specific story.

### 4.6 Success metrics (conversation → pilot)

| Stage | Signal |
|-------|--------|
| Discovery | They describe pain in their own words matching our assumption |
| Demo | They ask “could this work on our next drive / ward / clinic?” |
| Pilot | Named coordinator, date, success metric agreed |
| Kill | Assumption false — log in assumptions-log and pivot |

---

## 5. Beachhead playbooks (detailed)

### 5.1 BLB — Scyther + Azure

**Decision-maker:** BLB coordinator (Molibi Maphanyane).  
**Economic buyer:** BLB board / CSR sponsors for per-drive fees.  
**Pain:** Paper drives, no retention, duplicate donors, 17k deficit.  
**Discovery gate:** Q1 in assumptions-log — drives **without** MEDITECH mobile.

**15-minute demo script**

1. Open `/demo/blb` — read headline + three pain cards (30 sec).
2. Scyther check-in — Omang `485612901` — show **returning donor**, prior BLB drives, Azure linked.
3. Omang `512006933` — show **deferral** (donated too recently).
4. Optional: Azure — donor journey / scheduling for “come back in 8 weeks.”

**Pilot ask:** One drive + one retention cycle · 90 days · metric: % donors on Azure + re-contacted ([`pilots.md`](./pilots.md) Pilot A).  
**Pricing anchor:** P1,500–3,000/month or per-drive CSR fee.  
**Collateral:** [`brief-BLB-Scyther-Azure.md`](./brief-BLB-Scyther-Azure.md) · email template in [`emails.md`](./emails.md).

---

### 5.2 GPH — Transfuse

**Decision-maker:** Blood bank lead / transfusion nurse specialist.  
**Economic buyer:** Hospital quality / risk manager (SADCAS angle).  
**Pain:** No HTxC records, ad hoc reaction logging, WHO assessment gap.  
**Discovery gate:** Q3 — local IT stack not group-blocked.

**15-minute demo script**

1. Open `/demo/gph` — WHO / SADCAS framing (30 sec).
2. **Request management** — scroll HTC queue; click **Mark reviewed** on one item.
3. **Haemovigilance** — **Simulate reaction** → submit → **Generate** SADCAS HTML report (open/download).
4. **Transfusion log** — show cross-match flow; **Flag reaction** on a row.

**Pilot ask:** One ward/unit · 90 days · metric: adverse events in Transfuse vs paper baseline (Pilot B).  
**Pricing anchor:** P3,000–8,000/month.  
**Note:** Do not bundle Chronicle for Baylor in the same sentence — keep GPH story **clinical governance only**.

---

### 5.3 Baylor — Chronicle

**Decision-maker:** Paediatric sickle cell clinical coordinator.  
**Economic buyer:** Programme director / PEPFAR-BIPAI funder line (implementation budget).  
**Pain:** Missed scheduled transfusions, paper diaries, manual funder reports.  
**Discovery gate:** Q2 — records **not** already in adequate EMR.

**15-minute demo script**

1. Open `/demo/baylor` — “50 patients, 90 days” (30 sec).
2. **Patient registry** — tap **Missed Transfusion Alerts** card; filter list; open one patient.
3. **Exception queue** — filter **MISSED TRANSFUSION**; assign to coordinator.
4. **Reports** — download **Funder audit · BIPAI** CSV — “this is what your PEPFAR reporting meeting looks like.”

**Pilot ask:** ~50 paediatric sickle cell patients · 90 days · metric: care-gap alerts + fewer missed transfusions (Pilot C).  
**Pricing anchor:** Implementation + licence (funder-backed).  
**Collateral:** [`brief-Baylor-Chronicle-Transfuse.md`](./brief-Baylor-Chronicle-Transfuse.md) — pitch **Chronicle only** unless they ask about hospital transfusion.

---

### 5.4 General investors & independent buyers

**Use:** https://bloodchain.life (modular hero, not national command).  
**Story:** Three beachheads proving modular adoption; national conversation **after** pilot data.  
**Do not:** Live-link all nine modules — overwhelms and revives “national OS” framing.  
**Optional:** Send `/demo/blb` as example of “target-specific landing pages” for enterprise sales motion.

---

## 6. Gemini pitch deck guides

Use **Google Gemini** (Gemini Advanced or Workspace) with **Canvas / presentation** or export to Google Slides. Paste the prompt below; attach screenshots from the prototype if Gemini accepts images.

**Brand constants (include in every prompt):**

- Primary: `#A81F38` (burgundy)
- Background: `#07090F` (dark navy) or white for print
- Accent: `#00FF88` (neon green) for “live / positive”
- Font: clean sans (Inter, DM Sans, or Arial)
- Logo: `demo-hub/public/branding/logo.png`
- Footer: “Bloodchain Botswana · Demonstration software · Not a medical device”

**Slide count:** 10–12 slides · 16:9 · minimal text · one idea per slide.

---

### 6.1 Master prompt — any audience

Copy everything between the lines into Gemini:

---

You are a presentation designer for **Bloodchain Botswana**, a health-tech company incubated at Unipod, University of Botswana.

Create a **12-slide pitch deck** (16:9) for: **[AUDIENCE: BLB / GPH / Baylor / Investor]**

**Design rules**
- Colours: primary `#A81F38`, dark background `#07090F`, text `#F0F4F8`, accent `#00FF88` for positive metrics
- Style: clinical, modern, minimal; no stock photos of generic hospitals; use simple icons and diagrams
- Every slide: max 6 bullet lines OR one big stat
- Footer on each slide: “Bloodchain Botswana · Demo software · Not a medical device”

**Narrative arc (must follow this order)**
1. Title — organisation name + one-line modular value prop
2. The gap — Botswana needs ~45,000 blood units/year, collects ~27,000 → **17,000–20,000 deficit**
3. Why modular — institutions adopt one module; no rip-and-replace of MEDITECH at NBTS
4. The problem (audience-specific — see below)
5. The solution — module name(s) + 3 capability bullets
6. Product proof — describe UI screens we will screenshot (list screens)
7. Pilot proposal — 90 days, one metric, what we need from them
8. Pricing band (if commercial audience) or “funder-backed implementation” (if NGO/clinic)
9. Traction / maturity — honest: prototypes live, pilots seeking first signature
10. Team & ask — one clear CTA (30-minute call + one pilot)

**Audience-specific problem (slide 4)**
[PASTE ONE OF THE BLOCKS FROM SECTION 6.2–6.5 BELOW]

**Product proof screens (slide 6)**
[PASTE SCREEN LIST FROM BEACHHEAD PLAYBOOK SECTION 5]

**Output format**
For each slide provide: (a) slide title, (b) on-slide text verbatim, (c) speaker notes (2–3 sentences), (d) visual suggestion (diagram/table/screenshot placeholder).

Do not claim FDA/CE marking, NBTS replacement, or national deployment without pilots.

---

### 6.2 Gemini block — BLB deck (paste into master prompt)

**Audience-specific problem (slide 4):**

- Blood for Life Botswana runs community drives largely on **paper and spreadsheets**
- First-time donors rarely return → retention failure drives the national **17,000-unit deficit**
- No shared donor identity across drives → duplicate registration and wasted units
- MEDITECH serves NBTS headquarters; **community NGOs are underserved**

**Product proof screens (slide 6):**

1. Scyther — BLB community drive banner at check-in
2. Omang verification panel — “returning donor”, prior drives, no duplicate
3. Deferral example — donor inside 56-day window blocked
4. Azure — donor portal / return scheduling (optional slide 6b)

**Pricing (slide 8):** P1,500–3,000/month NGO licence OR P500–1,500 per corporate CSR drive

**CTA (slide 10):** One upcoming BLB drive as a 90-day pilot; metric: % donors registered + re-contacted

---

### 6.3 Gemini block — GPH / Transfuse deck

**Audience-specific problem (slide 4):**

- WHO assessment: many Botswana hospitals lack active **Hospital Transfusion Committees**
- Adverse transfusion reactions recorded inconsistently — accreditation risk
- SADCAS audits require traceable incident documentation
- Private hospitals need **governance tools**, not another full EMR

**Product proof screens (slide 6):**

1. Transfuse — Hospital Transfusion Committee review queue (pending items)
2. Haemovigilance — “Simulate reaction” workflow
3. Auto-generated **SADCAS-aligned incident report** (HTML/PDF)
4. Transfusion log — cross-match + flag reaction

**Pricing (slide 8):** P3,000–8,000/month hospital SaaS

**CTA (slide 10):** 90-day pilot on one ward; metric: adverse events captured in system vs paper baseline

---

### 6.4 Gemini block — Baylor / Chronicle deck

**Audience-specific problem (slide 4):**

- Paediatric sickle cell patients depend on **scheduled transfusions**
- Schedules live in paper diaries → missed transfusions discovered late
- Funders (BIPAI/PEPFAR) require adherence data — manual assembly takes days
- This is **not** a national registry — one clinic, ~50 children, 90 days

**Product proof screens (slide 6):**

1. Chronicle patient registry — missed transfusion alert count
2. Patient row — overdue next transfusion date highlighted
3. Exception queue filtered to MISSED TRANSFUSION
4. Reports — **Funder audit BIPAI** CSV export

**Pricing (slide 8):** Implementation + licence (funder-backed; scope after ethics review)

**CTA (slide 10):** Scoping call + 50-patient pilot; metric: care-gap alerts + reduction in missed transfusions

---

### 6.5 Gemini block — Investor / modular platform deck

**Audience-specific problem (slide 4):**

- National blood software sales fail when buyers are locked into incumbents (MEDITECH at NBTS)
- Revenue lives at **institution level** — NGOs, private hospitals, specialist centres
- Three parallel beachheads de-risk the platform story

**Product proof screens (slide 6):**

1. bloodchain.life — modular hero (“start with one module”)
2. `/demo/blb`, `/demo/baylor`, `/demo/gph` — targeted landing concept (3-up layout)
3. One screenshot each from Scyther, Chronicle, Transfuse (placeholder descriptions)

**Pricing (slide 8):** Beachhead SaaS P1.5k–8k/month; national licence only after pilot proof

**CTA (slide 10):** Milestone-gated capital (~P150k) for entity + first paid pilot; intro to BLB/Baylor/GPH networks

---

### 6.6 After Gemini generates — human checklist

- [ ] Replace placeholder screenshots with real captures from §2.4 deep links
- [ ] Remove any slide Gemini added about “replacing national systems”
- [ ] Verify **17,000** deficit stat on slide 2
- [ ] Add contact: Gift Jr Nakedi · giftjrnakedi@gmail.com · (267) 721 610 38 · https://www.bloodchain.life
- [ ] Export PDF for email attachment **after** first reply (not cold outreach)
- [ ] For GPH/Baylor: send brief PDF from `brief-*.md` as appendix, not the deck alone

---

## 7. Engineering checklist (so demos stop opening mailto)

| Task | Owner | Done? |
|------|-------|-------|
| Set `VITE_DEMO_BLB_URL`, `VITE_DEMO_BAYLOR_URL`, `VITE_DEMO_GPH_URL` on demo-hub production env | Eng | ☐ |
| Redeploy demo-hub | Eng | ☐ |
| Confirm Scyther/Chronicle/Transfuse URLs resolve on mobile data | Eng | ☐ |
| Create demo login or auth bypass for briefing accounts | Eng | ☐ |
| Capture 3–5 screenshots per beachhead for decks | Outreach | ☐ |
| Test full walkthrough on tablet (BLB drive scenario) | Outreach | ☐ |

---

## 8. Quick reference — one page

**Send in cold email:** https://www.bloodchain.life only  
**Send after interest:** landing `/demo/<slug>` + direct module deep link (§2.6)  
**Lead stat:** 17,000–20,000 unit annual deficit  
**Never lead with:** High Command, Sentinel, national licence, MEDITECH displacement  
**First beachhead:** BLB (Scyther + Azure)  
**Gemini:** Master prompt §6.1 + audience block §6.2–6.5  

---

*Bloodchain Botswana · Prototype outreach memo · June 2026 · complements [`Bloodchain-DNA.md`](./Bloodchain-DNA.md)*
