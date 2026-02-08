import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export function validate<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map((issue) => issue.message);
        res.status(400).json({
          status: "error",
          message: messages[0],
          errors: messages,
        });
        return;
      }
      next(error);
    }
  };
}
