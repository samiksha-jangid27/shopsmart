# ShopSmart Server

Express + TypeScript backend for the ShopSmart ecommerce project. It includes Prisma ORM, PostgreSQL schema, secure cookie auth, customer/admin authorization, Cloudinary uploads, catalog APIs, checkout, wishlist, reviews, and admin CRUD.

## Setup

```bash
cd server
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

The API runs on `http://localhost:4000/api`.

## Environment

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
PORT="4000"
CLIENT_URL="http://localhost:3000"
JWT_SECRET="replace-with-a-long-random-secret"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

Use Prisma Postgres or any hosted PostgreSQL provider supported by Prisma.

## Seed Accounts

- Admin: `admin@shopsmart.local` / `Admin12345`
- Customer: `customer@shopsmart.local` / `Customer12345`

## API Areas

- `GET /api/home`
- `GET /api/products`
- `GET /api/products/:slug`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/customer/orders`
- `POST /api/customer/checkout`
- `GET/POST/DELETE /api/customer/wishlist`
- `POST /api/customer/reviews`
- `GET/POST/PUT/DELETE /api/admin/products`
- `GET/POST/PUT/DELETE /api/admin/categories`
- `GET/PATCH /api/admin/orders`
- `POST /api/admin/upload`

Cloudinary uploads store `publicId` and `secureUrl`, and product deletion cleans up uploaded images.
