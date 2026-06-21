# Bloodchain module teardown — GTM bible

Honest per-module go-to-market verdicts. Derived from the May–June 2026 strategy review against the Botswana blood-management research report. This is the canonical commercial reference: treat each module as if it were its own startup and ask "compared to what?"

## Ground truth

Something already exists in Botswana and it is inadequate—that is the starting point, not "nobody has done this."

- **MEDITECH** runs at NBTS (donor tracking + mobile blood bank, offline). Do not pitch displacement.
- **REDCap** is the entrenched free research standard at UB.
- **WHO** has assessed NBTS and flagged the absence of active Hospital Transfusion Committees.
- **BMRA** is reform-mode (MRSA 2013, AUDA-NEPAD blood regulations draft, WHO ML3), resource-constrained.
- The **17,000–20,000 unit annual deficit** is the headline for every conversation.

## Consolidated verdicts

| Module | Standalone? | First customer | Revenue mechanism | Blocking question |
|--------|-------------|----------------|-------------------|-------------------|
| **Scyther** | Yes | Blood for Life Botswana | NGO licence + corporate per-drive | Does BLB run drives without MEDITECH? |
| **Azure** | No (bundle) | With Scyther | Included in Scyther package | Do donors actually want a portal? |
| **Transfuse** | Yes | Gaborone Private Hospital | Private hospital SaaS | Group-mandated IT stack at GPS? |
| **Mars Lab** | Narrow | Diagnofirm + BDF Medical | Private lab SaaS + BDF contract | Do private labs already have blood-bank software? |
| **Voyager** | No (bundle) | With NBTS package | Bundled in NBTS licence | Is cold-chain sensor-based or self-reported? |
| **Chronicle** | Yes, narrowly | Baylor Children's CCE | Implementation + licence | Are Baylor's records actually paper-based? |
| **Helix** | No (bundle) | With Mars Lab + High Command | Research institution licence | Is REDCap already in use at UB? |
| **Sentinel** | No (bundle) | With NBTS licence | Procurement accelerant | Will BMRA accept industry-adjacent software? |
| **High Command** | Never alone | MoH (after pilots) | Justifies national licence | Are two pilots live with real data? |

## Key positioning notes

- **Helix vs REDCap:** defensible only if Helix genuinely links specimen records to Mars Lab blood-asset data. Confirm integration in the build before claiming it. Bundle with Mars Lab + High Command; sell to institutions already doing blood research (BHP, PEPFAR partners).
- **Sentinel + conflict of interest:** a regulator buying compliance software from a vendor that also sells to the regulated is a governance problem. Reframe: blood establishments pay; BMRA gets free read-only reviewer access as a national-agreement condition. Align output format with the AUDA-NEPAD draft returns.
- **Chronicle:** strongest standalone human story (children with sickle cell missing scheduled transfusions). Pitch tightly: "a care-coordination tool for the Baylor paediatric transfusion programme," 50 patients, 90 days—not "national registry."
- **Mars Lab:** technically out-positioned by MEDITECH at NBTS. Real markets are private labs and BDF Medical (no MEDITECH) and district sites. Do not attempt NBTS displacement.
- **Scyther + Azure:** the most natural pitch in the portfolio. Competition is paper; stakes are the 17k deficit; donor retention is the wedge.
- **Transfuse:** most legitimately needed (WHO on record). Start at private hospitals (faster than public). Risk-management/accreditation framing.
- **Voyager:** clarify internally whether "cold-chain compliance" is sensor-based or checkpoint self-report before pitching to clinical/regulatory audiences.
- **High Command:** never pitch an empty dashboard to a minister. Unlock it with pilot data first.

## The strategic correction

You built a national platform and tried to sell it module-by-module to a national audience. In health software, **programmes have revenue, modules do not**. The question is not "which module first" but "which institution becomes the anchor that pulls the platform in." Answer: one anchor, one module, expand from there.

**Sequence:** three small paying beachheads (BLB, one private hospital, Baylor or a private lab) -> real data + references -> national MoH/NBTS conversation. Not the reverse.
