# Bloodchain Helix — Institutional Brief

**Research & clinical trials specimen governance** for universities, national health research centres, and ethics committees — built as a constellation module, not a replacement for national blood banking.

---

## Purpose

Helix supports **study registry**, **pseudonymized participant enrolment**, **consent tracking**, **research specimen custody**, **pre-analytical receipt QC**, **research analytical worksheets (demo)**, and **IRB-ready exports**. It is designed for credibility with academic partners (e.g. University of Botswana, BOTUSA, NHSRC) and aligns with public-health LIMS expectations (pre-analytical → custody → analytical → verification) without duplicating operational NBTS workflows.

## What Helix is not

| Constellation app | Responsibility | Helix does not… |
|-------------------|----------------|-----------------|
| **Mars Lab** | National TTI testing, release/discard, analyzer ops on **BloodAsset** units | Run national blood release or Westgard QC on donation units |
| **Scyther** | Donor collection & mobile drives | Manage donor registration or collection logistics |
| **Transfuse** | Hospital transfusion & clinical blood use | Issue blood to wards or cross-match patients |
| **Voyager** | Cold-chain logistics for operational units | Replace national transit for NBTS inventory |
| **Azure** | Donor-facing portal | Expose trial participants to public donor flows |

Optional future bridge: link a research specimen to a `bloodAssetId` when a trial uses donation-derived material — still governed under study protocol, not Mars Lab release rules.

## v1 capabilities (demo + API-ready)

- **Study dashboard** — protocol code, PI, ethics reference, sites, status  
- **Participants** — study IDs, arms, consent state (no national donor IDs in exports)  
- **Pre-analytical** — accession, cold-chain receipt QC, aliquot parent/child IDs  
- **Custody timeline** — status chain from collection through biobank/analysis/archive  
- **Analytical (research)** — worksheet/QC-hold demonstration for trial assays (not national TTI panels)  
- **Audit (ALCOA+)** — who changed what, when, with reason  
- **IRB export** — participants CSV, specimens CSV, summary TXT  

## Roles

| Role | Typical user | Access |
|------|--------------|--------|
| `RESEARCH_PI` | Principal investigator | Full study + export |
| `RESEARCH_COORDINATOR` | Trial coordinator | Enrolment, specimens, custody |
| `RESEARCH` | Field / lab staff | Collection and custody events |
| `ETHICS_READ` | Ethics secretariat | Read-only + export |
| `ADMIN` / `SUPER_ADMIN` | Bloodchain ops | Constellation standard |

## Deployment options

1. **Pilot (demo)** — `yarn dev:helix` with seeded studies; no core API required.  
2. **Connected** — `bloodchain-core` with Prisma `Study` / `ResearchSample` models and `/api/v1/research/*`; set `VITE_API_URL` on Helix.  
3. **Instance** — Dedicated Bloodchain Instance for a single institution’s trials (compliance boundary via Sentinel roadmap).

## Alignment with clinical-trial lab software expectations

Helix v1 intentionally implements **governance and traceability** layers called out in CDC/WHO-style public-health LIMS guidance:

- Specimen identity and visit linkage under protocol  
- Pre-analytical acceptance/rejection at receipt  
- Chain-of-custody with actor, role, location, timestamp  
- QC hold on research worksheets before results are “released” to analysis archive  
- Verification packet for ethics review (export), not operational haemovigilance  

**Deferred to later phases or sibling apps:** HL7/FHIR interfaces, bidirectional analyzer middleware, full Westgard rules engine, national surveillance feeds, offline-first mobile sync.

## Ask for institutional partners

- One active or upcoming **IRB-approved study** for a 4–6 week pilot  
- Named **PI and coordinator** for role provisioning  
- Agreement that **NBTS operational blood** remains in Mars Lab / Scyther unless a written bridge is required  

## Contact

Bloodchain — Botswana national blood infrastructure constellation.  
Technical entry: `helix/README.md` in the Bloodchain constellation repository.
