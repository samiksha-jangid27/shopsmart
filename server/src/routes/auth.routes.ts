import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../lib/async-handler.js";
import { loginSchema, registerSchema } from "../lib/validators.js";
import { requireAuth, signAuthToken } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  asyncHandler(async (request, response) => {
    const data = registerSchema.parse(request.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (existing) {
      response.status(409).json({ message: "An account already exists for this email." });
      return;
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash: await bcrypt.hash(data.password, 12),
        wishlist: { create: {} }
      }
    });

    const token = signAuthToken({ id: user.id, email: user.email, role: user.role });
    response.cookie("shopsmart_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7
    });
    response.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  })
);

authRouter.post(
  "/login",
  asyncHandler(async (request, response) => {
    const data = loginSchema.parse(request.body);
    const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });

    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      response.status(401).json({ message: "Invalid email or password." });
      return;
    }

    const token = signAuthToken({ id: user.id, email: user.email, role: user.role });
    response.cookie("shopsmart_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7
    });
    response.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  })
);

authRouter.post("/logout", (_request, response) => {
  response.clearCookie("shopsmart_session");
  response.json({ ok: true });
});

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (request, response) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user!.id },
      select: { id: true, name: true, email: true, image: true, role: true, createdAt: true }
    });
    response.json({ user });
  })
);
