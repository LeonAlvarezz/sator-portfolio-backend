import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

import { ErrorCode } from "@/core/response/error/exception";
import { ThrowInternalServerError } from "@/core/response/error/errors";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map(
          (issue) => `${issue.path.join(".")} is ${issue.message}`
        );
        res.error("Zod Error", ErrorCode.BAD_REQUEST, errorMessages);
      } else {
        ThrowInternalServerError();
      }
    }
  };
}
