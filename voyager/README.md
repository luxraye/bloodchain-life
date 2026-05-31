# Voyager — Logistics command

**Voyager** is the NBTS **logistics coordinator workstation** for the Bloodchain national blood OS. It commands dispatch, monitors cold-chain compliance on national routes, and maintains custody visibility between collection, lab release, and hospital delivery.

## Run locally

```bash
yarn dev:voyager
```

- **http://localhost:5175?guest=1** — demo coordinator (full seed)
- Without Supabase: **Enter command centre** on login

## Routes

| Path | Purpose |
|------|---------|
| `/` | Logistics command — map + priority dispatch |
| `/queue` | Full dispatch queue |
| `/active` | Active transfer detail + cold chain + custody |
| `/map` | Full-screen national map |
| `/profile` | Coordinator profile |

## Demo seed

- 8 dispatches (STAT, pending, in-transit, flagged, delivered)
- Cold-chain states: OK / WARNING / BREACH (Maun long-haul)
- 7 facilities + 5 routes on Deck.gl map
- Coordinator actions: assign courier, expedite STAT, acknowledge cold-chain alerts
- Cross-facility activity sync (background poll, no UI panel)

## Constellation boundary

- **Mars Lab** releases units · **Scyther** collects · **Transfuse** uses at hospital
- **High Command** national programme KPIs · **Voyager** field logistics command

See `docs/Voyager-Institutional-Brief.md`.

## Stack

React · Vite · MapLibre · Deck.gl · TanStack Query · `@bloodchain/ui` · Supabase
