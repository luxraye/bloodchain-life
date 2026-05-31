import { Router } from "express";
import adminRoutes from "./admin.routes";
import assetRoutes from "./asset.routes";
import profileRoutes from "./profile.routes";
import registerRoute from "./register.routes";
import activityRoutes from "./activity.routes";
import labRoutes from "./lab.routes";
import researchRoutes from "./research.routes";
import chronicRegistryRoutes from "./chronicRegistry.routes";

const router = Router();

router.use("/admin", adminRoutes);
router.use("/assets", assetRoutes);
router.use("/profile", profileRoutes);
router.use("/register", registerRoute);
router.use("/activity", activityRoutes);
router.use("/lab", labRoutes);
router.use("/research", researchRoutes);
router.use("/chronic-registry", chronicRegistryRoutes);

export default router;
