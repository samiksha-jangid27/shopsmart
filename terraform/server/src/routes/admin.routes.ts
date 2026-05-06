import { OrderStatus, Prisma } from "@prisma/client";
import { Router } from "express";
import multer from "multer";
import { cloudinary } from "../config/cloudinary.js";
import { asyncHandler } from "../lib/async-handler.js";
import { routeParam } from "../lib/params.js";
import { prisma } from "../lib/prisma.js";
import { categorySchema, productSchema } from "../lib/validators.js";
import { requireAdmin } from "../middleware/auth.js";

export const adminRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 6 * 1024 * 1024 } });

adminRouter.use(requireAdmin);

adminRouter.get(
  "/summary",
  asyncHandler(async (_request, response) => {
    const [products, orders, customers, lowStock] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count({ where: { inventoryQuantity: { lte: 5 } } })
    ]);
    response.json({ products, orders, customers, lowStock });
  })
);

adminRouter.get(
  "/products",
  asyncHandler(async (_request, response) => {
    const products = await prisma.product.findMany({
      include: { category: true, images: { orderBy: { position: "asc" } }, variants: true },
      orderBy: { updatedAt: "desc" }
    });
    response.json({ products });
  })
);

adminRouter.get(
  "/products/:id",
  asyncHandler(async (request, response) => {
    const id = routeParam(request.params.id, "id");
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, images: { orderBy: { position: "asc" } }, variants: true, collections: true }
    });
    if (!product) {
      response.status(404).json({ message: "Product not found." });
      return;
    }
    response.json({ product });
  })
);

adminRouter.post(
  "/products",
  asyncHandler(async (request, response) => {
    const data = productSchema.parse(request.body);
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        brand: data.brand,
        subtitle: data.subtitle,
        description: data.description,
        materials: data.materials,
        care: data.care,
        categoryId: data.categoryId,
        price: new Prisma.Decimal(data.price),
        compareAtPrice: data.compareAtPrice ? new Prisma.Decimal(data.compareAtPrice) : null,
        status: data.status,
        isFeatured: data.isFeatured,
        isNewArrival: data.isNewArrival,
        isBestSeller: data.isBestSeller,
        inventoryQuantity: data.inventoryQuantity,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        images: {
          create: data.images.map((image, position) => ({
            publicId: image.publicId,
            secureUrl: image.secureUrl,
            alt: image.alt,
            position,
            role: position === 0 ? "THUMBNAIL" : "GALLERY"
          }))
        },
        variants: { create: data.variants }
      },
      include: { images: true, variants: true }
    });
    response.status(201).json({ product });
  })
);

adminRouter.put(
  "/products/:id",
  asyncHandler(async (request, response) => {
    const data = productSchema.parse(request.body);
    const id = routeParam(request.params.id, "id");
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        brand: data.brand,
        subtitle: data.subtitle,
        description: data.description,
        materials: data.materials,
        care: data.care,
        categoryId: data.categoryId,
        price: new Prisma.Decimal(data.price),
        compareAtPrice: data.compareAtPrice ? new Prisma.Decimal(data.compareAtPrice) : null,
        status: data.status,
        isFeatured: data.isFeatured,
        isNewArrival: data.isNewArrival,
        isBestSeller: data.isBestSeller,
        inventoryQuantity: data.inventoryQuantity,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription
      }
    });
    response.json({ product });
  })
);

adminRouter.delete(
  "/products/:id",
  asyncHandler(async (request, response) => {
    const id = routeParam(request.params.id, "id");
    const images = await prisma.productImage.findMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });
    await Promise.allSettled(images.map((image) => cloudinary.uploader.destroy(image.publicId)));
    response.json({ ok: true });
  })
);

adminRouter.get(
  "/categories",
  asyncHandler(async (_request, response) => {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    response.json({ categories });
  })
);

adminRouter.post(
  "/categories",
  asyncHandler(async (request, response) => {
    const data = categorySchema.parse(request.body);
    const category = await prisma.category.create({
      data: { ...data, imageUrl: data.imageUrl || null }
    });
    response.status(201).json({ category });
  })
);

adminRouter.put(
  "/categories/:id",
  asyncHandler(async (request, response) => {
    const data = categorySchema.parse(request.body);
    const id = routeParam(request.params.id, "id");
    const category = await prisma.category.update({
      where: { id },
      data: { ...data, imageUrl: data.imageUrl || null }
    });
    response.json({ category });
  })
);

adminRouter.delete(
  "/categories/:id",
  asyncHandler(async (request, response) => {
    await prisma.category.delete({ where: { id: routeParam(request.params.id, "id") } });
    response.json({ ok: true });
  })
);

adminRouter.get(
  "/collections",
  asyncHandler(async (_request, response) => {
    const collections = await prisma.collection.findMany({
      include: { products: { include: { images: true }, take: 6 } },
      orderBy: { updatedAt: "desc" }
    });
    response.json({ collections });
  })
);

adminRouter.get(
  "/orders",
  asyncHandler(async (_request, response) => {
    const orders = await prisma.order.findMany({
      include: { user: { select: { name: true, email: true } }, items: true },
      orderBy: { createdAt: "desc" }
    });
    response.json({ orders });
  })
);

adminRouter.patch(
  "/orders/:id",
  asyncHandler(async (request, response) => {
    const status = request.body.status as OrderStatus;
    if (!Object.values(OrderStatus).includes(status)) {
      response.status(400).json({ message: "Valid status is required." });
      return;
    }
    const order = await prisma.order.update({
      where: { id: routeParam(request.params.id, "id") },
      data: { status }
    });
    response.json({ order });
  })
);

adminRouter.post(
  "/upload",
  upload.single("image"),
  asyncHandler(async (request, response) => {
    if (!request.file) {
      response.status(400).json({ message: "Image file is required." });
      return;
    }

    const dataUri = `data:${request.file.mimetype};base64,${request.file.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "shopsmart/products",
      resource_type: "image",
      transformation: [{ quality: "auto", fetch_format: "auto" }]
    });

    response.status(201).json({
      publicId: result.public_id,
      secureUrl: result.secure_url,
      width: result.width,
      height: result.height
    });
  })
);
