import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export type ProductQuery = {
  q?: string;
  category?: string;
  collection?: string;
  min?: string;
  max?: string;
  size?: string;
  color?: string;
  brand?: string;
  availability?: string;
  sort?: string;
  page?: string;
};

const productInclude = {
  category: true,
  images: { orderBy: { position: "asc" as const } },
  variants: true,
  reviews: {
    where: { isApproved: true },
    include: { user: { select: { name: true } } }
  }
};

export async function getHomeData() {
  const [featured, newArrivals, bestSellers, collections, categories, reviews] =
    await Promise.all([
      prisma.product.findMany({
        where: { status: "ACTIVE", isFeatured: true },
        include: productInclude,
        take: 8,
        orderBy: { updatedAt: "desc" }
      }),
      prisma.product.findMany({
        where: { status: "ACTIVE", isNewArrival: true },
        include: productInclude,
        take: 8,
        orderBy: { createdAt: "desc" }
      }),
      prisma.product.findMany({
        where: { status: "ACTIVE", isBestSeller: true },
        include: productInclude,
        take: 8,
        orderBy: { updatedAt: "desc" }
      }),
      prisma.collection.findMany({
        where: { isFeatured: true },
        include: { products: { include: { images: true }, take: 4 } },
        take: 4
      }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.review.findMany({
        where: { isApproved: true },
        include: { user: { select: { name: true } }, product: { select: { name: true } } },
        take: 6,
        orderBy: { createdAt: "desc" }
      })
    ]);

  return { featured, newArrivals, bestSellers, collections, categories, reviews };
}

export async function getProducts(query: ProductQuery) {
  const page = Math.max(Number(query.page ?? 1), 1);
  const take = 12;
  const where: Prisma.ProductWhereInput = {
    status: "ACTIVE",
    OR: query.q
      ? [
          { name: { contains: query.q } },
          { brand: { contains: query.q } },
          { description: { contains: query.q } }
        ]
      : undefined,
    category: query.category ? { slug: query.category } : undefined,
    collections: query.collection ? { some: { slug: query.collection } } : undefined,
    brand: query.brand ? { equals: query.brand } : undefined,
    price: {
      gte: query.min ? Number(query.min) : undefined,
      lte: query.max ? Number(query.max) : undefined
    },
    inventoryQuantity: query.availability === "in-stock" ? { gt: 0 } : undefined,
    variants:
      query.size || query.color
        ? {
            some: {
              size: query.size,
              color: query.color ? { equals: query.color } : undefined
            }
          }
        : undefined
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    query.sort === "price-asc"
      ? { price: "asc" }
      : query.sort === "price-desc"
        ? { price: "desc" }
        : query.sort === "new"
          ? { createdAt: "desc" }
          : { updatedAt: "desc" };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy,
      skip: (page - 1) * take,
      take
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } })
  ]);

  return { products, total, page, pageCount: Math.ceil(total / take), categories };
}

export async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { ...productInclude, collections: true }
  });
  if (!product) return null;
  const related = await prisma.product.findMany({
    where: { id: { not: product.id }, categoryId: product.categoryId, status: "ACTIVE" },
    include: productInclude,
    take: 4
  });
  return { product, related };
}
