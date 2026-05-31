# Azure — Institutional brief

**Azure** is the Bloodchain **public donor portal** for Botswana: registration, eligibility, appointment booking, donation journey visibility, family blood requests, and nearby urgent appeals.

## Constellation role

| Module | Relationship |
|--------|----------------|
| **Scyther** | Field collection — units enter the national chain after mobile drives |
| **Mars Lab** | Screening and release — journey steps reference lab clearance |
| **Transfuse** | Hospital transfusion — end state for donated units |
| **High Command** | National programme KPIs — not exposed to donors |
| **Chronicle** | Chronic-care coordination — separate clinical cohort (not donor self-service) |

## Demo

- `http://localhost:5177` — login → **Explore as demo donor** when Supabase is off
- `?guest=1` — instant demo from constellation demo hub

## Stack

React · Vite · PWA · Supabase Auth · `@bloodchain/ui` tokens · cyan accent (`#00C8FF`) on national dark chrome
