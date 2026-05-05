export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
};

export type ProductImage = {
  id: string;
  publicId: string;
  secureUrl: string;
  alt?: string | null;
  position: number;
};

export type ProductVariant = {
  id: string;
  sku: string;
  size: string;
  color: string;
  colorHex?: string | null;
  stock: number;
};

export type Review = {
  id: string;
  rating: number;
  title?: string | null;
  body: string;
  user: { name: string };
  product?: { name: string };
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  subtitle?: string | null;
  description: string;
  materials?: string | null;
  care?: string | null;
  price: string | number;
  compareAtPrice?: string | number | null;
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  inventoryQuantity: number;
  categoryId: string;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews: Review[];
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type Collection = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  coverUrl?: string | null;
  isFeatured: boolean;
  products: Product[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "CUSTOMER" | "ADMIN";
};

export type CartLine = {
  productId: string;
  variantId?: string | null;
  name: string;
  slug: string;
  image: string;
  price: number;
  compareAtPrice?: number | null;
  size?: string;
  color?: string;
  quantity: number;
  stock: number;
};
