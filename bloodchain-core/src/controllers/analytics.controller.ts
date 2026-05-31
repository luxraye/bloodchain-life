// ─────────────────────────────────────────────────────
// Bloodchain Core — Analytics Controller
// Tremor-ready flat time-series endpoints
// ─────────────────────────────────────────────────────

import { Request, Response, NextFunction } from "express";
import * as analyticsService from "../services/analytics.service";
import { apiSuccess } from "../lib/apiResponse";

/**
 * GET /admin/wastage-trends
 * Returns blood wastage over time as flat objects for Tremor charts.
 *
 * Query params: days (default 30)
 *
 * Response format (Tremor BarChart/AreaChart):
 * [{ date: "2026-03-01", "O+": 12, "A-": 3, "Discarded": 15 }, ...]
 */
export const getWastageTrends = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const days = parseInt(req.query.days as string) || 30;
        const trends = await analyticsService.getWastageTrends(days);
        apiSuccess(res, trends);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /admin/wastage-by-facility
 * Returns wastage grouped by facility for Tremor grouped bar charts.
 *
 * Query params: days (default 30)
 */
export const getWastageByFacility = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const days = parseInt(req.query.days as string) || 30;
        const trends = await analyticsService.getWastageByFacility(days);
        apiSuccess(res, trends);
    } catch (error) {
        next(error);
    }
};
