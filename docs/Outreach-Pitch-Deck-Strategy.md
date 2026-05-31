# Bloodchain outreach → pitch deck strategy

This document turns existing outreach material (demo hub copy, institutional briefs per module) into **presenter-ready slide decks** in PowerPoint, Google Slides, or Canva — not code.

---

## What exists today (source material)

| Asset | Use in decks |
|-------|----------------|
| `demo-hub/src/content/site.js` | Hero, problem, audience |
| `demo-hub/src/content/apps.js` | Module grid, one-liners |
| `*/docs/*-Institutional-Brief.md` | Deep slides per module (7 briefs) |
| Live demo URLs (`?guest=1`) | Screenshot / live demo slides |

There is no separate “outreach doc” folder yet — **the briefs + demo hub are the canonical narrative**.

---

## Tagline direction (replace “operating system for blood”)

**Problem with current line:** accurate but generic; sounds like infrastructure marketing, not outcome or trust.

**Primary tagline (hero — in use on demo hub):**

> **The national blood chain, digitized.**

**Subtitle (under hero):**

> Nine connected apps for donation, lab, logistics, transfusion, chronic care, research, and oversight — one custody chain from donor to patient.

**Alternates to A/B test:**

| Tagline | Tone |
|---------|------|
| Blood moves. Trust follows. | Punchy, emotional |
| One chain. Every handoff. | Systems + mission |
| The national blood chain, digitised. | Policy / programme |
| From donor to patient — one truth. | Clinical clarity |
| Where supply meets certainty. | Operations |
| Connect the chain. Protect the chain. | National programme |

Pick **one primary** (≤6 words) and **one explanatory subtitle** (≤25 words). Do not stack two metaphors (avoid “OS” + “chain” + “constellation” in the same breath).

---

## Can the agent build slides directly?

**Not as native `.pptx` / Google Slides files** in this environment. What works well:

1. **Slide-by-slide copy** (title, 3 bullets max, speaker notes) — paste into any tool  
2. **Visual brief per slide** (layout, icon, screenshot callout)  
3. **Screenshot capture** from demo hub + `?guest=1` modules  
4. **Markdown → Gamma / Beautiful.ai / Canva** (import or paste outline)

**Avoid:** building the deck as React/HTML unless the audience is technical; stakeholders expect PowerPoint or PDF.

---

## Master deck architecture (12–14 slides)

Use this spine for **every** audience; swap slides 8–11 by persona.

| # | Slide title | Content |
|---|-------------|---------|
| 1 | Title | Logo, tagline, “Bloodchain Botswana · Platform preview”, Unipod credit |
| 2 | The quiet failure | Units expire untracked; results by phone; paper custody — 3 icons, no blame |
| 3 | What Bloodchain is | Software for every handoff; we do not handle physical blood |
| 4 | The constellation | 3×3 grid or 4 pillars: Operations · Clinical · Population · Governance |
| 5 | One custody chain | Diagram: Donor (Azure) → Collect (Scyther) → Lab (Mars) → Move (Voyager) → Hospital (Transfuse) → Regulator (Sentinel) |
| 6 | Live today | All 9 modules demo-ready; green “live” status; link to demo hub |
| 7 | Proof | 2–3 screenshots (High Command KPIs, Voyager map, Azure donor home) |
| 8 | *Audience hook* | See variants below |
| 9 | Deployment | Standalone per hospital OR national programme; Supabase auth |
| 10 | Governance | Sentinel + Instances; audit ledger; data protection framing |
| 11 | Roadmap / ask | Pilot site, MoU, funding, or integration — **one clear CTA** |
| 12 | Contact | Gift Jr Nakedi, email, demo hub URL |

**Design system for all decks**

- Background: `#07090F` or white (pick one deck theme and stick to it)  
- Primary: burgundy `#A81F38`  
- Accent: azure `#3A82B8` / cyan `#00C8FF` (Azure module only)  
- Max 6 words per slide title; max 3 bullets; no paragraph blocks  

---

## Audience variants (swap slide 8)

### A — Ministry of Health / national programme

**Slide 8 title:** National command without another silo  

- High Command: KPIs, constellation health, Keymaster, ledger, KYC, ministry reports  
- Voyager + national map: cold chain, dispatch  
- Sentinel: structured returns, provenance  

**CTA:** 90-day pilot at 2 regions + national read-only dashboard  

**Source:** `high-command/docs/HighCommand-Institutional-Brief.md`, `sentinel/docs/Sentinel-Institutional-Brief.md`

### B — Hospital / transfusion committee

**Slide 8 title:** Hospital transfusion, digitised  

- Transfuse: requests, committee, crossmatch, haemovigilance  
- Chronicle: chronic cohorts (if referral hospitals)  
- Custody visibility from lab release to bedside  

**CTA:** Transfuse + Azure donor appeals pilot at one referral hospital  

**Source:** `transfuse/docs/Transfuse-Institutional-Brief.md`

### C — Blood service / lab leadership

**Slide 8 title:** From bench to release, verified  

- Mars Lab: screening, grouping, QC, export  
- Scyther: collection + labelling  
- Voyager: release → transit  

**CTA:** Mars Lab + Scyther at one collection centre  

**Source:** `mars-lab` README, `scyther` demo copy, `voyager` brief

### D — Donor public / NGO / media

**Slide 8 title:** Donors stay in the loop  

- Azure PWA: journey, eligibility, trust tiers, appeals  
- QR / installable; no clinical jargon  

**CTA:** Public launch + drive-day Azure kiosks  

**Source:** `azure/docs/Azure-Institutional-Brief.md`

### E — Regulator / compliance (BMRA)

**Slide 8 title:** Submissions you can verify  

- Sentinel over Instances: receipts, hashes, review queue  
- No email attachments as system of record  

**CTA:** Instances extract + Sentinel demo with sample return  

**Source:** `sentinel/docs/Sentinel-Institutional-Brief.md`

---

## Module appendix decks (optional 5-slide mini-decks)

For deep meetings, export **one mini-deck per module** from institutional briefs:

1. Problem (1 slide)  
2. Users & roles (1 slide)  
3. Key screens (2 slides — screenshots)  
4. Constellation boundary — what this module does *not* do (1 slide)  
5. Demo link + CTA (1 slide)  

Repeat for: High Command, Mars Lab, Voyager, Azure, Transfuse, Chronicle, Sentinel (Helix/Scyther if needed).

---

## Tool workflows (fastest path to real slides)

### Option 1 — Gamma.app (recommended for speed)

1. Paste **Master deck architecture** (sections above) into Gamma  
2. Brand kit: burgundy, dark navy, logo from `demo-hub/public/branding` or `chronicle/public/branding/logo.svg`  
3. Prompt: “Institutional healthcare deck, minimal text, one idea per slide, Botswana national blood programme”  
4. Export PDF + PPTX  
5. Replace generic imagery with **your screenshots** (slides 6–7)

### Option 2 — Google Slides + Gemini

1. Create blank deck from **slide table** (copy each row as a slide title + bullets)  
2. Use Gemini in Slides for layout suggestions only; **edit every bullet** against briefs  
3. Insert → Image → screenshots from localhost demos  
4. Share link for MoH reviewers  

### Option 3 — Canva (brand-polished)

1. Search template: “health tech pitch deck dark”  
2. Lock fonts: one sans (e.g. Inter or DM Sans), one mono for labels  
3. Build 12 frames manually from outline — best visual control  
4. Export PDF for email, PPTX for edits  

### Option 4 — Beautiful.ai (structure-first)

1. Import outline as bullet list  
2. Auto-layout; then tighten copy to 3 bullets max  
3. Good for appendix module decks  

### Option 5 — Agent-assisted loop (this repo)

1. Ask the agent: “Generate slide 1–12 copy for audience A” → paste into tool  
2. Capture screenshots: demo hub + High Command + Voyager + Azure with `?guest=1`  
3. Agent drafts speaker notes per slide (30-second talk track)  

---

## Screenshot shot list (for slide 7)

| Screen | URL | Caption |
|--------|-----|---------|
| Demo hub constellation | `localhost:517x` demo-hub | Nine modules, one platform |
| High Command | `:5173?guest=1` | National KPIs + constellation |
| Voyager command | `:5175?guest=1` | Dispatch + cold-chain map |
| Azure home | `:5177` demo donor | Public donor journey |
| Sentinel queue | `:5181?guest=1` | Compliance review (if shown to regulators) |

Use consistent browser width (1440×900) and hide dev toolbars.

---

## Speaker notes template (per slide)

```
HOOK (10s):  [Why this slide matters to THIS room]
SHOW (20s):  [What to point at on screen]
PROOF (15s): [One Botswana-specific example or demo action]
BRIDGE (5s): [“Next slide…”]
```

Total deck: **~8–10 minutes** main path; appendix modules **+3 min each**.

---

## Next actions (recommended order)

1. **Choose tagline + subtitle** → update `demo-hub/src/content/site.js` and footer  
2. **Pick primary audience** for first deck (usually MoH or national programme → variant A)  
3. **Run Gamma** with master outline; export PPTX  
4. **Capture 4 screenshots**; replace stock art  
5. **Rehearse 10-minute path** with live demo hub as backup  
6. Clone master deck → variants B–E by swapping slide 8 + CTA only  

---

## What to ask the agent next

- “Write full slide copy for audience A, slides 1–12, with speaker notes.”  
- “Turn Voyager institutional brief into a 5-slide appendix.”  
- “Draft a one-page leave-behind PDF outline from the MoH deck.”  
- “Apply tagline X to demo hub” (after you pick from the table above).
