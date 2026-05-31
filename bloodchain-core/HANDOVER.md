# Bloodchain — Handover Document

Current status of the Bloodchain project as of **24 Feb 2026**. Written so a new session can pick up exactly where we left off.

---

## 1. Project overview

Bloodchain is Botswana's national blood supply chain platform. It consists of a backend API (`bloodchain-core`), five frontend apps, and a Keycloak identity server — all coordinated through a single realm.

---

## 2. Completed work

| # | Directive | Status |
|---|-----------|--------|
| 1 | **Unified identity** — `useAuth` hook + Universal Navbar across all apps | Done |
| 2 | **Frictionless UX** — Scyther auto-advance, Mars inline biohazard, Voyager large tap targets | Done |
| 3 | **Mock data purge** — All frontends wired to bloodchain-core API, empty states everywhere | Done |
| 4 | **Keycloak Bloodchain theme** — Custom `login.ftl`, `register.ftl`, dark slate CSS, docker volume | Done |
| 5 | **Auth isolation (role gating)** — Per-app role checks, `ADMIN` passes everywhere, Access Denied screens | Done |

---

## 3. Repo layout & file paths

Two base paths are in use. **Pay attention** — Azure and Mars-lab live at the root, everything else is under scratch.

### 3.1 Scratch apps

Base: `C:\Users\cima22-022\.gemini\antigravity\scratch\`

| App / Service | Full path | Description |
|---------------|-----------|-------------|
| **bloodchain-core** | `C:\Users\cima22-022\.gemini\antigravity\scratch\bloodchain-core\` | Express API, Postgres, Keycloak (docker-compose) |
| **high-command** | `C:\Users\cima22-022\.gemini\antigravity\scratch\high-command\` | Admin dashboard — user provisioning, stats, ledger |
| **scyther** | `C:\Users\cima22-022\.gemini\antigravity\scratch\scyther\` | Collection app — donor check-in, screening, phlebotomy, inventory |
| **voyager** | `C:\Users\cima22-022\.gemini\antigravity\scratch\voyager\` | Driver app — job feed, pickup, drop-off |
| **keycloak-theme** | `C:\Users\cima22-022\.gemini\antigravity\scratch\keycloak-theme\bloodchain\` | Keycloak login/register theme (mounted via docker volume) |

### 3.2 Root apps

| App | Full path | Description |
|-----|-----------|-------------|
| **azure** | `C:\Users\cima22-022\azure\` | Public donor app — profile, donation history, blood requests. Single-file app (`App.jsx`). |
| **mars-lab** | `C:\Users\cima22-022\mars-lab\` | Lab app — batch processing, biohazard, testing. TypeScript (`App.tsx`). |

> **Note:** There was previously a `scratch\azure\` copy — it has been deleted. Use only the root copy.

---

## 4. Key files per app

### bloodchain-core

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Postgres 15 + Keycloak 24; `keycloak_data` volume; theme volume mounted |
| `KEYCLOAK-SETUP.md` | Steps to create realm `bloodchain`, client `bloodchain-frontend`, redirect URIs, test user |
| `src/index.ts` | Express app, `/health`, `/api/v1` router |
| `src/routes/admin.routes.ts` | `POST/GET /api/v1/admin/users`, `GET /api/v1/admin/stats` |
| `src/routes/asset.routes.ts` | `GET/POST /api/v1/assets`, `GET /api/v1/assets/my-donations`, `POST /api/v1/assets/scan` |
| `src/middlewares/requireAuth.ts` | JWT verification via Keycloak JWKS; `Bearer dev-bypass` allowed in non-production |
| `prisma/schema.prisma` | `User`, `BloodAsset` models; `Role` enum: `PUBLIC`, `MEDICAL`, `LAB`, `TRANSIT`, `ADMIN` |

### high-command (`scratch\high-command\`)

| File | Purpose |
|------|---------|
| `src/lib/keycloak.ts` | Keycloak config; `VITE_SKIP_KEYCLOAK=true` creates mock token with `role: admin` |
| `src/lib/api.ts` | Axios instance; sends `Bearer dev-bypass` when Keycloak is skipped |
| `src/hooks/useAuth.ts` | `user`, `roles`, `hasRole()`, `logout()`, `login()` |
| `src/App.tsx` | Role gate: requires `ADMIN`; renders `<AccessDenied />` otherwise |
| `src/services/adminService.ts` | Calls core for users & stats; ledger/nodes return empty |
| `src/pages/Users.tsx` | User provisioning with role selector (`PUBLIC`, `MEDICAL`, `LAB`, `TRANSIT`, `ADMIN`) |

### scyther (`scratch\scyther\`)

| File | Purpose |
|------|---------|
| `src/lib/keycloak.js` | Keycloak config (realm `bloodchain`, client `bloodchain-frontend`) |
| `src/hooks/useAuth.js` | `user`, `roles`, `hasRole()`, `logout()`, `login()` |
| `src/App.jsx` | Role gate: requires `MEDICAL` or `ADMIN` |
| `src/context/AppContext.jsx` | Fetches donors via `getUsers()`, blood units via `getAssets()`; `donorsLoading`, `unitsLoading`, `inventory` |
| `src/lib/api.js` | `getUsers`, `getAssets`, `createBloodAsset`; Keycloak token in headers |
| `src/lib/collectionHelpers.js` | `generateUnitId`, `daysUntilExpiry`, `canDonate`, `daysSinceLastDonation`, `findDonorByOmang`, `getInventoryByType` |
| `src/pages/collection/DonorCheckIn.jsx` | Uses `donors` + `donorsLoading` from context; search by Omang; loading/empty states |
| `src/pages/collection/MedicalScreening.jsx` | Vitals input, eligibility check, auto-advance to phlebotomy on pass |
| `src/pages/clinical/InventoryDashboard.jsx` | Fridge view chart; loading/empty states; uses `unitsLoading` |

> `src/data/mockData.js` has been **deleted**. All imports now use `collectionHelpers.js`.

### voyager (`scratch\voyager\`)

| File | Purpose |
|------|---------|
| `src/lib/keycloak.js` | Keycloak config |
| `src/hooks/useAuth.js` | `user`, `roles`, `hasRole()`, `logout()`, `login()` |
| `src/App.jsx` | Role gate: requires `TRANSIT` or `ADMIN`; auth check → role check → login screen |
| `src/context/JobContext.jsx` | Fetches jobs from bloodchain-core assets API |

### azure (`C:\Users\cima22-022\azure\`)

| File | Purpose |
|------|---------|
| `src/lib/keycloak.js` | Keycloak config (realm `bloodchain`, client `bloodchain-frontend`) |
| `src/lib/api.js` | Axios instance with Keycloak token interceptor |
| `src/hooks/useAuth.js` | `user`, `logout()`, `login()` |
| `src/services/api.js` | Service layer — `getUserProfile()` from Keycloak token; `getDonationHistory()` from core API; all other endpoints return `[]`/`null` (no backend yet); `STATIC_EDUCATION` kept as reference data |
| `src/App.jsx` | Single-file app: `Dashboard`, `DonationHistory`, `RequestBlood`, `Profile` components; empty states throughout; **no role gate** (public app) |
| `src/main.jsx` | Keycloak `login-required`; renders app only when authenticated |
| `src/components/Navbar.jsx` | Universal Navbar with Bloodchain branding |

### mars-lab (`C:\Users\cima22-022\mars-lab\`)

| File | Purpose |
|------|---------|
| `src/lib/keycloak.ts` | Keycloak config |
| `src/hooks/useAuth.ts` | `user`, `roles`, `hasRole()`, `logout()`, `login()` |
| `src/App.tsx` | Role gate: requires `LAB` or `ADMIN`; auth check → role check → login screen |
| `src/main.tsx` | Keycloak `check-sso`; renders app, lets App handle login UI |
| `src/components/BatchProcessor.tsx` | Main lab processing interface |
| `src/components/Navbar.tsx` | Universal Navbar |

### keycloak-theme (`scratch\keycloak-theme\bloodchain\login\`)

| File | Purpose |
|------|---------|
| `theme.properties` | `parent=keycloak`, loads `css/login.css` |
| `login.ftl` | Custom login page — SVG blood-drop logo, dark slate card, red CTA |
| `register.ftl` | Registration page — same branding, first/last name row, back-to-login link |
| `resources/css/login.css` | Dark gradient, frosted glass card, brand-red buttons, styled alerts |

---

## 5. Auth & role system

### Role → App access

| Role | Provisioned as | High Command | Scyther | Voyager | Mars-lab | Azure |
|------|---------------|:---:|:---:|:---:|:---:|:---:|
| `ADMIN` | Administrator | Yes | Yes | Yes | Yes | Yes |
| `MEDICAL` | Collection staff | No | Yes | No | No | Yes |
| `LAB` | Lab technician | No | No | No | Yes | Yes |
| `TRANSIT` | Driver / Courier | No | No | Yes | No | Yes |
| `PUBLIC` | Donor | No | No | No | No | Yes |

### How it works

- Each `useAuth()` hook exposes `roles: string[]` and `hasRole(...roles): boolean`.
- Each staff app's `App` component calls `hasRole()` against its `ALLOWED_ROLES` array before rendering routes.
- If denied: styled **Access Denied** screen showing the user's name, current role, required role, and a logout button.
- Azure has **no role gate** — any authenticated user can use it.
- High Command's `VITE_SKIP_KEYCLOAK=true` bypass sets role to `admin`, so the gate always passes.

### Keycloak setup

- All apps currently share client `bloodchain-frontend` in realm `bloodchain`.
- Roles are Keycloak **realm roles** (`ADMIN`, `MEDICAL`, `LAB`, `TRANSIT`, `PUBLIC`).
- Assign via Keycloak Admin → Users → Role Mappings.
- Users provisioned via High Command get a `role` in the Prisma DB, but the **frontend checks the Keycloak realm role**.

---

## 6. bloodchain-core API reference

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/health` | No | Liveness check |
| GET | `/api/v1/admin/users` | Yes | List users (`?role=` optional) |
| POST | `/api/v1/admin/users` | Yes | Provision user |
| GET | `/api/v1/admin/stats` | Yes | Dashboard metrics |
| GET | `/api/v1/assets` | Yes | List blood assets (`?status=` optional) |
| GET | `/api/v1/assets/my-donations` | Yes | Donor's own donation history (userId from JWT) |
| POST | `/api/v1/assets` | Yes | Create blood asset (first draw) |
| POST | `/api/v1/assets/scan` | Yes | Scan / update asset status |

Auth accepts a valid Keycloak JWT or, in non-production, `Authorization: Bearer dev-bypass`.

---

## 7. Running the stack

```
# 1. Start Postgres + Keycloak
cd C:\Users\cima22-022\.gemini\antigravity\scratch\bloodchain-core
docker compose up -d

# 2. Start the API
npm run dev          # runs on :4000

# 3. Activate Keycloak theme (one-time)
#    http://localhost:8080/admin → Realm Settings → Themes → Login theme → bloodchain → Save

# 4. Start frontends (each in its own terminal)
cd ..\high-command && npm run dev     # :5173 (set VITE_SKIP_KEYCLOAK=true in .env to skip auth)
cd ..\scyther && npm run dev          # :5174
cd ..\voyager && npm run dev          # :5175
cd C:\Users\cima22-022\mars-lab && npm run dev    # :5176
cd C:\Users\cima22-022\azure && npm run dev       # :5177
```

Port numbers may vary — check each app's `vite.config`.

---

## 8. Active directive — MEDITECH Parity

**Objective:** Overhaul Mars-lab from basic MVP to a professional Laboratory Information System (LIS), then propagate the clinical design language to the rest of the ecosystem.

**Design philosophy:** High-density clinical dashboard. Sterile, high-contrast (slate/navy backgrounds). Distinct status colours: Red = Biohazard/Discard, Green = Cleared/Released, Amber = Quarantine. Monospace fonts for barcodes/IDs. Compact tables over large cards.

### Mission 1 — Mars High-Density UI Rewrite: DONE

Completely rewrote the Mars-lab processing dashboard.

**What was built:**

| Component | File | Purpose |
|-----------|------|---------|
| `BatchProcessor.tsx` | `mars-lab\src\components\BatchProcessor.tsx` | Full rewrite — high-density processing board with 6-column summary strip, ISBT-128 formatted IDs, expiry countdown (days), clinical status badges, row-click to open drawer, keyboard shortcuts (1=Release, 9=Discard), pagination, empty state |
| `StatusBadge.tsx` | `mars-lab\src\components\StatusBadge.tsx` | Reusable clinical status badge (INCOMING/TESTING/QUARANTINE/RELEASED/BIOHAZARD/DISCARDED) + `ViralBadge` (PENDING/CLEAR/REACTIVE). Colour-coded with icons. |
| `CustodyDrawer.tsx` | `mars-lab\src\components\CustodyDrawer.tsx` | 400px side-panel drawer. Shows: ISBT-128 ID, blood type, component, donor, status badges, expiry countdown, full viral screening panel (HIV, Hep B, Hep C, Syphilis with per-marker colour), chain of custody timeline with actor/action/time. Footer has Release, Discard, and Split Component buttons. |
| `isbt128.ts` | `mars-lab\src\lib\isbt128.ts` | `formatIsbt128(id)` → `=W0000 26 998877` style display. `isbt128Digits(id)` for barcode rendering. |

**Key UI changes:**
- Summary row: 6 cells (Total, Incoming, Testing, Quarantine, Released, Biohazard) with monospace zero-padded counts
- Table columns: ISBT-128 | TYPE | COLLECTED | EXPIRY (countdown in days, colour-coded) | SCREEN (viral badge) | STATUS (clinical badge) | ACTION (Release/Discard buttons)
- Row click opens CustodyDrawer side-panel
- Scan bar with Camera Scan placeholder button (logs to console, ready for PWA integration)
- Keyboard shortcuts preserved (1=Release, 9=Discard)
- Refresh button, filter dropdowns (status + blood type)

### Mission 2 — Clinical Lab Workflows: DONE

| Component | File | Purpose |
|-----------|------|---------|
| `SplitComponentModal.tsx` | `mars-lab\src\components\SplitComponentModal.tsx` | Modal for splitting Whole Blood into derived components: Red Blood Cells (RBC), Platelets, Fresh Frozen Plasma (FFP). Checkbox selection, colour-coded per component. Logs payload to console (backend schema update pending). Accessible from CustodyDrawer when unit is QUARANTINE/INCOMING/TESTING. |
| `SupervisorVerifyModal.tsx` | `mars-lab\src\components\SupervisorVerifyModal.tsx` | Two-step biohazard discard gate. When tech clicks Discard, this modal requires supervisor PIN (4+ digits, numeric, masked). Shows unit ID and irreversibility warning. Stub accepts any valid PIN during dev. Only after verification does the `scanAsset(id, 'DISCARDED')` call fire. |

**Flow:**
1. Tech clicks "Discard" on a row or in the drawer → `SupervisorVerifyModal` opens (not the old inline confirm)
2. Supervisor enters PIN → modal fires `scanAsset(id, 'DISCARDED')` → queue refreshes
3. Tech clicks "Split Component" in the drawer (only on QUARANTINE/INCOMING/TESTING units) → `SplitComponentModal` opens → selects RBC/PLT/FFP → logs payload

### Mission 3 — ISBT-128 & Smart Device Prep: IN PROGRESS

**Done:**
- Mars-lab: All asset IDs displayed as ISBT-128 formatted strings (`=W0000 26 XXXXXX`) via `formatIsbt128()` in the table, drawer, and modals
- Mars-lab: "Scan with Camera" button in the scan bar (logs to console, placeholder for PWA camera integration)

**Remaining (immediate next step):**
- **Scyther Phlebotomy page** (`scratch\scyther\src\pages\collection\Phlebotomy.jsx`): Add ISBT-128 formatting for the Unit ID display in the finalize summary, and add a "Scan with Camera" button next to the bag barcode input field. The page is already read and understood — the edit points are identified (line ~276 for Unit ID display, line ~239 for camera button).
- Copy `isbt128.ts` helper to Scyther (or create a JS equivalent at `scyther\src\lib\isbt128.js`)

### Mission 4 — Design Synchronization: NOT STARTED

Review all other apps and align them to the clinical design language:

- **high-command** (`scratch\high-command\`): Users table should use the same `StatusBadge` colour scheme (Red/Green/Amber) for role badges. Dashboard stat cards should match Mars's compact summary cell style.
- **scyther** (`scratch\scyther\`): InventoryDashboard status labels, DonorCheckIn eligibility badges, and MedicalScreening outcome badges should use the clinical colour system (Red=deferred/biohazard, Green=eligible/passed, Amber=pending/quarantine).
- **voyager** (`scratch\voyager\`): Job status badges (COLLECTED, IN_TRANSIT, DELIVERED) should align with the same palette.
- **Specific deliverable:** Extract a shared colour/badge convention doc or utility so all apps reference the same status→colour mapping.

---

## 9. To-do list

### Immediate (finish MEDITECH Parity)

- [ ] **Mission 3 — Scyther ISBT-128 + Camera Scan** — Add `isbt128.js` helper to Scyther. Format Unit ID as ISBT-128 in Phlebotomy finalize summary. Add "Scan with Camera" button next to bag barcode input.
- [ ] **Mission 4 — Design Synchronization** — Align status badge colours across high-command, scyther, and voyager to match the clinical design language (Red/Green/Amber). Review tables, buttons, and cards for consistency.

### Backlog

- [ ] **Split Keycloak clients for Azure self-registration** — Create `azure-public` and `bloodchain-staff` clients. Enable realm user registration. Conditionally show/hide registration link in Keycloak theme based on `client.clientId`. Achieves full session isolation.
- [ ] **FFT / Downtime mitigation**
- [ ] **Backend: Component splitting schema** — Add `parentAssetId` and `componentType` fields to BloodAsset model so the SplitComponentModal can persist splits (currently logs to console).
- [ ] **Backend: Supervisor PIN verification** — Add a real PIN check endpoint or Keycloak-based second-factor for biohazard discard (currently accepts any 4+ digit PIN).
