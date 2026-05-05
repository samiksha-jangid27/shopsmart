import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  brand: z.string().min(2),
  subtitle: z.string().optional().nullable(),
  description: z.string().min(20),
  materials: z.string().optional().nullable(),
  care: z.string().optional().nullable(),
  categoryId: z.string().min(1),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().positive().optional().nullable(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("ACTIVE"),
  isFeatured: z.coerce.boolean().default(false),
  isNewArrival: z.coerce.boolean().default(false),
  isBestSeller: z.coerce.boolean().default(false),
  inventoryQuantity: z.coerce.number().int().min(0).default(0),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  images: z
    .array(
      z.object({
        publicId: z.string(),
        secureUrl: z.string().url(),
        alt: z.string().optional()
      })
    )
    .default([]),
  variants: z
    .array(
      z.object({
        sku: z.string().min(2),
        size: z.string().min(1),
        color: z.string().min(1),
        colorHex: z.string().optional().nullable(),
        stock: z.coerce.number().int().min(0)
      })
    )
    .default([])
});

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable().or(z.literal(""))
});

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string().optional().nullable(),
        quantity: z.number().int().positive()
      })
    )
    .min(1),
  shipping: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(7),
    line1: z.string().min(4),
    line2: z.string().optional().nullable(),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().min(4),
    country: z.string().min(2).default("India"),
    notes: z.string().optional().nullable()
  })
});

export const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(80).optional(),
  body: z.string().min(8).max(800)
});
