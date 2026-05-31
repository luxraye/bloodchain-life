import { prisma } from "../config";

export interface ShiftSyncEntry {
    id: string;
    assetId: string | null;
    actionPerformed: string;
    userName: string;
    userRole: string;
    facility: string;
    createdAt: Date;
}

/**
 * Returns the last 50 ActionLog entries from today
 * that match the requesting user's role AND facility.
 */
export const getShiftSync = async (userRole: string, facility: string): Promise<ShiftSyncEntry[]> => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const logs = await prisma.actionLog.findMany({
        where: {
            userRole,
            facility,
            createdAt: { gte: todayStart },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
            id: true,
            assetId: true,
            actionPerformed: true,
            userName: true,
            userRole: true,
            facility: true,
            createdAt: true,
        },
    });

    return logs;
};

/**
 * Write a single ActionLog entry.
 * Called from asset.service.ts on every scan/status change.
 */
export const writeActionLog = async (data: {
    assetId?: string;
    actionPerformed: string;
    userId: string;
    userName: string;
    userRole: string;
    facility: string;
}): Promise<void> => {
    await prisma.actionLog.create({ data });
};
