import { Prisma } from "@prisma/client";
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../lib/async-handler.js";
import { routeParam } from "../lib/params.js";
import { orderNumber } from "../lib/slugify.js";
import { requireAuth } from "../middleware/auth.js";
import { checkoutSchema, reviewSchema } from "../lib/validators.js";

export const customerRouter = Router();

customerRouter.use(requireAuth);

customerRouter.get(
  "/orders",
  asyncHandler(async (request, response) => {
    const orders = await prisma.order.findMany({
      where: { userId: request.user!.id },
      include: { items: true },
      orderBy: { createdAt: "desc" }
    });
    response.json({ orders });
  })
);

customerRouter.get(
  "/wishlist",
  asyncHandler(async (request, response) => {
    const wishlist = await prisma.wishlist.upsert({
      where: { userId: request.user!.id },
      update: {},
      create: { userId: request.user!.id },
      include: {
        items: {
          include: { product: { include: { images: { orderBy: { position: "asc" } }, category: true, variants: true, reviews: true } } },
          orderBy: { createdAt: "desc" }
        }
      }
    });
    response.json({ wishlist });
  })
);

customerRouter.post(
  "/wishlist",
  asyncHandler(async (request, response) => {
    const productId = String(request.body.productId ?? "");
    const wishlist = await prisma.wishlist.upsert({
      where: { userId: request.user!.id },
      update: {},
      create: { userId: request.user!.id }
    });
    await prisma.wishlistItem.upsert({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
      update: {},
      create: { wishlistId: wishlist.id, productId }
    });
    response.json({ saved: true });
  })
);

customerRouter.delete(
  "/wishlist/:productId",
  asyncHandler(async (request, response) => {
    const wishlist = await prisma.wishlist.findUnique({ where: { userId: request.user!.id } });
    if (wishlist) {
      await prisma.wishlistItem.deleteMany({
        where: { wishlistId: wishlist.id, productId: routeParam(request.params.productId, "productId") }
      });
    }
    response.json({ saved: false });
  })
);

customerRouter.post(
  "/reviews",
  asyncHandler(async (request, response) => {
    const data = reviewSchema.parse(request.body);
    const review = await prisma.review.upsert({
      where: { userId_productId: { userId: request.user!.id, productId: data.productId } },
      update: { rating: data.rating, title: data.title, body: data.body },
      create: { userId: request.user!.id, productId: data.productId, rating: data.rating, title: data.title, body: data.body }
    });
    response.status(201).json({ review });
  })
);

customerRouter.post(
  "/checkout",
  asyncHandler(async (request, response) => {
    const data = checkoutSchema.parse(request.body);
    const products = await prisma.product.findMany({
      where: { id: { in: data.items.map((item) => item.productId) }, status: "ACTIVE" },
      include: { variants: true }
    });

    const lines = data.items.map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) throw new Error("Product unavailable.");
      const variant = item.variantId ? product.variants.find((entry) => entry.id === item.variantId) : null;
      const stock = variant?.stock ?? product.inventoryQuantity;
      if (stock < item.quantity) throw new Error(`${product.name} does not have enough stock.`);
      const unitPrice = new Prisma.Decimal(product.price);
      return { product, variant, quantity: item.quantity, unitPrice, total: unitPrice.mul(item.quantity) };
    });

    const subtotal = lines.reduce((sum, line) => sum.add(line.total), new Prisma.Decimal(0));
    const shipping = subtotal.greaterThanOrEqualTo(10000) ? new Prisma.Decimal(0) : new Prisma.Decimal(499);
    const total = subtotal.add(shipping);

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber: orderNumber(),
          userId: request.user!.id,
          subtotal,
          shipping,
          total,
          discount: 0,
          customerEmail: data.shipping.email,
          shippingName: data.shipping.fullName,
          shippingPhone: data.shipping.phone,
          shippingLine1: data.shipping.line1,
          shippingLine2: data.shipping.line2,
          shippingCity: data.shipping.city,
          shippingState: data.shipping.state,
          shippingPostal: data.shipping.postalCode,
          shippingCountry: data.shipping.country,
          notes: data.shipping.notes,
          items: {
            create: lines.map((line) => ({
              productId: line.product.id,
              variantId: line.variant?.id,
              productName: line.product.name,
              variantName: line.variant ? `${line.variant.size} / ${line.variant.color}` : null,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
              total: line.total
            }))
          }
        },
        include: { items: true }
      });

      for (const line of lines) {
        if (line.variant) {
          await tx.productVariant.update({ where: { id: line.variant.id }, data: { stock: { decrement: line.quantity } } });
        }
        await tx.product.update({ where: { id: line.product.id }, data: { inventoryQuantity: { decrement: line.quantity } } });
      }

      return created;
    });

    response.status(201).json({ order });
  })
);
