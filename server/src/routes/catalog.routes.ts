import { Router } from "express";
import { asyncHandler } from "../lib/async-handler.js";
import { routeParam } from "../lib/params.js";
import { getHomeData, getProduct, getProducts } from "../services/catalog.service.js";
import { prisma } from "../lib/prisma.js";

export const catalogRouter = Router();

catalogRouter.get(
  "/home",
  asyncHandler(async (_request, response) => {
    response.json(await getHomeData());
  })
);

catalogRouter.get(
  "/products",
  asyncHandler(async (request, response) => {
    response.json(await getProducts(request.query));
  })
);

catalogRouter.get(
  "/products/:slug",
  asyncHandler(async (request, response) => {
    const data = await getProduct(routeParam(request.params.slug, "slug"));
    if (!data) {
      response.status(404).json({ message: "Product not found." });
      return;
    }
    response.json(data);
  })
);

catalogRouter.get(
  "/categories",
  asyncHandler(async (_request, response) => {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    response.json({ categories });
  })
);

catalogRouter.get(
  "/collections",
  asyncHandler(async (_request, response) => {
    const collections = await prisma.collection.findMany({
      include: { products: { include: { images: true }, take: 4 } },
      orderBy: { updatedAt: "desc" }
    });
    response.json({ collections });
  })
);
