# ShopSmart Client

Premium fashion-retail storefront and admin UI built with Next.js App Router, TypeScript, Tailwind CSS, React Hook Form, and Zod.

## Setup

```bash
cd client
cp .env.example .env.local
npm install
npm run dev
```

The client runs on `http://localhost:3000` and expects the API at `NEXT_PUBLIC_API_URL`, usually:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Routes

- `/` premium editorial homepage
- `/shop` catalog with filters, sorting, pagination-ready API shape
- `/shop/[slug]` category entry
- `/product/[slug]` gallery, variants, stock, materials, care, related products
- `/cart` persistent cart and database order creation
- `/account`, `/account/orders`, `/account/wishlist`
- `/auth/login`, `/auth/register`
- `/about`, `/contact`
- `/admin`, `/admin/products`, `/admin/products/new`, `/admin/products/[id]`
- `/admin/orders`, `/admin/categories`, `/admin/collections`

## Notes

Cart state persists in `localStorage`. Auth uses the server cookie `shopsmart_session`, and admin/account pages are protected by middleware. Forms use React Hook Form and Zod on the client, with server-side Zod validation repeated by the API.
