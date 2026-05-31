// ─────────────────────────────────────────────────────
// Bloodchain Core — Activity Routes
// RBAC: Operational staff only
// ─────────────────────────────────────────────────────

import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/requireRole";
import { shiftSync } from "../controllers/activity.controller";

const router = Router();

// GET /activity/shift-sync — Operational staff only
router.get("/shift-sync", requireAuth, requireRole("LAB", "MEDICAL", "TRANSIT", "ADMIN"), shiftSync);

export default router;
