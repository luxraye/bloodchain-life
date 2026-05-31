# Sentinel — Institutional brief

## Purpose

Sentinel gives **regulators and national programme auditors** a Bloodchain-native console for reviewing structured compliance submissions from licensed blood establishments — without mixing regulatory workflow into hospital transfusion or lab LIS screens.

## Problem

Blood banks and NBTS must file periodic returns (inventory, wastage, hemovigilance, QMS evidence) to bodies such as **BMRA** and the **Ministry of Health**. Today these often arrive as email attachments with weak provenance. Instances provides cryptographically verifiable submissions; Sentinel is the national-blood-OS entry point for reviewers.

## Scope (in)

- Review queue for `SUBMITTED` instances
- Approve / flag / reject with notes
- Display submission JWT receipts and file hashes
- Template catalog visibility
- Demo seed for sales and training without Instances running

## Scope (out)

- Template authoring and tenant provisioning (Instances admin)
- Licensee draft editing (Instances licensee portal or API)
- Clinical transfusion (Transfuse), screening (Mars Lab), logistics (Scyther)

## Architecture

```
Licensee ──► Instances API ──► PostgreSQL (tenant-isolated)
                 ▲
                 │ Bearer API key
Regulator ──► Sentinel (Vite)
```

## Demo narrative

1. Open Sentinel → **Enter Console** (demo reviewer).
2. Command dashboard shows pending BMRA quarterly return from NBTS.
3. Review queue → open filing → approve or flag with CAPA notes.
4. Settings → link to full Instances console for template changes.

## Integration checklist

- [ ] Instances running with seeded BMRA tenant
- [ ] API key with `REVIEWER` or `TENANT_ADMIN` role
- [ ] `GET /api/v1/instances` patch from `instances-extract` merged to production Instances
- [ ] CORS: allow Sentinel origin on Instances if not same host
