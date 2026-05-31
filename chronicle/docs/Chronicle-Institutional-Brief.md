# Bloodchain Chronicle — Institutional Brief

**Care coordinator workstation** for chronic blood disorder registries — NHSRC, hospital haematology units, and managed-care partners (e.g. BPOMAS).

## Purpose

Chronicle is an **active surveillance registry**, not a static patient list. Coordinators start from **exceptions** (missed visits, factor lapses, rising-risk signals), maintain **MCC-style care plans**, track **transfusion and factor lot history**, and produce **four report types** aligned with enterprise chronic-care registry practice.

## Capabilities (v1)

| Module | Coordinator value |
|--------|-------------------|
| Command dashboard | Priority queue, reviews due, cohort counts |
| Exception queue | Assign, contact, resolve outreach items |
| Patient registry | Haemophilia · sickle cell · thalassaemia |
| Care plans | Custodian site, prophylaxis, goals, factor lots |
| Data quality | Problem list vs billing discrepancies (demo) |
| Reports | Patient, exception, progress, **anonymised population** |

## What Chronicle is not

- **Transfuse** — acute transfusion and bedside verification  
- **High Command** — national blood inventory and MoH logistics dashboards  
- **Helix** — clinical trial specimen custody  
- **Sentinel** — regulatory submissions (Instances, future)

Population reports are **anonymised aggregates** suitable for BPOMAS or programme directors; named patient exports stay with authorised clinical staff.

## Pilot ask

- Named **care coordinator** or NHSRC registry lead  
- One condition cohort (e.g. sickle cell) for 4–6 week pilot  
- Agreement that **acute blood issue** remains Transfuse / Mars Lab operational path  

## Contact

Technical entry: `chronicle/README.md` in the Bloodchain constellation repository.
