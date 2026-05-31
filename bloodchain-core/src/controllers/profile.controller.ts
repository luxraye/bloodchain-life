// ─────────────────────────────────────────────────────
// Bloodchain Core — Profile Controller
// ─────────────────────────────────────────────────────

import { Request, Response, NextFunction } from "express";
import * as profileService from "../services/profile.service";
import { apiSuccess, apiError } from "../lib/apiResponse";

// GET /profile/me
export const getMyProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const sub = req.auth?.sub;
        if (!sub) { apiError(res, "Unauthorized", 401); return; }

        const user = await profileService.getOrCreateProfile(sub, {
            email: req.auth?.email,
            name: (req.auth?.user_metadata as any)?.name || (req.auth?.email as string),
            role: req.auth?.app_metadata?.role,
        });
        apiSuccess(res, user);
    } catch (e) { next(e); }
};

// PATCH /profile/me
export const updateMyProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const sub = req.auth?.sub;
        if (!sub) { apiError(res, "Unauthorized", 401); return; }

        // Auto-create if missing, then update
        await profileService.getOrCreateProfile(sub, {
            email: req.auth?.email,
            name: (req.auth?.user_metadata as any)?.name || (req.auth?.email as string),
            role: req.auth?.app_metadata?.role,
        });

        const {
            name,
            bloodType,
            facilityId,
            age,
            gender,
            region,
            medicalConditions,
            trustLevel,
            verificationDocUrl,
        } = req.body;
        const user = await profileService.updateProfile(sub, {
            name,
            bloodType,
            facilityId,
            age,
            gender,
            region,
            medicalConditions,
            trustLevel,
            verificationDocUrl,
        });
        apiSuccess(res, user);
    } catch (e) { next(e); }
};
