# Azure: The Public Donor Portal

![Azure UI Overview - Placeholder]

**Azure** is the public-facing application of the Bloodchain Ecosystem. It acts as the primary acquisition channel for blood donors in Botswana, empowering citizens to register, track their health history, verify their identities, and schedule life-saving blood donations.

---

## 🌍 Role in the Bloodchain Ecosystem
While other Bloodchain apps are built for specialized programme staff, Azure is built strictly for the **general public (donors)**. It serves as the top of the funnel for national blood reserves, allowing the Ministry of Health to broadcast requests, educate the public, and reward loyal donors through a gamified trust system.

## ✨ Core Features
- **Donor Registration & Authentication**: Powered by Supabase Auth, donors can seamlessly register without needing a specialized Keycloak admin to provision them.
- **Trust Badge System**: A 3-Tier ranking system (`Bronze`, `Silver`, `Gold`). 
  - Donors self-upgrade to **Silver** by uploading identity documents (Omang / Medical PDFs) into Supabase Storage.
  - High Command reviews the uploaded documents to manually promote donors to **Gold**.
- **Donation Journey Tracking**: Donors can track the lifecycle of their donated blood—from collection to screening to eventual administration.
- **Health Metrics Dashboard**: Visualizations of historical blood pressure, hemoglobin levels, and next eligible donation dates.
- **Dynamic Scheduling**: Users can find nearby donation centers and book time slots.

## Run locally

```bash
yarn dev:azure
```

- **http://localhost:5177** — demo donor when Supabase is not configured
- **http://localhost:5177?guest=1** — instant demo from demo hub

See `docs/Azure-Institutional-Brief.md`.

## 🛠 Tech Stack
- **Framework**: React 19 + Vite (PWA)
- **Styling**: Tailwind + `@bloodchain/ui` — dark national chrome, light donor content well, cyan accent
- **State & Data Fetching**: React Hooks, Fetch API (`apiClient.js`)
- **Authentication**: Supabase JS Client (`@supabase/supabase-js`)
- **Routing**: React Router DOM v6
- **Data Visualization**: Recharts
- **Icons**: Lucide React

## 📂 Architecture
Azure utilizes a tab-based navigation layout (`TABS.HOME`, `TABS.HISTORY`, `TABS.REQUEST`, `TABS.PROFILE`).
- `src/App.jsx` handles core routing and state management.
- `src/services/api.js` connects to the `bloodchain-core` Express API for donor actions.
- `src/components/TrustBadge.jsx` handles direct Supabase Storage uploads for user verification docs.
