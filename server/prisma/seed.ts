import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const images = {
  silkDress: [
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=85"
  ],
  linenBlazer: [
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85"
  ],
  shirt: [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1506629905607-d9ec5418d78a?auto=format&fit=crop&w=1200&q=85"
  ],
  knit: [
    "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=85"
  ],
  trouser: [
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85"
  ],
  coat: [
    "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=1200&q=85"
  ]
};

async function main() {
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const [admin, customer] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Admin Buyer",
        email: "admin@shopsmart.local",
        passwordHash: await bcrypt.hash("Admin12345", 12),
        role: "ADMIN",
        wishlist: { create: {} }
      }
    }),
    prisma.user.create({
      data: {
        name: "Aarohi Mehta",
        email: "customer@shopsmart.local",
        passwordHash: await bcrypt.hash("Customer12345", 12),
        role: "CUSTOMER",
        wishlist: { create: {} }
      }
    })
  ]);

  const women = await prisma.category.create({
    data: {
      name: "Women",
      slug: "women",
      description: "Fluid dresses, tailoring, and elevated essentials."
    }
  });
  const men = await prisma.category.create({
    data: {
      name: "Men",
      slug: "men",
      description: "Quiet shirting, relaxed trousers, and refined outerwear."
    }
  });
  const accessories = await prisma.category.create({
    data: {
      name: "Accessories",
      slug: "accessories",
      description: "Finishing pieces for composed everyday looks."
    }
  });

  const resort = await prisma.collection.create({
    data: {
      title: "Resort Ease",
      slug: "resort-ease",
      description: "Linen, silk, and airy neutrals built for warm days.",
      coverUrl: images.silkDress[0],
      isFeatured: true
    }
  });
  const atelier = await prisma.collection.create({
    data: {
      title: "Atelier Staples",
      slug: "atelier-staples",
      description: "Polished wardrobe foundations with soft structure.",
      coverUrl: images.coat[0],
      isFeatured: true
    }
  });

  const products = [
    {
      name: "Sienna Silk Column Dress",
      slug: "sienna-silk-column-dress",
      brand: "Maison Luma",
      subtitle: "Bias-cut silk with a sculptural neckline",
      description:
        "A refined column dress cut from luminous silk, made for evenings that ask for quiet confidence and movement.",
      materials: "100% silk crepe, recycled lining",
      care: "Dry clean only. Store on a padded hanger.",
      price: 12990,
      compareAtPrice: 15990,
      categoryId: women.id,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      inventoryQuantity: 22,
      collections: [resort.id],
      images: images.silkDress,
      colors: [["Champagne", "#d9c2a3"], ["Black", "#171412"]]
    },
    {
      name: "Linen Atelier Blazer",
      slug: "linen-atelier-blazer",
      brand: "Atelier Aven",
      subtitle: "Unlined summer tailoring",
      description:
        "A softly constructed blazer in breathable linen with natural texture, designed to layer over dresses and shirting.",
      materials: "European linen, corozo buttons",
      care: "Gentle cold wash or dry clean.",
      price: 9990,
      categoryId: women.id,
      isFeatured: true,
      inventoryQuantity: 18,
      collections: [resort.id, atelier.id],
      images: images.linenBlazer,
      colors: [["Oat", "#d8c7ad"], ["Olive", "#69745a"]]
    },
    {
      name: "Architect Shirt",
      slug: "architect-shirt",
      brand: "Northline",
      subtitle: "Crisp cotton poplin with a longer line",
      description:
        "A precise everyday shirt with a generous collar, clean placket, and a weight that holds shape without stiffness.",
      materials: "Organic cotton poplin",
      care: "Machine wash cold. Hang dry.",
      price: 5490,
      categoryId: men.id,
      isNewArrival: true,
      inventoryQuantity: 34,
      collections: [atelier.id],
      images: images.shirt,
      colors: [["White", "#f4f0e8"], ["Ink", "#171412"]]
    },
    {
      name: "Brushed Merino Polo Knit",
      slug: "brushed-merino-polo-knit",
      brand: "Loom Studio",
      subtitle: "Lightweight knit with a soft open collar",
      description:
        "A versatile merino knit that reads polished under outerwear and relaxed with wide trousers.",
      materials: "Merino wool blend",
      care: "Hand wash cold. Dry flat.",
      price: 6990,
      compareAtPrice: 8490,
      categoryId: men.id,
      isBestSeller: true,
      inventoryQuantity: 26,
      collections: [atelier.id],
      images: images.knit,
      colors: [["Stone", "#b9aea0"], ["Wine", "#693d42"]]
    },
    {
      name: "Fluid Pleat Trouser",
      slug: "fluid-pleat-trouser",
      brand: "Studio Vale",
      subtitle: "Relaxed drape with a clean waistband",
      description:
        "A wide-leg trouser made from a fluid twill, balancing everyday comfort with a sharp front pleat.",
      materials: "Tencel twill blend",
      care: "Machine wash cold. Steam to refresh.",
      price: 6290,
      categoryId: women.id,
      isFeatured: true,
      inventoryQuantity: 28,
      collections: [atelier.id],
      images: images.trouser,
      colors: [["Taupe", "#9d907f"], ["Black", "#171412"]]
    },
    {
      name: "Double-Face Travel Coat",
      slug: "double-face-travel-coat",
      brand: "Maison Luma",
      subtitle: "Lightweight outerwear with a generous wrap",
      description:
        "A soft double-face coat for transitional weather, finished with a removable belt and discreet pockets.",
      materials: "Wool-cashmere blend",
      care: "Dry clean only.",
      price: 18990,
      categoryId: accessories.id,
      isFeatured: true,
      isBestSeller: true,
      inventoryQuantity: 12,
      collections: [atelier.id],
      images: images.coat,
      colors: [["Camel", "#b28b67"], ["Charcoal", "#3d3a36"]]
    }
  ];

  for (const item of products) {
    const product = await prisma.product.create({
      data: {
        name: item.name,
        slug: item.slug,
        brand: item.brand,
        subtitle: item.subtitle,
        description: item.description,
        materials: item.materials,
        care: item.care,
        price: item.price,
        compareAtPrice: item.compareAtPrice,
        categoryId: item.categoryId,
        isFeatured: item.isFeatured ?? false,
        isNewArrival: item.isNewArrival ?? false,
        isBestSeller: item.isBestSeller ?? false,
        inventoryQuantity: item.inventoryQuantity,
        seoTitle: `${item.name} | ShopSmart Atelier`,
        seoDescription: item.description,
        collections: { connect: item.collections.map((id) => ({ id })) },
        images: {
          create: item.images.map((url, position) => ({
            publicId: `seed/${item.slug}-${position}`,
            secureUrl: url,
            alt: item.name,
            position,
            role: position === 0 ? "THUMBNAIL" : "GALLERY"
          }))
        }
      }
    });

    for (const size of ["XS", "S", "M", "L", "XL"]) {
      for (const [color, colorHex] of item.colors) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            sku: `${item.slug}-${size}-${color}`.toUpperCase().replace(/[^A-Z0-9]+/g, "-"),
            size,
            color,
            colorHex,
            stock: Math.max(2, Math.floor(item.inventoryQuantity / 6))
          }
        });
      }
    }

    await prisma.review.create({
      data: {
        userId: customer.id,
        productId: product.id,
        rating: 5,
        title: "Beautifully considered",
        body: "The fabric and proportions feel much more premium than a typical student project storefront."
      }
    });
  }

  await prisma.address.create({
    data: {
      userId: customer.id,
      fullName: "Aarohi Mehta",
      phone: "+91 98765 43210",
      line1: "12 Civil Lines",
      city: "Jaipur",
      state: "Rajasthan",
      postalCode: "302006",
      country: "India",
      isDefault: true
    }
  });

  console.log("Seeded ShopSmart demo data.");
  console.log("Admin: admin@shopsmart.local / Admin12345");
  console.log("Customer: customer@shopsmart.local / Customer12345");
  void admin;
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
