// ─────────────────────────────────────────────────────
// Bloodchain Core — Ledger Controller
// TanStack Table-ready server-side pagination endpoint
// ─────────────────────────────────────────────────────

import { Request, Response, NextFunction } from "express";
import * as ledgerService from "../services/ledger.service";

/**
 * GET /admin/ledger
 * Global audit ledger with server-side pagination, sorting, and filtering.
 *
 * Query params:
 *   pageIndex (default 0), pageSize (default 100),
 *   sortBy, sortOrder (asc|desc),
 *   filterAction, filterRole, filterFacility,
 *   dateFrom, dateTo (ISO strings)
 *
 * Response:
 * {
 *   "success": true,
 *   "data": [...],
 *   "meta": { "totalRowCount": 1250, "pageCount": 13, "pageIndex": 0, "pageSize": 100 }
 * }
 */
export const getGlobalLedger = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {
            pageIndex, pageSize,
            sortBy, sortOrder,
            filterAction, filterRole, filterFacility,
            dateFrom, dateTo,
        } = req.query;

        const result = await ledgerService.getGlobalLedger({
            pageIndex: parseInt(pageIndex as string) || 0,
            pageSize: parseInt(pageSize as string) || 100,
            sortBy: sortBy as string | undefined,
            sortOrder: sortOrder as "asc" | "desc" | undefined,
            filterAction: filterAction as string | undefined,
            filterRole: filterRole as string | undefined,
            filterFacility: filterFacility as string | undefined,
            dateFrom: dateFrom as string | undefined,
            dateTo: dateTo as string | undefined,
        });

        // TanStack-specific response: data + meta with exact shape expected
        res.status(200).json({
            success: true,
            data: result.data,
            meta: result.meta,
        });
    } catch (error) {
        next(error);
    }
};
