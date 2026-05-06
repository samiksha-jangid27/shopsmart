import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { env } from "../config/env.js";

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function signAuthToken(user: AuthUser) {
  return jwt.sign(user, env.jwtSecret, { expiresIn: "7d" });
}

export function optionalAuth(request: Request, _response: Response, next: NextFunction) {
  const token = request.cookies?.shopsmart_session ?? request.headers.authorization?.replace("Bearer ", "");
  if (!token) return next();

  try {
    request.user = jwt.verify(token, env.jwtSecret) as AuthUser;
  } catch {
    request.user = undefined;
  }

  return next();
}

export function requireAuth(request: Request, response: Response, next: NextFunction) {
  optionalAuth(request, response, () => {
    if (!request.user) {
      response.status(401).json({ message: "Authentication required." });
      return;
    }
    next();
  });
}

export function requireAdmin(request: Request, response: Response, next: NextFunction) {
  requireAuth(request, response, () => {
    if (request.user?.role !== "ADMIN") {
      response.status(403).json({ message: "Admin access required." });
      return;
    }
    next();
  });
}
