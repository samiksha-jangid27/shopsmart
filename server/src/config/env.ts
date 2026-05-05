import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 4000),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET ?? "development-secret-change-before-production",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET
};
