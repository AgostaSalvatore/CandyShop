import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

const baseInclude = {
  brand: true,
  category: true,
} as const;

export type ProductCard = Prisma.ProductGetPayload<{ include: typeof baseInclude }>;

export async function getFeaturedProducts(limit = 8): Promise<ProductCard[]> {
  return db.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: baseInclude,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function getNewProducts(limit = 8): Promise<ProductCard[]> {
  return db.product.findMany({
    where: { isActive: true, isNew: true },
    include: baseInclude,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function getOnSaleProducts(limit = 8): Promise<ProductCard[]> {
  // compareAtCents > priceCents indica sconto attivo
  const all = await db.product.findMany({
    where: { isActive: true, compareAtCents: { not: null } },
    include: baseInclude,
    take: limit * 2,
    orderBy: { createdAt: "desc" },
  });
  return all.filter((p) => p.compareAtCents !== null && p.compareAtCents > p.priceCents).slice(0, limit);
}

export async function getRandomProducts(limit = 12): Promise<ProductCard[]> {
  // Postgres random sampling
  const ids = await db.$queryRaw<{ id: string }[]>`
    SELECT id FROM "Product"
    WHERE "isActive" = true
    ORDER BY random()
    LIMIT ${limit}
  `;
  if (ids.length === 0) return [];
  const products = await db.product.findMany({
    where: { id: { in: ids.map((r) => r.id) } },
    include: baseInclude,
  });
  // Mantieni l'ordine random restituito dalla query
  const order = new Map(ids.map((r, i) => [r.id, i]));
  return products.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
}

export async function getProductBySlug(slug: string): Promise<
  Prisma.ProductGetPayload<{ include: typeof baseInclude & { attributes: true } }> | null
> {
  return db.product.findUnique({
    where: { slug },
    include: { ...baseInclude, attributes: true },
  });
}

// ── Catalogo con filtri ─────────────────────────────────────────────

export type CatalogFilters = {
  categorySlug?: string;
  brandSlugs?: string[];
  minPrice?: number;  // in centesimi
  maxPrice?: number;  // in centesimi
  onSaleOnly?: boolean;
  newOnly?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "name";
  page?: number;
  perPage?: number;
};

export async function getCatalog(filters: CatalogFilters = {}) {
  const {
    categorySlug,
    brandSlugs,
    minPrice,
    maxPrice,
    onSaleOnly,
    newOnly,
    sort = "newest",
    page = 1,
    perPage = 24,
  } = filters;

  const where: Prisma.ProductWhereInput = { isActive: true };
  if (categorySlug) where.category = { slug: categorySlug };
  if (brandSlugs && brandSlugs.length > 0) where.brand = { slug: { in: brandSlugs } };
  if (minPrice !== undefined) where.priceCents = { ...(where.priceCents as object), gte: minPrice };
  if (maxPrice !== undefined) where.priceCents = { ...(where.priceCents as object), lte: maxPrice };
  if (newOnly) where.isNew = true;

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price_asc"
      ? { priceCents: "asc" }
      : sort === "price_desc"
        ? { priceCents: "desc" }
        : sort === "name"
          ? { nameIt: "asc" }
          : { createdAt: "desc" };

  // onSaleOnly è meglio gestirlo post-query (richiede confronto fra colonne)
  const skip = (page - 1) * perPage;
  const take = onSaleOnly ? perPage * 3 : perPage;

  const [productsRaw, total] = await Promise.all([
    db.product.findMany({
      where,
      include: baseInclude,
      orderBy,
      skip: onSaleOnly ? 0 : skip,
      take,
    }),
    db.product.count({ where }),
  ]);

  let products = productsRaw;
  if (onSaleOnly) {
    products = products
      .filter((p) => p.compareAtCents !== null && p.compareAtCents > p.priceCents)
      .slice(skip, skip + perPage);
  }

  return {
    products,
    total: onSaleOnly ? products.length : total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil((onSaleOnly ? products.length : total) / perPage)),
  };
}

export async function getCategoriesWithCount() {
  const cats = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });
  return cats;
}

export async function getBrandsWithCount() {
  const brands = await db.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });
  return brands;
}
