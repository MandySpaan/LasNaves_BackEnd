import { Request, Response } from "express";
import accessHistoryService from "./accessHistory.service";

class AccessHistoryController {
  async getAccessHistoriesByDate(req: Request, res: Response) {
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const accessHistoryByDate = await accessHistoryService.accessHistoryByDate(
      startDate,
      endDate
    );

    res.status(200).send({
      message: "Access histories retrieved successfully",
      data: accessHistoryByDate,
    });
  }
}

export default new AccessHistoryController();
