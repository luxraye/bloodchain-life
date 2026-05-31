// ─────────────────────────────────────────────────────
// Bloodchain Core — Activity Controller
// ─────────────────────────────────────────────────────

import { Request, Response, NextFunction } from "express";
import * as activityService from "../services/activity.service";
import { prisma } from "../config";
import { getAppRole } from "../middlewares/requireAuth";
import { apiSuccess, apiError } from "../lib/apiResponse";

/**
 * GET /activity/shift-sync
 * Returns today's ActionLog entries for the requesting user's role + facility.
 * Now correctly reads from req.auth (JWT payload) and resolves the DB profile.
 */
export const shiftSync = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const supabaseId = req.auth?.sub;
        if (!supabaseId) {
            apiError(res, "Unauthorized", 401);
            return;
        }

        // Resolve the DB user to get role and facility
        const dbUser = await prisma.user.findFirst({
            where: { supabaseId },
        });

        const role = dbUser?.role ?? getAppRole(req.auth!);
        const facility = dbUser?.facilityId ?? "";

        const logs = await activityService.getShiftSync(role, facility);

        apiSuccess(res, logs, { total: logs.length });
    } catch (e) {
        next(e);
    }
};
