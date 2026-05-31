# Voyager — Institutional brief

## Purpose

Voyager gives **NBTS logistics coordinators** a desktop command centre for blood unit movement across Botswana — dispatch assignment, cold-chain monitoring, custody handovers, and incident escalation.

## Primary user

**LOGISTICS_COMMAND** coordinators at NBTS (desktop-first). **TRANSIT** couriers may use mobile views for handover execution; the product narrative centres on coordination, not lone-driver UX.

## Scope (in)

- National dispatch queue with STAT prioritisation
- Deck.gl map: facilities, routes, cold-chain breach colouring
- Per-job cold-chain panel (2–6°C band, pack type, expiry window)
- Active transfer custody timeline
- Shift-sync sidebar (cross-courier awareness)
- Incident reporting (temp breach, route delay)

## Scope (out)

- Lab release (Mars Lab)
- Hospital transfusion orders (Transfuse)
- National programme dashboard (High Command)
- Regulatory filings (Sentinel)

## Demo narrative

1. Open Voyager → logistics command shows Maun route in **cold breach** (red).
2. Priority queue lists STAT O− to Princess Marina.
3. Dispatch queue → assign / monitor pending Francistown platelets.
4. Shift sync shows lab release → dispatch → transit events.

## Integration

- `GET /assets?status=RELEASED|IN_TRANSIT` for live jobs
- `POST /assets/scan` for custody updates
- `GET /admin/map-nodes`, `/admin/transit-routes` for map (demo seed when offline)
