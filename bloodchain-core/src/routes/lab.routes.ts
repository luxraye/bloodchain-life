import { Router } from 'express';
import * as labController from '../controllers/lab.controller';
import { requireAuth } from '../middlewares/requireAuth';
import { requireRole } from '../middlewares/requireRole';

const router = Router();

// Apply Authentication to all Lab Routes
router.use(requireAuth);

// Enforce RBAC using roles that exist across schema and provisioning.
router.use(requireRole("LAB", "SUPER_ADMIN", "ADMIN"));

// Endpoints
router.get("/scan/:code", labController.scanUnit);
router.post("/tti-screen", labController.ttiScreen);
router.post("/split", labController.splitComponent);

export default router;
