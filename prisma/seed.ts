/**
 * Seed CandyShop — popola Neon con catalogo + utenti demo.
 * Esegui con: pnpm db:seed
 *
 * Idempotente: usa upsert su slug/email, può essere rieseguito.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  CATEGORIES,
  BRANDS,
  PRODUCTS,
  placeholderImage,
} from "./catalog-data";

const db = new PrismaClient();

async function main() {
  console.log("🍭 Seeding CandyShop database...\n");

  // ── 1. Categories ────────────────────────────────────────────────────
  console.log("📂 Categories...");
  for (const c of CATEGORIES) {
    await db.category.upsert({
      where: { slug: c.slug },
      update: {
        nameIt: c.nameIt,
        nameEn: c.nameEn,
        sortOrder: c.sortOrder,
      },
      create: {
        slug: c.slug,
        nameIt: c.nameIt,
        nameEn: c.nameEn,
        sortOrder: c.sortOrder,
      },
    });
  }
  console.log(`   ✓ ${CATEGORIES.length} categorie\n`);

  // ── 2. Brands ────────────────────────────────────────────────────────
  console.log("🏷️  Brands...");
  for (const b of BRANDS) {
    await db.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name },
      create: { slug: b.slug, name: b.name },
    });
  }
  console.log(`   ✓ ${BRANDS.length} marche\n`);

  // ── 3. Products ──────────────────────────────────────────────────────
  console.log("📦 Products...");
  const categoriesMap = new Map(
    (await db.category.findMany()).map((c) => [c.slug, c]),
  );
  const brandsMap = new Map(
    (await db.brand.findMany()).map((b) => [b.slug, b]),
  );

  for (const p of PRODUCTS) {
    const cat = categoriesMap.get(p.categorySlug);
    const brand = brandsMap.get(p.brandSlug);
    if (!cat || !brand) {
      console.warn(`   ⚠️  Skip ${p.slug}: categoria/brand mancante`);
      continue;
    }

    const seedCat = CATEGORIES.find((c) => c.slug === p.categorySlug)!;
    const seedBrand = BRANDS.find((b) => b.slug === p.brandSlug)!;
    const imageUrl = placeholderImage(p, seedCat, seedBrand);

    const product = await db.product.upsert({
      where: { slug: p.slug },
      update: {
        nameIt: p.nameIt,
        nameEn: p.nameEn,
        descIt: p.descIt ?? "",
        descEn: p.descEn ?? "",
        priceCents: p.priceCents,
        compareAtCents: p.compareAtCents ?? null,
        categoryId: cat.id,
        brandId: brand.id,
        isFeatured: p.isFeatured ?? false,
        isNew: p.isNew ?? false,
        images: [imageUrl],
        stock: 50,
      },
      create: {
        slug: p.slug,
        nameIt: p.nameIt,
        nameEn: p.nameEn,
        descIt: p.descIt ?? "",
        descEn: p.descEn ?? "",
        priceCents: p.priceCents,
        compareAtCents: p.compareAtCents ?? null,
        categoryId: cat.id,
        brandId: brand.id,
        isFeatured: p.isFeatured ?? false,
        isNew: p.isNew ?? false,
        images: [imageUrl],
        stock: 50,
      },
    });

    // Attributi (riusabili per filtri)
    if (p.attributes) {
      for (const [key, value] of Object.entries(p.attributes)) {
        await db.productAttribute.upsert({
          where: { productId_key: { productId: product.id, key } },
          update: { value },
          create: { productId: product.id, key, value },
        });
      }
    }
  }
  console.log(`   ✓ ${PRODUCTS.length} prodotti\n`);

  // ── 4. Delivery zones ────────────────────────────────────────────────
  console.log("🚚 Delivery zones...");
  const zones = [
    {
      name: "Centro città",
      capList: ["00100", "00118", "00119", "00120", "00121", "00122"],
      feeCents: 300,
      freeOverCents: 2500,
    },
    {
      name: "Periferia",
      capList: ["00123", "00124", "00125", "00126", "00127", "00128"],
      feeCents: 500,
      freeOverCents: 4000,
    },
    {
      name: "Comuni limitrofi",
      capList: ["00010", "00020", "00030", "00040", "00050"],
      feeCents: 800,
      freeOverCents: 6000,
    },
  ];
  for (const z of zones) {
    const existing = await db.deliveryZone.findFirst({ where: { name: z.name } });
    if (existing) {
      await db.deliveryZone.update({ where: { id: existing.id }, data: z });
    } else {
      await db.deliveryZone.create({ data: z });
    }
  }
  console.log(`   ✓ ${zones.length} zone di consegna\n`);

  // ── 5. Users (admin + demo) ──────────────────────────────────────────
  console.log("👥 Demo users...");
  const adminHash = await bcrypt.hash("admin12345", 10);
  const userHash = await bcrypt.hash("demo12345", 10);

  await db.user.upsert({
    where: { email: "admin@candyshop.it" },
    update: { passwordHash: adminHash, role: "ADMIN" },
    create: {
      email: "admin@candyshop.it",
      name: "Admin CandyShop",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  await db.user.upsert({
    where: { email: "demo@candyshop.it" },
    update: { passwordHash: userHash },
    create: {
      email: "demo@candyshop.it",
      name: "Demo User",
      passwordHash: userHash,
      role: "USER",
    },
  });
  console.log(`   ✓ admin@candyshop.it / admin12345`);
  console.log(`   ✓ demo@candyshop.it  / demo12345\n`);

  // ── 6. Sample coupon ─────────────────────────────────────────────────
  console.log("🎫 Sample coupon...");
  await db.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: "PERCENT",
      value: 10,
      minOrderCents: 1500,
      maxUses: 100,
      active: true,
    },
  });
  console.log(`   ✓ WELCOME10 (10% off, min €15)\n`);

  console.log("✅ Seed completato!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
