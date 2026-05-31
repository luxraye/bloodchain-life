import { Request, Response, NextFunction } from "express";
import * as researchService from "../services/research.service";

export const listStudies = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await researchService.listStudies();
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export const getStudy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const study = await researchService.getStudyDetail(req.params.id);
    if (!study) {
      res.status(404).json({ success: false, error: "Study not found" });
      return;
    }
    res.json({ success: true, data: study });
  } catch (e) {
    next(e);
  }
};
