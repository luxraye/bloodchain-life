import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/requireRole";
import { getStudy, listStudies } from "../controllers/research.controller";

const router = Router();

const RESEARCH_ROLES = [
  "RESEARCH_PI",
  "RESEARCH_COORDINATOR",
  "RESEARCH",
  "ETHICS_READ",
  "ADMIN",
  "SUPER_ADMIN",
];

router.get("/studies", requireAuth, requireRole(...RESEARCH_ROLES), listStudies);
router.get("/studies/:id", requireAuth, requireRole(...RESEARCH_ROLES), getStudy);

export default router;
