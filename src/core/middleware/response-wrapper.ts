/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextFunction, Request, Response } from "express";

// Extend Express Response type to include custom methods
declare module "express-serve-static-core" {
  interface Response {
    success<T = any>(
      data?: T | null,
      message?: string,
      statusCode?: number
    ): Response;
    simpleSuccess(message?: string, statusCode?: number): Response;
    error(message?: string, statusCode?: number, data?: any): Response;
  }
}

export const responseWrapper = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  res.success = function <T = any>(
    data: T | null = null,
    message: string = "OK",
    statusCode: number = 200
  ): Response {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
    });
  };

  res.simpleSuccess = function (
    message: string = "Success",
    statusCode: number = 200
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
    });
  };

  res.error = function (
    message: string = "Internal Server Error",
    statusCode: number = 500,
    data: any = null
  ): Response {
    return res.status(statusCode).json({
      success: false,
      data,
      message,
    });
  };

  next();
};
