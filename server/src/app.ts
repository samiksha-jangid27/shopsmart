import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { adminRouter } from "./routes/admin.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { catalogRouter } from "./routes/catalog.routes.js";
import { customerRouter } from "./routes/customer.routes.js";
import { errorHandler, notFound } from "./middleware/error-handler.js";
import { optionalAuth } from "./middleware/auth.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(express.json({ limit: "8mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(optionalAuth);

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, service: "shopsmart-api" });
});

app.use("/api/auth", authRouter);
app.use("/api", catalogRouter);
app.use("/api/customer", customerRouter);
app.use("/api/admin", adminRouter);

app.use(notFound);
app.use(errorHandler);
