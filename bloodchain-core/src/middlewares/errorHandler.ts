// ─────────────────────────────────────────────────────
// Bloodchain Core — Error Handling Middleware
// ─────────────────────────────────────────────────────

import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
    statusCode?: number;
}

export const errorHandler = (
    err: AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    console.error(`[ERROR] ${err.message}`);
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === "development" && { meta: { stack: err.stack } }),
    });
};

// Helper to create typed errors with status codes
export class ApiError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.name = "ApiError";
    }
}
