// ─────────────────────────────────────────────────────
// Bloodchain Core — RBAC Middleware
// Enforces Role-Based Access Control after JWT auth.
// Usage: router.use(requireAuth, requireRole("ADMIN", "LAB"));
// ─────────────────────────────────────────────────────

import { Request, Response, NextFunction } from "express";
import { getAppRole } from "./requireAuth";

/**
 * Factory that returns Express middleware restricting access
 * to users whose app_metadata.role is in the allowedRoles list.
 * Must be mounted AFTER requireAuth so that req.auth is populated.
 */
export const requireRole = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.auth) {
            res.status(401).json({
                success: false,
                error: "Authentication required",
            });
            return;
        }

        const userRole = getAppRole(req.auth);

        if (!allowedRoles.includes(userRole)) {
            res.status(403).json({
                success: false,
                error: `Access denied. Required role: [${allowedRoles.join(", ")}]. Your role: ${userRole}`,
            });
            return;
        }

        next();
    };
};
