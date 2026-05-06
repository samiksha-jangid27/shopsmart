import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/components/cart/cart-provider";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { apiFetch } from "@/lib/api";
import type { User } from "@/types/catalog";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "ShopSmart Atelier | Curated Modern Fashion",
    template: "%s | ShopSmart Atelier"
  },
  description:
    "A premium fashion ecommerce project with curated collections, refined product discovery, Prisma data, Cloudinary uploads, auth, orders, wishlist, reviews, and admin tools."
};

async function getUser() {
  try {
    const data = await apiFetch<{ user: User }>("/auth/me", { auth: true });
    return data.user;
  } catch {
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <CartProvider>
          <Header user={user} />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
