// ─────────────────────────────────────────────────────
// Bloodchain Core — JWT Auth Middleware
// Supports Supabase ES256 (JWKS) and HS256 (secret string)
// ─────────────────────────────────────────────────────

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { SUPABASE_JWT_SECRET, SUPABASE_URL } from "../config";

export interface AuthPayload {
    sub: string;
    email?: string;
    role?: string;
    app_metadata?: { role?: string };
    user_metadata?: Record<string, unknown>;
    [key: string]: unknown;
}

declare global {
    namespace Express {
        interface Request {
            auth?: AuthPayload;
        }
    }
}

export function getAppRole(auth: AuthPayload): string {
    return (auth.app_metadata?.role ?? "PUBLIC").toUpperCase();
}

// ── JWKS cache ────────────────────────────────────────
let jwksPem: string | null = null;

async function loadJwksPem(): Promise<string> {
    if (jwksPem) return jwksPem;
    const url = `${SUPABASE_URL}/auth/v1/.well-known/jwks.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`JWKS fetch failed: ${res.status}`);
    const body = await res.json() as { keys: object[] };
    if (!body.keys?.length) throw new Error("Empty JWKS response");
    const keyObj = crypto.createPublicKey({ key: body.keys[0], format: "jwk" });
    jwksPem = keyObj.export({ type: "spki", format: "pem" }) as string;
    console.log("[requireAuth] Loaded ES256 public key from Supabase JWKS");
    return jwksPem;
}

const DEV_BYPASS = "dev-bypass";

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ success: false, error: "Missing Authorization header" });
        return;
    }

    const token = authHeader.slice(7);

    if (process.env.NODE_ENV === "development" && token === DEV_BYPASS) {
        req.auth = { sub: "dev", email: "dev@bloodchain.local", app_metadata: { role: "ADMIN" } };
        next();
        return;
    }

    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || typeof decoded === "string") {
        res.status(401).json({ success: false, error: "Malformed token" });
        return;
    }

    const alg = (decoded.header.alg ?? "ES256") as jwt.Algorithm;
    const isAsymmetric = alg.startsWith("ES") || alg.startsWith("RS");

    const done = (err: jwt.VerifyErrors | null, payload: jwt.JwtPayload | string | undefined) => {
        if (err || !payload) {
            console.error(`[requireAuth] Verify failed (${alg}):`, err?.message);
            res.status(401).json({ success: false, error: "Invalid or expired token" });
            return;
        }
        req.auth = payload as AuthPayload;
        next();
    };

    if (isAsymmetric) {
        loadJwksPem()
            .then((pem) => jwt.verify(token, pem, { algorithms: [alg] }, done))
            .catch((err) => {
                console.error("[requireAuth] JWKS error:", err.message);
                res.status(503).json({ success: false, error: "Auth key fetch failed" });
            });
    } else {
        if (!SUPABASE_JWT_SECRET) {
            res.status(503).json({ success: false, error: "SUPABASE_JWT_SECRET not configured" });
            return;
        }
        jwt.verify(token, SUPABASE_JWT_SECRET, { algorithms: [alg] }, done);
    }
};
