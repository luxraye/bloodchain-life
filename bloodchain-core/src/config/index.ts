// ─────────────────────────────────────────────────────
// Bloodchain Core — Configuration
// ─────────────────────────────────────────────────────

import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

// Prisma Client Singleton
const prisma = new PrismaClient();

const PORT = parseInt(process.env.PORT || "4000", 10);
const DATABASE_URL = process.env.DATABASE_URL || "";
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET || "";

const requiredEnv: Array<[string, string]> = [
    ["DATABASE_URL", DATABASE_URL],
    ["SUPABASE_URL", SUPABASE_URL],
    ["SUPABASE_SERVICE_ROLE_KEY", SUPABASE_SERVICE_ROLE_KEY],
];

const missingEnv = requiredEnv.filter(([, value]) => !value).map(([key]) => key);
if (missingEnv.length > 0) {
    throw new Error(
        `[config] Missing required environment variables: ${missingEnv.join(", ")}`
    );
}

export { prisma, PORT, DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_JWT_SECRET };
