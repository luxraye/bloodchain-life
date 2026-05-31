// ─────────────────────────────────────────────────────
// Bloodchain Core — Admin Controller
// Request/Response handling for admin endpoints
// ─────────────────────────────────────────────────────

import { Request, Response, NextFunction } from "express";
import * as adminService from "../services/admin.service";
import { apiSuccess, apiError } from "../lib/apiResponse";

// ─── POST /users — Provision User ────────────────────

export const provisionUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, name, role, facilityId } = req.body;

        if (!email || !name || !role) {
            apiError(res, "Missing required fields: email, name, role", 400);
            return;
        }

        const user = await adminService.createUser({ email, name, role, facilityId });
        apiSuccess(res, user, undefined, 201);
    } catch (error) {
        next(error);
    }
};

// ─── GET /users — List Users ─────────────────────────

export const listUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { role, page, limit } = req.query;
        const p = parseInt(page as string) || 1;
        const l = parseInt(limit as string) || 50;

        const { users, total } = await adminService.listUsers(role as string | undefined, p, l);
        apiSuccess(res, users, { page: p, limit: l, total });
    } catch (error) {
        next(error);
    }
};

// ─── DELETE /users/:id — Remove User ─────────────────

export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await adminService.deleteUser(req.params.id as string);
        apiSuccess(res, { message: "User deleted" });
    } catch (error) {
        next(error);
    }
};

// ─── GET /stats — Dashboard Metrics ──────────────────

export const getStats = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const stats = await adminService.getStats();
        apiSuccess(res, stats);
    } catch (error) {
        next(error);
    }
};

// ─── PATCH /users/:id — Update User ─────────────────

export const updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = req.params.id as string;
        const { trustLevel, verificationDocUrl, status, name, facilityId } = req.body;
        const user = await adminService.updateUser(id, { trustLevel, verificationDocUrl, status, name, facilityId });
        apiSuccess(res, user);
    } catch (error) {
        next(error);
    }
};

// ─── GET /ledger — Full Action Log (time-series) ─────

export const getLedger = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { page, limit, dateFrom, dateTo } = req.query;
        const p = parseInt(page as string) || 1;
        const l = parseInt(limit as string) || 50;

        const { logs, total } = await adminService.getLedger(
            p, l,
            dateFrom as string | undefined,
            dateTo as string | undefined,
        );
        apiSuccess(res, logs, { page: p, limit: l, total });
    } catch (error) {
        next(error);
    }
};

// ─── GET /wastage-trends — Discarded assets over time ─

export const getWastageTrends = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const days = parseInt(req.query.days as string) || 30;
        const trends = await adminService.getWastageTrends(days);
        apiSuccess(res, trends);
    } catch (error) {
        next(error);
    }
};
