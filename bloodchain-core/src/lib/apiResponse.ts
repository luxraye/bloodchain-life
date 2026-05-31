// ─────────────────────────────────────────────────────
// Bloodchain Core — Standardized API Response Utility
// All controllers should use these helpers to ensure
// consistent JSON output for Tremor/TanStack consumers.
// ─────────────────────────────────────────────────────

import { Response } from "express";

export interface ApiMeta {
    page?: number;
    limit?: number;
    total?: number;
    roles?: string[];
    [key: string]: unknown;
}

/**
 * Send a standardized success response.
 * Shape: { success: true, data: T, meta?: ApiMeta }
 */
export function apiSuccess<T>(
    res: Response,
    data: T,
    meta?: ApiMeta,
    statusCode: number = 200
): void {
    const body: Record<string, unknown> = { success: true, data };
    if (meta) body.meta = meta;
    res.status(statusCode).json(body);
}

/**
 * Send a standardized error response.
 * Shape: { success: false, error: string, meta?: ApiMeta }
 */
export function apiError(
    res: Response,
    error: string,
    statusCode: number = 400,
    meta?: ApiMeta
): void {
    const body: Record<string, unknown> = { success: false, error };
    if (meta) body.meta = meta;
    res.status(statusCode).json(body);
}
