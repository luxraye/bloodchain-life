// ─────────────────────────────────────────────────────
// Bloodchain Core — Logistics Controller
// GeoJSON endpoints for Voyager (MapLibre/Deck.gl)
// ─────────────────────────────────────────────────────

import { Request, Response, NextFunction } from "express";
import * as logisticsService from "../services/logistics.service";
import { apiSuccess } from "../lib/apiResponse";

/**
 * GET /admin/map-nodes
 * Returns all active facilities as a GeoJSON FeatureCollection (Point geometry).
 * MapLibre/Deck.gl consume this directly as a vector data source.
 */
export const getMapNodes = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const featureCollection = await logisticsService.getMapNodes();
        apiSuccess(res, featureCollection, {
            total: featureCollection.features.length,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /admin/transit-routes
 * Returns active dispatches as a GeoJSON FeatureCollection (LineString geometry).
 * Deck.gl uses the `status` property to color-code ambulance route arcs.
 */
export const getTransitRoutes = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const featureCollection = await logisticsService.getTransitRoutes();
        apiSuccess(res, featureCollection, {
            total: featureCollection.features.length,
        });
    } catch (error) {
        next(error);
    }
};
