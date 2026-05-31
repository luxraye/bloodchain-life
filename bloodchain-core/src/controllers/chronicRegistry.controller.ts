import { Request, Response, NextFunction } from "express";
import * as chronicRegistryService from "../services/chronicRegistry.service";

export const listPatients = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await chronicRegistryService.listPatients();
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export const listExceptions = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await chronicRegistryService.listExceptions();
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export const patchException = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await chronicRegistryService.patchException(String(req.params.id), req.body);
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
