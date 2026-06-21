# Assumptions log — Phase 1 customer discovery

The entire strategy rests on six assumptions that have **not been tested with real people**. Each is cheap to test (a phone call or meeting) and expensive to get wrong (months of building the wrong thing). Run these conversations **before** expanding any module.

**Rule:** Listen, do not pitch. The goal is to learn the real workflow and what it would take to switch — not to sell.

**Day-30 gate:** at least 3 of these completed; one beachhead confirmed or killed.

---

## Tracker

| # | Assumption to test | Target / who | What kills the plan | Status | Date | Finding |
|---|--------------------|--------------|---------------------|--------|------|---------|
| 1 | BLB runs blood drives **without** MEDITECH, on paper/spreadsheet | Blood for Life Botswana (Molibi Maphanyane) | If MEDITECH mobile already used, Scyther+Azure beachhead changes | Not started | | |
| 2 | Baylor transfusion records are **paper/spreadsheet**, not EMR | Baylor clinical coordinator | If already in an EMR, Chronicle pilot loses its wedge | Not started | | |
| 3 | GPS / Bokamoso has **no digital haemovigilance** today | Private hospital blood bank lead | If a group IT stack mandates otherwise, Transfuse standalone revenue is blocked | Not started | | |
| 4 | Diagnofirm uses **no dedicated blood-bank software** | Diagnofirm operations | If they have lab blood-bank software, Mars Lab private-lab path narrows | Not started | | |
| 5 | REDCap is (or is not) the **standard** at UB/BHP for blood studies | UB Family Medicine / BHP ops | If REDCap is entrenched and sufficient, Helix needs the integration story or it dies | Not started | | |
| 6 | Voyager cold-chain is **sensor-based vs checkpoint self-report** | Internal engineering + NBTS logistics | If self-report, we must not claim sensor-grade compliance | Not started | | |

---

## Per-question interview guide

### Q1 — BLB collection workflow
- Walk me through your last drive from setup to the units leaving the site.
- What do you use to register donors? What happens to that record afterwards?
- How do you contact past donors for the next drive — or do you?
- If you could fix one thing about drive day, what would it be?

### Q2 — Baylor chronic transfusion records
- How do you track which child is due for a transfusion and when?
- Where does that information live? Who updates it?
- How do you find out a scheduled transfusion was missed?

### Q3 — Private hospital haemovigilance
- Do you have an active Hospital Transfusion Committee? How does it keep records?
- How is an adverse transfusion reaction recorded today?
- Is your IT stack chosen here or mandated by a hospital group?

### Q4 — Private lab blood-bank documentation
- What software, if any, do you use for blood grouping / screening / release docs?
- Where are MEDITECH and the national system relevant to you — or not?

### Q5 — Research data tooling
- For blood/transfusion studies, what do you use to capture data?
- How do you track the physical specimen, not just the survey data?
- Is REDCap mandated, preferred, or just default?

### Q6 — Voyager cold chain (internal first)
- Does Voyager read temperature from sensors, or do couriers log checkpoints?
- What exactly can we honestly claim about cold-chain compliance today?

---

## Decision after Day 30

- **Confirmed beachhead** (assumption holds, real pain, willing to pilot) -> proceed to `pilots.md`.
- **Killed** (assumption false) -> pivot to the next module/segment; record why here so we never re-test it blind.
