import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/requireRole";
import { listExceptions, listPatients, patchException } from "../controllers/chronicRegistry.controller";

const router = Router();

const ROLES = [
  "CHRONIC_CARE_COORDINATOR",
  "MEDICAL",
  "NURSE",
  "ADMIN",
  "SUPER_ADMIN",
];

router.get("/patients", requireAuth, requireRole(...ROLES), listPatients);
router.get("/exceptions", requireAuth, requireRole(...ROLES), listExceptions);
router.patch("/exceptions/:id", requireAuth, requireRole(...ROLES), patchException);

export default router;
