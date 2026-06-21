# Bloodchain DNA

**Internal leadership brief — Bloodchain Botswana**

| Field | Detail |
|-------|--------|
| Document title | Bloodchain DNA |
| Organisation | Bloodchain Botswana |
| Incubation | Unipod, University of Botswana |
| Classification | Internal — leadership distribution |
| Version | 1.1 |
| Date | June 2026 |
| Primary contact | Gift Jr Nakedi — giftjrnakedi@gmail.com — (267) 721 610 38 |
| Public site | https://www.bloodchain.life |

---

## How to use this document

Bloodchain DNA is the single internal reference for **what Bloodchain is**, **how it is built**, **how we take it to market**, and **what leadership decisions unlock next**. It is written for leadership, board members, and senior partners—not for engineers. When converting to PDF, keep section headings for navigation.

---

## 1. Executive summary

Bloodchain is a **national blood programme software suite** developed in Botswana: nine coordinated applications plus one shared API and database, covering donation, laboratory processing, logistics, hospital transfusion, chronic blood disorders, research, regulatory reporting, and national oversight.

**What we are:** A digital custody and operations layer for the national blood chain—from donor registration through collection, testing, release, transport, transfusion, and audit.

**What we are not:** A blood bank operator, a courier company, or a replacement for clinical judgment. Physical blood and medical decisions remain with licensed institutions.

**Current maturity:** Engineering is substantially complete across the constellation. The gating items are **commercial**—anchor customer, legal entity, customer discovery, clinical sign-off—not core product invention.

**Honest position:** We built a national platform before validating customers. The product is real and demonstrable; the go-to-market was skipped. The rebuild is commercial, not technical: three small paying beachheads first, national conversation third.

**Commercial path:** Institutional SaaS and implementation contracts—NGOs, private hospitals, private labs, specialist centres first; government (MoH, NBTS) once pilots prove value.

**Public posture:** The marketing site (www.bloodchain.life) explains the programme. Live software demonstrations are delivered **by appointment**; module access is not open to the public.

---

## 2. Strategic positioning

### 2.1 Tagline and narrative

| Layer | Message |
|-------|---------|
| Primary tagline | **The national blood chain, digitized.** |
| Supporting line | Nine connected applications for donation, lab, logistics, transfusion, chronic care, research, and oversight—one custody chain from donor to patient. |
| The number that leads every meeting | **17,000–20,000 units** — Botswana's annual blood deficit (needs ~45,000/year, collects ~27,000). |

Lead with the gap, not the modules.

### 2.2 Value proposition by stakeholder

| Stakeholder | Outcome Bloodchain enables |
|-------------|---------------------------|
| Ministry of Health / NBTS | National visibility: supply, wastage, logistics, donor verification, structured reporting |
| Hospitals | Transfusion workflows, committee records, compatibility checks, haemovigilance |
| Blood centres / labs | Screening, grouping, QC, release documentation |
| Field collection / NGOs | Eligibility, phlebotomy support, labelling, mobile drives, donor retention |
| Donors / public | Registration, scheduling, journey visibility, trust tiers (Azure portal) |
| Chronic care programmes | Haemophilia, sickle cell, thalassaemia registries and care-gap coordination |
| Research institutions | Study custody, participants, audit trails (Helix) |
| Regulators (BMRA) | Structured returns, review queues, document integrity (Sentinel) |

### 2.3 Differentiation (plain language)

- **Built in Botswana, for Botswana** — Omang ID integration, NBTS workflow understanding, local geography in the logistics map. A foreign vendor cannot replicate this quickly.
- **End-to-end coverage** in one product family.
- **Role-specific applications** so each user sees only their job.
- **Chain of custody** designed in—not retrofitted from paper.
- **Modular adoption**—start with one module at one institution.

---

## 3. The constellation — module map

Nine applications share **Bloodchain Core** (API + database + authentication).

| Module | Mandate | Primary users |
|--------|---------|---------------|
| **High Command** | National cockpit: KPIs, provisioning (Keymaster), donor KYC, ledger, oversight | Programme directors, MoH, NBTS |
| **Mars Lab** | Lab screening, grouping, component QC, release docs | Lab technologists |
| **Scyther** | Field collection, eligibility, phlebotomy, labelling, drives | Collection staff |
| **Voyager** | Logistics, dispatch, cold-chain checkpoints, custody handovers | Logistics coordinators, couriers |
| **Transfuse** | Hospital requests, committee workflows, crossmatch, haemovigilance | Clinicians, committees |
| **Azure** | Donor/patient portal: registration, trust tiers, scheduling | Donors, public |
| **Chronicle** | Chronic blood disorder registries and care coordination | Chronic care coordinators |
| **Helix** | Research and trials: specimens, participants, study audit | PIs, coordinators |
| **Sentinel** | Regulatory compliance and structured returns | Regulatory reviewers |

### 3.1 Custody chain (conceptual flow)

```
Donor (Azure) -> Collection (Scyther) -> Laboratory (Mars Lab) -> Logistics (Voyager)
      -> Hospital (Transfuse) -> Chronic programmes (Chronicle) -> Oversight (High Command)
                                    |
                          Research (Helix) . Regulation (Sentinel)
```

---

## 4. Technology architecture

### 4.1 System overview

```
        Constellation (9 single-page apps)
  High Command . Mars . Scyther . Voyager . Transfuse
  . Azure . Chronicle . Helix . Sentinel
                  |  HTTPS + JWT (Supabase session)
                  v
        Bloodchain Core (Node.js / Express)
   REST API /api/v1 . Role middleware . Prisma ORM
        |                          |
        v                          v
  PostgreSQL (Render)        Supabase
  users, assets, custody,    Authentication +
  dispatch, registries,      optional file storage
  research studies
```

### 4.2 Engineering model

| Item | Detail |
|------|--------|
| Monorepo | `bloodchain-constellation-main` — Yarn workspaces |
| Shared UI | `@bloodchain/ui` |
| API | `bloodchain-core` — TypeScript, Express, Prisma |
| Frontends | Vite + React 19 per module |
| Identity | Supabase Auth (Keycloak decommissioned) |
| Data | PostgreSQL on Render (`bc-infra-db`) |

### 4.3 Authentication and roles

Apps read the authoritative role from Supabase `app_metadata.role`, mirrored in Postgres `users.role`. High Command's Keymaster provisions users (Supabase identity + Postgres profile in one step).

**Role enum:** `PUBLIC`, `MEDICAL`, `LAB`, `TRANSIT`, `ADMIN`, `LOGISTICS_COMMAND`, `SUPER_ADMIN`, `MOH_AUDITOR`, `RESEARCH_PI`, `RESEARCH_COORDINATOR`, `RESEARCH`, `ETHICS_READ`, `CHRONIC_CARE_COORDINATOR`.

**High Command access:** `ADMIN`, `SUPER_ADMIN`, `MOH_AUDITOR`.

### 4.4 Deployment (current)

| Layer | Hosting |
|-------|---------|
| API + Postgres | Render Blueprint (`bc-api`, `bc-infra-db`) |
| Marketing site | `bloodchain.life` — custom domain on demo hub only |
| Module apps | `https://bc-<module>.onrender.com`, shared privately in briefings |

---

## 5. Security, privacy, governance

- No anonymous access to operational modules in production (guest bypass removed).
- Service role key server-side only.
- Role-based access at API and app layers.
- Briefing-only public site.
- **Clinical/regulatory disclaimer:** demonstration and pilot-ready software, not a licensed medical device; national rollout follows clinical validation and BMRA/MoH governance.

---

## 6. Product maturity — honest status

| Dimension | Status |
|-----------|--------|
| Core API and schema | Built |
| Nine module UIs | Built; lint-clean |
| Supabase auth migration | Complete |
| End-to-end national smoke test | Defined, not executed |
| Automated API tests in CI | Partial |
| Clinical certification | Not claimed |
| Customer discovery | **Not done** — the core gap |
| Anchor customer / pilot | None yet |

---

## 7. Business model

### 7.1 Segments (revised priority)

1. **NGOs / community drives** (Blood for Life Botswana) — fastest, no government procurement
2. **Private hospitals** (Gaborone Private, Bokamoso) — accreditation-driven
3. **Private labs / defence** (Diagnofirm, BDF Medical) — commercial procurement
4. **Specialist centres** (Baylor) — funder-backed
5. **Government** (MoH, NBTS) — national licence, last not first

### 7.2 Revenue mechanisms

| Mechanism | Notes |
|-----------|-------|
| NGO operational licence | Small recurring (P1.5k–3k/month) |
| Per-drive fee | Corporate CSR drives (P500–1,500/drive) |
| Private hospital SaaS | P3k–8k/month (Transfuse) |
| Private lab SaaS | P2k–5k/month (Mars Lab) |
| Implementation + licence | Baylor / BDF |
| National licence | MoH/NBTS, post-pilot, bundles High Command + Sentinel |

---

## 8. Outreach and go-to-market

### 8.1 The competitive reality (must know cold)

- **MEDITECH** is installed at NBTS (donor tracking, mobile blood bank). Do **not** pitch displacement.
- **REDCap** is the entrenched free research standard. Helix must counter-position on blood-specific custody.
- Elsewhere (NGOs, private hospitals, district sites, chronic care): the competition is **paper and spreadsheets**.

### 8.2 Three beachheads (start small, no government procurement)

1. **Scyther + Azure -> Blood for Life Botswana** — collection + donor retention. Start here.
2. **Transfuse -> Gaborone Private Hospital** — WHO-documented HTxC/haemovigilance gap.
3. **Mars Lab -> Diagnofirm / BDF Medical** — private labs and defence outside MEDITECH.

### 8.3 Pitch deck spine (swap slide 8 per audience)

Title -> the gap -> what Bloodchain is -> constellation -> custody chain -> maturity -> proof (screens) -> **audience hook** -> deployment -> governance -> roadmap + single CTA -> contact.

### 8.4 Collateral inventory

| Asset | Location |
|-------|----------|
| Module teardown (GTM bible) | [`STRATEGY-module-teardown.md`](./STRATEGY-module-teardown.md) |
| Institutional briefs (6) | `docs/outreach/brief-*.md` |
| Emails | [`emails.md`](./emails.md) |
| Pilot one-pagers | [`pilots.md`](./pilots.md) |
| 90-day plan | [`90-day-plan.md`](./90-day-plan.md) |
| Assumptions log | [`assumptions-log.md`](./assumptions-log.md) |

---

## 9. Roadmap — leadership view

**Near term (0–3 months):** stable hosting; register entity; six discovery conversations; first beachhead pilot signed.

**Medium term (3–9 months):** one–two paid pilots delivering real data; clinical champion; references.

**Long term (9–24 months):** MoH/NBTS national conversation with proof; regional expansion (SADC).

---

## 10. Decisions requested from leadership

1. Approve entity registration and signatory.
2. Approve first beachhead (default: BLB) and pilot budget band.
3. Name a clinical champion/advisor.
4. Approve capital + network ask (see [`90-day-plan.md`](./90-day-plan.md)).
5. Approve briefing-only public communications policy.

---

## 11. Contact

**Bloodchain Botswana** — Gift Jr Nakedi — giftjrnakedi@gmail.com — (267) 721 610 38 — https://www.bloodchain.life

*End of document — Bloodchain DNA v1.1*
