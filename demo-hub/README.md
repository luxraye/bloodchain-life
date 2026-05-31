# Bloodchain Demo Hub

Public introduction to **Bloodchain** — project by **Bloodchain Botswana**, incubated by **Unipod at the University of Botswana**.

**Theme:** Light sky-blue palette suited to hospital / clinical demos.

## Content

- Copy and mailto helpers: [`src/content/site.js`](src/content/site.js) — contact person, email, phone; optional `VITE_CONTACT_EMAIL` overrides email in deploy env.
- App grid metadata: [`src/content/apps.js`](src/content/apps.js).

## Branding

Use [`public/branding/logo.png`](public/branding/logo.png) and sync copies to other apps’ `public/branding/` (see [`public/branding/README.md`](public/branding/README.md)).

## Build

```bash
yarn install
yarn build
```

Output: `dist/`.
