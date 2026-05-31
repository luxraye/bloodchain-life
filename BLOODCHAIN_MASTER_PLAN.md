# Bloodchain — Master Transformation Plan
### From Pre-Pilot to Revenue-Generating Startup

**Owner:** Lead Dev / Secretary  
**Created:** 2026-05-08  
**Status:** Active

---

## 1. Situation Assessment

### What we have
Bloodchain is a national blood supply chain platform built for Botswana. It is technically ambitious — seven coordinated apps, a shared API, Supabase auth, a Postgres-backed audit ledger, and a Hyperledger Fabric integration already planned. The engineering is largely done. Lint passes across all six frontend apps. Builds are clean. Auth has been migrated from Keycloak to Supabase. The MEDITECH-parity clinical UI rewrite is in progress.

What is missing is not code — it is *closure*. The pilot checklist has never been ticked off. The system has never been deployed end-to-end. There are no smoke tests, no staging environment, no paying customer, and no commercial structure around an otherwise serious piece of infrastructure software.

### What "revenue-generating startup" means here
Bloodchain's natural customers are governments and health institutions. The primary target is Botswana's National Blood Transfusion Service (NBTS) or the Ministry of Health (MoH), with a secondary market being private hospitals, regional blood banks, and eventually other African nations' health ministries. The revenue model is a government/institutional SaaS contract, not consumer subscriptions.

This means the transformation has two parallel tracks that must move together:
- **Technical Track** — close the gap between "mostly built" and "production-deployed, test-covered, supportable system"
- **Commercial Track** — establish a legal entity, a pricing structure, a demo environment, and relationships with the first buyer

---

## 2. The Three Tracks

### Track A — Technical: Ship the Product
Get Bloodchain running in a stable, deployed, demonstrable state. This is the prerequisite for everything commercial.

### Track B — Commercial: Build the Business
Establish the entity, the pricing model, the pitch materials, and the first customer relationship. This runs in parallel with Track A from Week 1.

### Track C — Operational: Run the Company
Put in place the lightweight management infrastructure needed to execute without chaos — task tracking, decision logs, release cadence, customer communication, and recurring reviews.

---

## 3. Phase Breakdown

---

### PHASE 0 — Foundation (Weeks 1–3)
*Goal: Everything deployed, green, and demonstrable.*

This phase is purely execution against the existing pilot checklist. No new features.

**Technical work:**

1. Deploy to Render using the existing `render.yaml` blueprint
   - Set all required env vars (DATABASE_URL from Render Postgres, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, per-app VITE_ vars)
   - Verify `GET /health` returns 200 on `bc-api`
   - Verify all six frontend apps load and authenticate

2. Run `prisma migrate deploy` against staging database — confirm clean

3. RBAC smoke pass: manually exercise every role (`ADMIN`, `SUPER_ADMIN`, `LAB`, `MEDICAL`, `TRANSIT`, `LOGISTICS_COMMAND`, `MOH_AUDITOR`, `PUBLIC`) against protected routes

4. End-to-end smoke run: donor profile → blood collection (Scyther) → lab processing (Mars Lab) → logistics handoff (Voyager) → admin audit (High Command)

5. Secrets audit: `git grep` for any hardcoded credentials; rotate anything that was ever committed

6. Fix the three known open gaps from `currentstatus.md`:
   - Structured logging standardization in bloodchain-core controllers
   - API smoke tests in CI (`pilot-gates.yml`)
   - Clean `voyager/dist` from tracked workspace

**Deliverable:** A live staging URL that works end-to-end. This becomes the demo environment.

---

### PHASE 1 — Product Completion (Weeks 3–7)
*Goal: MEDITECH parity done. Product is complete enough to show to buyers.*

**Technical work:**

1. Complete MEDITECH Parity (per HANDOVER.md backlog):
   - Mission 3: Scyther ISBT-128 formatting + Camera Scan button in Phlebotomy page
   - Mission 4: Design synchronization across High Command, Scyther, Voyager — shared clinical status badge system (Red/Amber/Green)

2. Complete donor-side endpoint wiring in Azure:
   - Profile + donation history reading from backend
   - Verification document flow wired to Supabase storage
   - Placeholder donor features explicitly blocked with "coming soon" UI — no silent mock returns

3. Backend hardening:
   - Add `parentAssetId` + `componentType` to BloodAsset schema for component splitting
   - Real supervisor PIN verification endpoint for biohazard discard (currently accepts any 4+ digit PIN — this is a clinical safety gap)
   - Normalize API error envelope across all controllers

4. Operational runbook:
   - Incident triage procedure
   - Migration rollback procedure (Fabric rollback doc already exists — adapt for general ops)
   - Auth/session troubleshooting guide
   - Runbook lives at `bloodchain-core/RUNBOOK.md`

**Commercial work (running in parallel from Week 1):**

1. Register legal entity — the exact structure depends on jurisdiction (Botswana PTY LTD is the likely vehicle; a holding company for future expansion is worth considering)

2. Draft a one-page commercial overview: what Bloodchain does, who it is for, what it costs, and what the implementation looks like. This is not a pitch deck yet — it is the internal clarity document that a pitch deck will be built from.

3. Identify the decision-maker at Botswana NBTS and Ministry of Health. This is a research task: who currently manages the national blood supply system, what system (if any) they currently use, and what the procurement process looks like for government software.

4. Build a pricing model:
   - Option A (recommended for first contract): Fixed annual SaaS fee per institution, tiered by volume of blood units processed. Suggested starting tier: $15,000–$25,000 USD/year for a national-scale deployment covering all modules.
   - Option B: Per-module licensing (High Command + Core as base, each operational app as an add-on). More complex to sell but allows phased adoption.
   - Option C: Per-blood-unit transaction fee. Conceptually elegant but operationally hard to enforce and politically sensitive in a public health context.
   - **Recommendation:** Lead with Option A for the Botswana contract. Introduce module add-ons for hospital-level buyers at a later stage.

**Deliverable:** A complete, demo-ready product and a commercial one-pager.

---

### PHASE 2 — First Revenue (Months 2–4)
*Goal: Signed first contract or paid pilot agreement.*

**Commercial work:**

1. Pitch the Botswana MoH / NBTS. The pitch sequence:
   - Discovery call: understand their current process, pain points, procurement constraints
   - Demo: use the live staging environment built in Phase 0
   - Proposal: scoped implementation, training, and support package with a clear price
   - Pilot agreement: 3–6 month paid pilot at a reduced rate (e.g. $5,000–$8,000) with a conversion clause to full contract

2. Identify 2–3 secondary targets in parallel: private hospitals (Princess Marina, Gaborone Private), regional blood banks, or a second-country government (Zimbabwe NBSZ, Zambia ZNBTS are natural candidates given similar healthcare systems)

3. Build a proper pitch deck (10–12 slides):
   - Problem: blood supply chain opacity and wastage in sub-Saharan Africa
   - Solution: Bloodchain constellation — end-to-end digital blood chain
   - Product: walk through each app with screenshots
   - Technology: Supabase, Postgres, future Hyperledger Fabric public ledger (this is a differentiator — immutable audit trail is a compliance story)
   - Team
   - Traction: any letters of intent, meetings, or advisory relationships
   - Ask: contract terms / pilot agreement

4. Draft standard contracts: SaaS service agreement, data processing agreement (required for patient-adjacent data), SLA

**Technical work:**

1. Hyperledger Fabric integration — begin implementation of the Fabric adapter in bloodchain-core. The rollback plan (`fabricrollback.md`) is already written; the feature flag infrastructure is already designed (`LEDGER_BACKEND`, `FABRIC_WRITE_ENABLED`, etc.). This is a *commercial differentiator* — the public, tamper-evident blood transaction ledger is a story no competitor can easily match.
   - Phase 2A: Fabric network setup and channel config (dev environment)
   - Phase 2B: API adapter behind feature flags (`LEDGER_BACKEND=fabric|postgres`)
   - Phase 2C: Public ledger UI in Azure donor portal — donors can see their contribution on-chain

2. Multi-tenancy architecture design: the system currently assumes a single organization. To sell to multiple institutions or countries, a tenant isolation layer is needed. Design the approach (row-level security in Postgres via Supabase RLS, or schema-per-tenant). Implementation happens in Phase 3.

3. Demo Hub: update it from dev launcher to a proper product landing page / login portal for the Bloodchain constellation. This becomes the front door for any buyer.

**Deliverable:** Signed contract or paid pilot agreement with at least one institution.

---

### PHASE 3 — Growth (Months 4–12)
*Goal: Multiple paying customers, recurring revenue, team.*

**Technical:**

1. Multi-tenancy implementation (designed in Phase 2)
2. Fabric integration live and verifiable in production
3. Analytics and reporting module — blood wastage reports, donation trend analysis, inventory forecasting. This is a premium feature for MoH-level buyers who need to report to parliament or donors.
4. Mobile-first PWA hardening: the Camera Scan placeholder in Mars Lab and Scyther points toward barcode-scanning on mobile devices. Completing this makes the system usable without specialized hardware.
5. API marketplace: allow hospitals to query the API directly for cross-institutional inventory visibility. Charged per API call or as an integration tier.

**Commercial:**

1. Expand to second country — target Rwanda (strong digital health infrastructure, English-speaking, RIDA is the national blood service), Zimbabwe (NBSZ), or South Africa (private hospital chains)
2. Apply for health-tech grant funding: GIZ Digital Transformation, USAID Digital Health Activity, Wellcome Trust, African Development Bank health fund
3. Build advisory board: one clinical expert (haematologist or transfusion specialist), one health ministry insider, one tech investor or accelerator contact
4. Consider accelerator programs: Y Combinator (has funded African health-tech), Antler (has East/Southern Africa presence), MEST Africa

**Deliverable:** $100K+ ARR, 2+ paying institutions, grant pipeline established.

---

## 4. How I Am Managing This

### As Secretary

Every week I will maintain:

1. **This file (`BLOODCHAIN_MASTER_PLAN.md`)** — updated with current phase, completed items, and any changes to direction
2. **`SPRINT_LOG.md`** — a running log of what was worked on, decisions made, and blockers encountered in each working session
3. **`DECISIONS.md`** — a permanent record of major decisions (architectural, commercial, strategic) with rationale. This prevents re-litigating settled questions.
4. **`OPEN_ISSUES.md`** — a prioritized list of known bugs, gaps, and incomplete features. This replaces the scattered to-do lists currently spread across HANDOVER.md, currentstatus.md, and the pilot checklist.

I will triage everything into one of four states: `NOW` (this sprint), `NEXT` (next sprint), `LATER` (backlog), `DROPPED` (explicitly not doing).

### As Lead Dev

Technical decisions I am making now:

1. **Deployment target stays Render** — the `render.yaml` is complete and the plan is sound. No need to re-architect for Kubernetes or a different cloud until revenue justifies it.
2. **Supabase auth stays** — Keycloak was the right call at the time, Supabase is the right call now. No further auth changes until multi-tenancy requires re-evaluation.
3. **TypeScript migration** — Scyther and Voyager are still in JavaScript. As features are added, files touched will be converted to TypeScript. No big-bang migration.
4. **Fabric integration is not a blocker for first revenue** — it is a roadmap item and a differentiator. The Postgres ledger is sufficient for a pilot contract. Do not let Fabric scope-creep the pilot launch.
5. **Testing strategy** — integration tests against a real test database before unit tests. The system's value is in the end-to-end flow; unit tests alone are insufficient evidence of correctness for a clinical system.

---

## 5. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Government procurement cycle is slow (6–18 months) | High | High | Pursue private hospital as first paying customer in parallel; apply for grant funding to bridge |
| Single-developer bottleneck | High | High | Document everything (hence this file and DECISIONS.md); keep architecture simple; use AI pair-programming tools aggressively |
| Secrets in git history | Medium | Critical | Run `git secrets` scan; rotate any exposed credentials; clean history if needed |
| Competitor (existing LIMS or blood bank software) already in use | Medium | High | Differentiate on: Botswana-specific, constellation approach, Fabric public ledger, donor-facing portal |
| Fabric integration complexity delays product | Medium | Medium | Feature-flagged; Postgres path is always the fallback per rollback plan |
| Data privacy / patient data compliance | Medium | High | Draft DPA early; ensure Supabase storage for sensitive docs is properly access-controlled |
| Scope creep before first revenue | High | Medium | Enforce Phase 0 and 1 as feature-freeze; all new feature requests go to backlog |

---

## 6. Immediate Next Actions (This Week)

1. **Deploy Phase 0** — run the Render blueprint, set env vars, verify health endpoint
2. **Create `OPEN_ISSUES.md`** — consolidate all to-do items from HANDOVER.md, currentstatus.md, and pilot checklist into one prioritized list
3. **Scyther ISBT-128** — finish Mission 3 from HANDOVER.md (the Phlebotomy page ISBT-128 formatting and Camera Scan button)
4. **Research** — identify the correct contact at Botswana NBTS / MoH for an initial conversation
5. **One-pager draft** — write the internal commercial clarity document

---

## 7. Definition of Done (Revenue-Generating Startup)

Bloodchain is a revenue-generating startup when:

- At least one institution is paying a recurring fee for access to the deployed system
- The system is running in production with uptime SLA and an on-call escalation path
- There is a signed contract with clear terms (data ownership, SLA, support scope)
- The business has a legal structure capable of receiving payment and issuing invoices
- There is a documented path to the second customer

Everything in this plan is oriented toward reaching that definition as quickly as possible without cutting corners on clinical safety or data integrity — because in blood supply chain software, those are the only things that matter to buyers.

---

*This document is maintained by the Lead Dev / Secretary and updated at the start of each working session.*
