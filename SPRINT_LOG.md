# Bloodchain — Sprint Log
*Running record of work done, decisions made, and blockers per session.*

---

## Sprint 1 — 2026-05-08
**Phase:** 0 (Foundation)  
**Goal:** Plan established; begin Phase 0 deployment work

### Completed
- Full codebase orientation: read currentstatus.md, PILOT-ROLLOUT-CHECKLIST.md, fabricrollback.md, render.yaml, bloodchain-core/HANDOVER.md
- Created `BLOODCHAIN_MASTER_PLAN.md` — master transformation roadmap
- Created `OPEN_ISSUES.md` — consolidated all known issues from three source documents into prioritized list
- Created `DECISIONS.md` — permanent decision log seeded with six founding decisions
- Created `SPRINT_LOG.md` (this file)

### In Progress
- Phase 0 deployment (Render blueprint execution) — blocked on env var setup (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY needed)

### Blockers
- Render deployment requires live Supabase project credentials — confirm these exist before proceeding
- Confirm Botswana NBTS / MoH contact research has been started or assign

### Next Session Priority
1. ISBT-128 in Scyther Phlebotomy page (OPEN_ISSUES H1 + H2) — quick win, completes Mission 3
2. Render deployment — set env vars and trigger first deploy
3. Secrets audit — `git grep` for credentials

---

## Sprint 2 — 2026-05-08 (Session 2)
**Phase:** 0 — UI/UX pass across all apps  
**Goal:** Eliminate emoji/Unicode from all app UIs; replace red logout buttons; give Voyager a proper desktop experience

### Completed
**high-command (full UI pass):**
- `Layout.tsx` — Lucide nav icons (LayoutDashboard/Users/BookOpen/FileBarChart2/ShieldCheck), user avatar/initials strip, ChevronLeft collapse toggle
- `Navbar.tsx` — removed jarring `bg-red-600` logout → ghost `LogOut` icon button ("Sign Out")
- `Dashboard.tsx` — ticker icons: Droplets/Truck/FlaskConical/AlertTriangle/Globe; courier row uses Truck inline; empty state uses Truck
- `Users.tsx` — TRANSIT badge fixed amber→violet (now distinct from LAB); ⊘ delete → `Trash2`; ⚿ header → `KeyRound`; provision button → `UserPlus` icon
- `Reports.tsx` — ⚙ header → `FileBarChart2`; 📄 generate button → `FileDown` icon
- `IdentityVerification.tsx` — 🛡️ empty state → `ShieldCheck`
- `MasterLedger.tsx` — ⛓ header and empty state → `Link2`
- `App.tsx` — 🔒 in AccessDenied → `Lock`

**Cross-app logout buttons (all apps):**
- scyther/Navbar.jsx, mars-lab/Navbar.tsx, voyager/Navbar.jsx, azure/Navbar.jsx — all removed `bg-red-600` → ghost `LogOut` icon button with correct theme colors

**voyager — desktop layout redesign:**
- `App.jsx` — full rewrite: `DesktopSidebar` component (orange accents, nav items, user strip, activity status); `DesktopSidebar` replaces Navbar at `lg:`; removed `max-w-7xl border-x` phone wrapper; fixed 🔒 → `Lock`
- `JobFeed.jsx` — 2-column (`lg:grid-cols-2`) / 3-column (`xl:grid-cols-3`) card grid on desktop; 4th "Total Jobs" stat card visible on desktop; `lg:px-8` header padding
- `ActiveJob.jsx` — 2-column `lg:grid` layout for content; Truck/Camera/Smartphone replace 🚛/📸/📲 emoji in timeline and handover buttons

### Pending from this session
- Voyager schemas.js still has 🌡️/🚦/🔧 in incident type labels — low priority (internal select options)
- Scyther clinical pages not deeply reviewed (MedicalScreening, Phlebotomy, etc.) — likely clean
- Phase 0 deployment tasks still open (C1–C5 from OPEN_ISSUES.md)

### Next Session Priority
1. Phase 0: secrets audit (`git grep` for hardcoded credentials), Render env var verification
2. Scyther Phlebotomy — ISBT-128 label printing flow (H1/H2 in OPEN_ISSUES)
3. Supervisor PIN security fix (C4 in OPEN_ISSUES — clinical safety gap)

---

*Add new sprints above this line in reverse chronological order.*
