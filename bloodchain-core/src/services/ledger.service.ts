// ─────────────────────────────────────────────────────
// Bloodchain Core — Ledger Service
// TanStack Table-ready server-side pagination/filtering
// ─────────────────────────────────────────────────────

import { prisma } from "../config";
import { Prisma } from "@prisma/client";

export interface LedgerQuery {
    pageIndex: number;    // 0-based for TanStack
    pageSize: number;
    sortBy?: string;      // column name
    sortOrder?: "asc" | "desc";
    filterAction?: string;
    filterRole?: string;
    filterFacility?: string;
    dateFrom?: string;
    dateTo?: string;
}

export interface LedgerResult {
    data: Record<string, unknown>[];
    meta: {
        totalRowCount: number;
        pageCount: number;
        pageIndex: number;
        pageSize: number;
    };
}

export const getGlobalLedger = async (query: LedgerQuery): Promise<LedgerResult> => {
    const { pageIndex, pageSize, sortBy, sortOrder, filterAction, filterRole, filterFacility, dateFrom, dateTo } = query;

    // Build Prisma where clause
    const where: Prisma.ActionLogWhereInput = {};

    if (filterAction) where.actionPerformed = { contains: filterAction, mode: "insensitive" };
    if (filterRole) where.userRole = filterRole;
    if (filterFacility) where.facility = { contains: filterFacility, mode: "insensitive" };

    if (dateFrom || dateTo) {
        where.createdAt = {
            ...(dateFrom && { gte: new Date(dateFrom) }),
            ...(dateTo && { lte: new Date(dateTo) }),
        };
    }

    // Build sort — default to createdAt desc
    const validSortColumns = ["createdAt", "actionPerformed", "userName", "userRole", "facility"];
    const orderByColumn = validSortColumns.includes(sortBy ?? "") ? sortBy! : "createdAt";
    const orderByDir = sortOrder === "asc" ? "asc" : "desc";

    const [rows, totalRowCount] = await Promise.all([
        prisma.actionLog.findMany({
            where,
            orderBy: { [orderByColumn]: orderByDir },
            skip: pageIndex * pageSize,
            take: pageSize,
            include: {
                user: {
                    select: { id: true, email: true, role: true },
                },
            },
        }),
        prisma.actionLog.count({ where }),
    ]);

    // Flatten for TanStack Table consumption
    const data = rows.map((row) => ({
        id: row.id,
        assetId: row.assetId,
        actionPerformed: row.actionPerformed,
        userId: row.userId,
        userName: row.userName,
        userRole: row.userRole,
        userEmail: row.user.email,
        facility: row.facility,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    }));

    return {
        data,
        meta: {
            totalRowCount,
            pageCount: Math.ceil(totalRowCount / pageSize),
            pageIndex,
            pageSize,
        },
    };
};
