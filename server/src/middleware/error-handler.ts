import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function notFound(_request: Request, response: Response) {
  response.status(404).json({ message: "Route not found." });
}

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    response.status(400).json({ message: "Validation failed.", issues: error.flatten() });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    response.status(400).json({ message: error.message, code: error.code });
    return;
  }

  if (error instanceof Error) {
    response.status(500).json({ message: error.message });
    return;
  }

  response.status(500).json({ message: "Unexpected server error." });
}
