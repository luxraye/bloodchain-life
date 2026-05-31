# High Command — Institutional brief

## Purpose

High Command is the **national programme cockpit** for Bloodchain — the layer where Ministry of Health officials, NBTS leadership, and system administrators see the whole constellation, govern access, and audit custody across the blood OS.

It is **not** a clinical workstation and **not** limited to monitoring donor apps.

## Scope (in)

| Capability | Description |
|------------|-------------|
| **National command** | Supply, logistics, testing queue, wastage — national KPIs |
| **Constellation** | Health and deep-links to all eight modules (Scyther → Sentinel) |
| **Keymaster** | Provision staff roles (LAB, MEDICAL, TRANSIT, etc.) |
| **Master ledger** | Immutable cross-facility custody events |
| **Citizen auditing** | Donor KYC / trust verification from Azure |
| **Ministry reporter** | PDF/CSV national exports |

## Scope (out)

- Phlebotomy, screening benches, courier scans, transfusion orders, chronic charts, research specimens, regulatory filings — each in its module.

## Constellation pillars

1. **Operations** — Scyther, Voyager, Azure  
2. **Clinical** — Mars Lab, Transfuse  
3. **Population** — Chronicle, Helix  
4. **Governance** — Sentinel (Instances engine)

## Audience

- `ADMIN`, `SUPER_ADMIN`, `MOH_AUDITOR`

## Demo

`http://localhost:5173?guest=1` or demo mode without Supabase configured.
