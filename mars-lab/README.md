# Mars-lab: Screening & Pathology Suite

![Mars-lab UI Overview - Placeholder]

**Mars-lab** is the rigorous testing and validation layer of the Bloodchain Ecosystem. It is securely operated by **Laboratory Technicians and Pathologists** at centralized screening facilities.

---

## 🌍 Role in the Bloodchain Ecosystem
Blood collected in `Scyther` cannot be released for hospital use until it passes stringent tests. Mars-lab is where the magic happens. Lab technicians log in to scan incoming transit boxes, run serology profiles (HIV, Hep B/C, Syphilis), confirm blood typing (ABO/Rh), and ultimately `RELEASE` or `DISCARD` units.

## ✨ Core Features
- **Asset Scanning Interface**: Rapid scan interfaces to intake units that have arrived from collection clinics.
- **Testing & Serology Workflows**: Specialized forms to input pathology results for quarantined blood units.
- **Status Toggling (`QUARANTINE` → `RELEASED` / `DISCARDED`)**: Mars-lab acts as the gatekeeper. Blood that fails screening is perm-banned (Discarded), while safe blood is Released into the national safe inventory.
- **Shift-Sync Ledger**: Real-time sidebar polling to see which technician is currently testing which batch of blood, minimizing overlap in high-stress environments.
- **Cold Chain Verification**: Ensure that the incoming temperature logs of transit units meet acceptable medical thresholds.

## 🛠 Tech Stack
- **Framework**: React 18 + Vite + TypeScript (`.tsx`)
- **Styling**: Tailwind CSS v3 (Cyan/Teal aesthetic tailored for sterile, high-focus laboratory environments)
- **Authentication**: Supabase Auth restricted strictly to the `LAB` role.
- **Routing**: React Router DOM (Sidebar layout)

## 📂 Architecture
Mars-lab focuses heavily on rapid data-entry.
- Built using **TypeScript** for strict state management of medical data.
- Leverages the same `ShiftSyncLog.tsx` as Scyther, styled to match the Cyan lab theme.
- Integrates heavily with the `PATCH /api/v1/assets/:id/status` pipeline to finalize blood unit viability.
