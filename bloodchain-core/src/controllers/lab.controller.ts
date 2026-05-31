import { Request, Response } from 'express';
import { prisma } from '../config';
import { apiSuccess, apiError } from '../lib/apiResponse';

/**
 * GET /api/v1/lab/scan/:code
 * Looks up a blood unit by UUID or ISBT-128 barcode.
 * Deeply joins the TTIScreening record for fast React wedge scanner focus.
 */
export const scanUnit = async (req: Request, res: Response): Promise<void> => {
    try {
        const code = req.params.code as string;

        // In a full ISBT-128 implementation, you'd parse the code first.
        // For now, we query exact match on the asset ID.
        const unit = await prisma.bloodAsset.findUnique({
            where: { id: code },
            include: {
                ttiScreening: true,
                parentUnit: true,
                childUnits: true,
                donor: {
                    select: {
                        id: true,
                        name: true,
                        bloodType: true
                    }
                }
            }
        });

        if (!unit) {
            return apiError(res, `Unit not found for barcode: ${code}`, 404);
        }

        return apiSuccess(res, unit);
    } catch (error: any) {
        console.error('[scanUnit] Error:', error.message);
        return apiError(res, 'Internal server error during barcode scan', 500);
    }
};

/**
 * POST /api/v1/lab/tti-screen
 * Records Pathogen Screening results and mutates Asset status if reactive.
 */
export const ttiScreen = async (req: Request, res: Response): Promise<void> => {
    try {
        const { unitId, hiv_1_2, hbsag, hcv, syphilis } = req.body;
        const authPayload = (req as any).auth;
        const technicianId = authPayload?.sub;

        if (!technicianId) {
            return apiError(res, 'Authentication required for TTI screening', 401);
        }

        const isReactive = [hiv_1_2, hbsag, hcv, syphilis].some(val => val === 'REACTIVE');

        // Use a transaction to ensure atomic saves
        const result = await prisma.$transaction(async (tx: any) => {
            // Upsert the screening record
            const screening = await tx.tTIScreening.upsert({
                where: { assetId: unitId },
                update: {
                    hiv_1_2,
                    hbsag,
                    hcv,
                    syphilis,
                    technicianId
                },
                create: {
                    assetId: unitId,
                    hiv_1_2,
                    hbsag,
                    hcv,
                    syphilis,
                    technicianId
                }
            });

            // If REACTIVE, automatically flag the Blood Unit to REACTIVE_DISCARD (Failsafe)
            const unitUpdateData: any = {};
            if (isReactive) {
                unitUpdateData.status = 'REACTIVE_DISCARD';
            } else if ([hiv_1_2, hbsag, hcv, syphilis].every(val => val === 'NEGATIVE')) {
                // Determine if we should mark it safe if all negatives.
                // Assuming status goes to QUARANTINE or TESTING then RELEASED.
               // We will keep it simple here, but log logic explicitly.
            }

            let updatedUnit = null;
            if (Object.keys(unitUpdateData).length > 0) {
                updatedUnit = await tx.bloodAsset.update({
                    where: { id: unitId },
                    data: unitUpdateData
                });
            } else {
                updatedUnit = await tx.bloodAsset.findUnique({ where: { id: unitId } });
            }

            return { screening, unit: updatedUnit };
        });

        return apiSuccess(res, result);
    } catch (error: any) {
        console.error('[ttiScreen] Error:', error.message);
        return apiError(res, 'Internal server error processing TTI screening', 500);
    }
};

/**
 * POST /api/v1/lab/split
 * The Component Splitting Engine (Lineage Router)
 * Takes a parent Whole Blood unit, marks it PROCESSED_SPLIT, and generates RBC, FFP, PLATELETS.
 */
export const splitComponent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { parentUnitId } = req.body;

        const result = await prisma.$transaction(async (tx: any) => {
            // Fetch parent unit to ensure it exists and is WHOLE_BLOOD
            const parent = await tx.bloodAsset.findUnique({
                where: { id: parentUnitId }
            });

            if (!parent) {
                throw new Error('Parent unit not found');
            }

            if (parent.componentType !== 'WHOLE_BLOOD') {
                throw new Error('Can only split WHOLE_BLOOD component types');
            }

            if (parent.status === 'PROCESSED_SPLIT' || parent.status === 'REACTIVE_DISCARD') {
                throw new Error(`Cannot split a unit with status: ${parent.status}`);
            }

            // 1. Mark parent as PROCESSED_SPLIT
            const updatedParent = await tx.bloodAsset.update({
                where: { id: parentUnitId },
                data: { status: 'PROCESSED_SPLIT' }
            });

            // 2. Spawn 3 children inheriting relevant traceability data
            const childrenPayloads = ['RBC', 'FFP', 'PLATELETS'].map(compType => ({
                donorId: parent.donorId,
                bloodType: parent.bloodType,
                status: 'COLLECTED' as any, // initial status for children or inherit SAFE? Left as COLLECTED
                componentType: compType as any,
                currentLocation: parent.currentLocation,
                latitude: parent.latitude,
                longitude: parent.longitude,
                parentUnitId: parent.id
            }));

            const children = await Promise.all(
                childrenPayloads.map(childData => 
                    tx.bloodAsset.create({ data: childData })
                )
            );

            return {
                parent: updatedParent,
                children
            };
        });

        return apiSuccess(res, result);
    } catch (error: any) {
        console.error('[splitComponent] Error:', error.message);
        return apiError(res, error.message || 'Error occurred during component split', 400);
    }
};

