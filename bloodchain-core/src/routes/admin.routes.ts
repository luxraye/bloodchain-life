// ─────────────────────────────────────────────────────
// Bloodchain Core — Admin Routes
// Casbin-Ready RBAC: Role-scoped per endpoint group
// ─────────────────────────────────────────────────────

import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import * as logisticsController from "../controllers/logistics.controller";
import * as ledgerController from "../controllers/ledger.controller";
import * as analyticsController from "../controllers/analytics.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

// All admin routes require valid JWT
router.use(requireAuth);

// ─── User Management (ADMIN / SUPER_ADMIN) ───────────

router.post("/users", requireRole("ADMIN", "SUPER_ADMIN"), adminController.provisionUser);
router.get("/users", requireRole("ADMIN", "SUPER_ADMIN"), adminController.listUsers);
router.delete("/users/:id", requireRole("ADMIN", "SUPER_ADMIN"), adminController.deleteUser);
router.patch("/users/:id", requireRole("ADMIN", "SUPER_ADMIN"), adminController.updateUser);
router.get("/stats", requireRole("ADMIN", "SUPER_ADMIN"), adminController.getStats);

// ─── Mapping / Logistics (LOGISTICS_COMMAND / SUPER_ADMIN) ───

router.get("/map-nodes", requireRole("LOGISTICS_COMMAND", "SUPER_ADMIN", "ADMIN"), logisticsController.getMapNodes);
router.get("/transit-routes", requireRole("LOGISTICS_COMMAND", "SUPER_ADMIN", "ADMIN"), logisticsController.getTransitRoutes);

// ─── Ledger / Audit (SUPER_ADMIN / MOH_AUDITOR) ─────

router.get("/ledger", requireRole("SUPER_ADMIN", "MOH_AUDITOR", "ADMIN"), ledgerController.getGlobalLedger);

// ─── Analytics / Wastage (SUPER_ADMIN / MOH_AUDITOR) ─

router.get("/wastage-trends", requireRole("SUPER_ADMIN", "MOH_AUDITOR", "ADMIN"), analyticsController.getWastageTrends);
router.get("/wastage-by-facility", requireRole("SUPER_ADMIN", "MOH_AUDITOR", "ADMIN"), analyticsController.getWastageByFacility);

export default router;
