# Bloodchain — Decision Log
*Major decisions with rationale. Prevents re-litigating settled questions.*  
*Format: Date · Decision · Rationale · Alternatives considered*

---

## 2026-05-08

### DEC-001 — Deployment target: Render (stay)
**Decision:** Keep Render as the deployment platform. Do not re-architect for other providers.  
**Rationale:** `render.yaml` is fully written and covers all seven services. Free tier is sufficient for pilot/demo. Migrating would cost time with no product benefit at this stage.  
**Alternatives considered:** Railway, Fly.io, AWS ECS, DigitalOcean App Platform.  
**Revisit when:** ARR exceeds ~$50K and uptime SLAs require guaranteed resources.

---

### DEC-002 — Auth: Supabase (stay, no further changes)
**Decision:** Supabase remains the auth provider. No further auth architecture changes until multi-tenancy requires re-evaluation.  
**Rationale:** Migration from Keycloak is complete. All apps aligned. Reopening auth is a major disruption with no commercial upside at this stage.  
**Alternatives considered:** Auth0, Clerk, rolling our own JWT service.  
**Revisit when:** Multi-tenant architecture requires per-org auth isolation.

---

### DEC-003 — Fabric integration is not a blocker for first revenue
**Decision:** Hyperledger Fabric will not be required for the first customer contract. The Postgres-backed audit ledger is sufficient for pilot.  
**Rationale:** Fabric integration is a differentiator but the feature flag infrastructure is already designed. Blocking revenue on a complex infrastructure addition would be the wrong trade-off.  
**Alternatives considered:** Shipping Fabric before first pitch.  
**Revisit when:** A buyer specifically requires on-chain proof as a contract condition.

---

### DEC-004 — Revenue model: Annual SaaS contract (government/institutional)
**Decision:** Lead commercial conversations with a fixed annual SaaS fee per institution. Starting price range $15,000–$25,000 USD/year for national-scale deployment.  
**Rationale:** Per-unit transaction fees are politically sensitive in public health. Per-module licensing adds sales complexity. A flat annual fee is the simplest structure for a government procurement conversation.  
**Alternatives considered:** Per-unit fees, per-module licensing, usage-based pricing.  
**Revisit when:** Expanding to private hospitals where per-module pricing may be more appropriate.

---

### DEC-005 — TypeScript migration: incremental, not big-bang
**Decision:** Convert Scyther and Voyager JS files to TypeScript only when they are touched for other reasons. No dedicated migration sprint.  
**Rationale:** Big-bang migrations create churn with no user-visible benefit. Incremental conversion keeps the codebase moving in the right direction without blocking feature work.  
**Alternatives considered:** Dedicated 1-week migration sprint.

---

### DEC-006 — Testing strategy: integration-first
**Decision:** Prioritize integration tests against a real test database over unit tests.  
**Rationale:** Bloodchain's value is in end-to-end clinical flows (donor → collection → lab → logistics → audit). Unit tests alone are insufficient evidence of correctness. Integration tests catch the bugs that matter.  
**Alternatives considered:** Unit-test-first TDD, no automated tests (just manual smoke runs).
