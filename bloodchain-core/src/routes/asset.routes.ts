// ─────────────────────────────────────────────────────
// Bloodchain Core — Asset Routes
// RBAC: Role-scoped per endpoint
// ─────────────────────────────────────────────────────

import { Router } from "express";
import * as assetController from "../controllers/asset.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/requireRole";

const router = Router();
router.use(requireAuth);

// Donors viewing their own donations
router.get("/my-donations", requireRole("PUBLIC", "MEDICAL", "ADMIN"), assetController.getMyDonations);

// Operational staff: list, view, and trace assets
router.get("/", requireRole("LAB", "MEDICAL", "TRANSIT", "ADMIN"), assetController.getAssets);
router.get("/:id/custody", requireRole("LAB", "MEDICAL", "TRANSIT", "ADMIN"), assetController.getCustody);
router.get("/:id", requireRole("LAB", "MEDICAL", "TRANSIT", "ADMIN"), assetController.getAsset);

// Collection staff: create new blood assets
router.post("/", requireRole("MEDICAL", "ADMIN"), assetController.createAsset);

// Scan/status update (lab techs, couriers, medical, admin)
router.post("/scan", requireRole("LAB", "TRANSIT", "MEDICAL", "ADMIN"), assetController.scanAsset);

export default router;
