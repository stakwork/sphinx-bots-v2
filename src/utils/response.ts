import { Response } from "express";
import logger from "../logger";

export function success(
  res: Response,
  status: number,
  message: string,
  data?: any
) {
  return res.status(status).json({ success: true, message, data: data });
}

export function failure(res: Response, status: number, error?: any) {
  const errorMessage = (error && error.message) || error;
  logger.error(`--> failure: ${errorMessage}`);
  return res
    .status(status)
    .json({ success: false, errors: { message: errorMessage } });
}
