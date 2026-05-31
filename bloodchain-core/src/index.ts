// ─────────────────────────────────────────────────────
// Bloodchain Core — Server Entry Point
// The central API Gateway for the Bloodchain Ecosystem
// ─────────────────────────────────────────────────────

import express from "express";
import cors from "cors";
import { PORT, prisma } from "./config";
import { errorHandler } from "./middlewares/errorHandler";
import v1Router from "./routes";

const app = express();

// ─── Global Middleware ───────────────────────────────

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  /\.onrender\.com$/, // Accepts any Render frontend dynamically
  /\.vercel\.app$/   // If you end up using Vercel
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.some(o => typeof o === 'string' ? o === origin : o.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error('CORS blocked origin: ' + origin));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ────────────────────────────────────

app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "operational",
        service: "Bloodchain Core",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
    });
});

// ─── API v1 Routes ───────────────────────────────────

app.use("/api/v1", v1Router);

// ─── Error Handler (must be last) ────────────────────

app.use(errorHandler);

// ─── Start Server ────────────────────────────────────

const start = async () => {
    try {
        // Verify database connection
        await prisma.$connect();
        console.log("✅ Database connected");

        app.listen(PORT, () => {
            console.log(`
╔══════════════════════════════════════════════╗
║         BLOODCHAIN CORE — API GATEWAY        ║
╠══════════════════════════════════════════════╣
║  Status:  OPERATIONAL                        ║
║  Port:    ${String(PORT).padEnd(35)}║
║  API:     http://localhost:${String(PORT).padEnd(18)}║
║  Health:  http://localhost:${String(PORT)}/health${" ".repeat(Math.max(0, 11 - String(PORT).length))}║
╚══════════════════════════════════════════════╝
      `);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

start();
