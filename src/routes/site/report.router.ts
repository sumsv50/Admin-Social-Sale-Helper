/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { UserDTO } from "@dto/user.dto";
import { jwtAuth } from "@middlewares/passport.middleware";
import { IPostReport, IPostReportRequest, ISalesReport, ISalesReportRequest } from "@models/site/report.model";
import ReportService from "@services/site/report.service";
import responseFormat from "@shared/responseFormat";
import { RequestHandler, Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { populateUserAccessToken } from '@shared/fb';

// Define constance
const { OK,UNAUTHORIZED } = StatusCodes;
const router = Router();

export const p = {
  reportSales: '/reportSales',
  reportPost: '/reportPost',
} as const;

const reportService = new ReportService();

router.post(p.reportSales, jwtAuth(), (async (req: Request, res: Response) => {
    try {
        const user = <UserDTO>req.user;
        const reportRequest : ISalesReportRequest = req.body;
        const reportData : ISalesReport = await reportService.getSalesReport(user.id, reportRequest);
        res.status(OK).json(responseFormat(true, {}, reportData));
    } catch(err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }

}) as RequestHandler);

router.post(p.reportPost, jwtAuth(), (async (req: Request, res: Response) => {
    try {
        if(!(await populateUserAccessToken(<UserDTO>req.user))) {
            res.status(UNAUTHORIZED);
            return res.json({
              message: 'User is not connected to facebook'
            });
          }
        const user = <UserDTO>req.user;
        const reportRequest : IPostReportRequest = req.body;
        const reportData : IPostReport = await reportService.getPostReport(user.id, reportRequest);
        res.status(OK).json(responseFormat(true, {}, reportData));
    } catch(err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }

}) as RequestHandler);

// Export default
export default router;