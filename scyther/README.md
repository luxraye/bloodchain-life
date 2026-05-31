# Scyther: Clinical Operations Terminal

![Scyther UI Overview - Placeholder]

**Scyther** is the clinical command center of the Bloodchain Ecosystem. It is designed entirely for **Nurses and Phlebotomists** operating out of physical blood collection facilities across Botswana.

---

## 🌍 Role in the Bloodchain Ecosystem
Scyther initiates the physical chain of custody. When a donor walks into a clinic, a nurse uses Scyther to screen them, perform the physical blood draw, and create the genesis record of the `BloodAsset` in the backend database. Every unit of blood in the ecosystem is birthed via Scyther.

## ✨ Core Features
- **Donor Check-In**: Lookup donors who registered via the public `Azure` app and verify their details on arrival.
- **Medical Screening**: Input pre-donation health vitals (blood pressure, iron levels, weight) to determine eligibility.
- **Phlebotomy Management**: The core interface for recording successful blood draws. Generates the new `BloodAsset` ID and sets its initial status to `COLLECTED`.
- **Shift-Sync Ledger**: A floating sidebar polling the backend (`/activity/shift-sync`) every 30 seconds to show what other nurses in the same facility are currently doing, preventing duplicate work and fostering coordination.
- **Inventory & Custody**: A localized view of all blood bags currently sitting at the collection facility before they are dispatched to the testing labs.

## 🛠 Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v3 (Styled with a dark, medical "Red/Slate" aesthetic)
- **Authentication**: Supabase Auth (HS256 JWTs) restricted strictly to `CLINICAL` role users.
- **Routing**: React Router DOM (Layout architecture separating nested `/collection` and `/clinical` routes)
- **HTTP Client**: Axios/Fetch wrapper (`apiClient.js`)

## 📂 Architecture
Scyther utilizes a traditional Sidebar Dashboard layout. 
- It communicates heavily with `bloodchain-core`'s `asset.service.ts` to log CustodyEvents.
- The `ShiftSyncLog.jsx` component provides real-time operational awareness.
