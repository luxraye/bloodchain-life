# Bloodchain Core — Rollback Protocol
**Generated:** 2026-03-11T18:12:00+02:00
**Purpose:** Snapshot of the system state before Phase 1 Overhaul.

---

## 1. Dependency Snapshot

### Production Dependencies
| Package | Version |
|---|---|
| @prisma/client | ^5.22.0 |
| @supabase/supabase-js | ^2.98.0 |
| cors | ^2.8.6 |
| dotenv | ^17.3.1 |
| express | ^5.2.1 |
| jsonwebtoken | ^9.0.2 |
| uuid | ^13.0.0 |

### Dev Dependencies
| Package | Version |
|---|---|
| @types/cors | ^2.8.19 |
| @types/express | ^5.0.6 |
| @types/jsonwebtoken | ^9.0.7 |
| @types/node | ^25.3.0 |
| @types/uuid | ^10.0.0 |
| nodemon | ^3.1.13 |
| prisma | ^5.22.0 |
| ts-node | ^10.9.2 |
| typescript | ^5.9.3 |

---

## 2. Schema Snapshot (schema.prisma)

### Enums
- **Role**: PUBLIC, MEDICAL, LAB, TRANSIT, ADMIN
- **UserStatus**: ACTIVE, SUSPENDED
- **AssetStatus**: COLLECTED, TESTING, QUARANTINE, RELEASED, IN_TRANSIT, USED, DISCARDED

### Models
- **User** (`users`): id, email (unique), name, role, facilityId?, bloodType?, status, supabaseId? (unique), kcUserId?, trustLevel, verificationDocUrl?, age?, gender?, region?, medicalConditions?, createdAt, updatedAt. Relations: donations, custodyEvents, actionLogs.
- **BloodAsset** (`blood_assets`): id, donorId, bloodType, status, currentLocation, notes?, createdAt, updatedAt. Relations: donor (User), custodyEvents.
- **CustodyEvent** (`custody_events`): id, assetId, actorId, actorName, actorRole, status, location, notes?, createdAt. Relations: asset (BloodAsset), actor (User).
- **ActionLog** (`action_logs`): id, assetId?, actionPerformed, userId, userName, userRole, facility, createdAt. Relations: user (User).

---

## 3. Route Map

| Method | Path | Auth Middleware | RBAC |
|---|---|---|---|
| GET | /health | None | None |
| POST | /api/v1/register | None | None (public) |
| POST | /api/v1/admin/users | requireAuth | None |
| GET | /api/v1/admin/users | requireAuth | None |
| DELETE | /api/v1/admin/users/:id | requireAuth | None |
| PATCH | /api/v1/admin/users/:id | requireAuth | None |
| GET | /api/v1/admin/stats | requireAuth | None |
| GET | /api/v1/assets/my-donations | requireAuth | None |
| GET | /api/v1/assets | requireAuth | None |
| GET | /api/v1/assets/:id/custody | requireAuth | None |
| GET | /api/v1/assets/:id | requireAuth | None |
| POST | /api/v1/assets | requireAuth | None |
| POST | /api/v1/assets/scan | requireAuth | None |
| GET | /api/v1/profile/me | requireAuth | None |
| PATCH | /api/v1/profile/me | requireAuth | None |
| GET | /api/v1/activity/shift-sync | requireAuth | None |

---

## 4. Environment Variable Keys

```
DATABASE_URL
PORT
SUPABASE_URL
SUPABASE_JWT_SECRET
SUPABASE_SERVICE_ROLE_KEY
NODE_ENV
ALLOWED_ORIGINS
```

---

## 5. Reversion Instructions

No Git repository is initialized. A backup archive was created before modifications.

### To Revert:
```powershell
# 1. Stop the dev server (Ctrl+C)

# 2. Restore from backup
cd c:\Users\cima22-022\bloodchain-core
Remove-Item -Recurse -Force src, prisma
Expand-Archive -Path pre_phase1_backup.zip -DestinationPath . -Force

# 3. Regenerate Prisma client
npx prisma generate

# 4. Restart
npm run dev
```
