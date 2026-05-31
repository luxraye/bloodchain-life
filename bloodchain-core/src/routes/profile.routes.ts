import { Router } from "express";
import * as profileController from "../controllers/profile.controller";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();
router.use(requireAuth);

router.get("/me", profileController.getMyProfile);
router.patch("/me", profileController.updateMyProfile);

export default router;
