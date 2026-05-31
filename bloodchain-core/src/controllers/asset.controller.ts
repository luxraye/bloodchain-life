// ─────────────────────────────────────────────────────
// Bloodchain Core — Asset Controller
// ─────────────────────────────────────────────────────

import { Request, Response, NextFunction } from "express";
import { AssetStatus } from "@prisma/client";
import * as assetService from "../services/asset.service";
import { apiSuccess, apiError } from "../lib/apiResponse";

// GET /my-donations
export const getMyDonations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.auth?.sub;
        if (!userId) { apiError(res, "Unauthorized", 401); return; }
        const assets = await assetService.getMyDonations(userId);
        apiSuccess(res, assets, { total: assets.length });
    } catch (e) { next(e); }
};

// GET /
export const getAssets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const status = req.query.status as AssetStatus | undefined;
        const assets = await assetService.getAssets(status);
        apiSuccess(res, assets, { total: assets.length });
    } catch (e) { next(e); }
};

// GET /:id
export const getAsset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const asset = await assetService.getAssetWithCustody(String(req.params.id));
        apiSuccess(res, asset);
    } catch (e) { next(e); }
};

// GET /:id/custody
export const getCustody = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const asset = await assetService.getAssetWithCustody(String(req.params.id));
        apiSuccess(res, {
            custodyEvents: asset.custodyEvents,
            asset: { id: asset.id, bloodType: asset.bloodType, status: asset.status, donor: asset.donor },
        });
    } catch (e) { next(e); }
};

// POST /
export const createAsset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { donorId, bloodType, location, latitude, longitude } = req.body;
        if (!donorId || !bloodType || !location) {
            apiError(res, "Missing required fields: donorId, bloodType, location", 400);
            return;
        }
        const asset = await assetService.createAsset({
            donorId, bloodType, location, latitude, longitude,
            actorSupabaseId: req.auth?.sub ?? "",
        });
        apiSuccess(res, asset, undefined, 201);
    } catch (e) { next(e); }
};

// POST /scan
export const scanAsset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { assetId, newStatus, location, notes, latitude, longitude } = req.body;
        if (!assetId || !newStatus || !location) {
            apiError(res, "Missing required fields: assetId, newStatus, location", 400);
            return;
        }
        const asset = await assetService.scanAsset({
            assetId, newStatus, location, notes, latitude, longitude,
            actorSupabaseId: req.auth?.sub ?? "",
        });
        apiSuccess(res, asset);
    } catch (e) { next(e); }
};
