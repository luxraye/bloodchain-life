import { Router } from "express";
import { register } from "../controllers/register.controller";

const router = Router();

// Public — no auth required
router.post("/", register);

export default router;
