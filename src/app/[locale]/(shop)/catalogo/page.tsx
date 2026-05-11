import { setRequestLocale, getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import {
  getCatalog,
  getCategoriesWithCount,
  getBrandsWithCount,
  type CatalogFilters,
} from "@/lib/queries/products";
import { ProductGrid } from "@/components/shop/product-grid";
import { CatalogFilters as Filters } from "@/components/shop/catalog-filters";
import { CatalogSort } from "@/components/shop/catalog-sort";
import { FiltersDrawer } from "@/components/shop/filters-drawer";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";

type SP = Promise<Record<string, string | string[] | undefined>>;

function parseFilters(
  sp: Record<string, string | string[] | undefined>,
): CatalogFilters {
  const str = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;
  const num = (v: string | string[] | undefined) => {
    const s = str(v);
    if (!s) return undefined;
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
  };

  const sort = str(sp.sort);
  const validSort = (["newest", "price_asc", "price_desc", "name"] as const).find(
    (x) => x === sort,
  );

  return {
    categorySlug: str(sp.cat),
    brandSlugs: str(sp.brand)?.split(",").filter(Boolean),
    minPrice: num(sp.min) !== undefined ? num(sp.min)! * 100 : undefined,
    maxPrice: num(sp.max) !== undefined ? num(sp.max)! * 100 : undefined,
    onSaleOnly: str(sp.sale) === "1",
    newOnly: str(sp.new) === "1",
    sort: validSort,
    page: num(sp.page) ?? 1,
    perPage: 24,
  };
}

export default async function CatalogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SP;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("catalog");
  const sp = await searchParams;

  const filters = parseFilters(sp);
  const [{ products, total, page, totalPages }, cats, brands, priceAgg] =
    await Promise.all([
      getCatalog(filters),
      getCategoriesWithCount(),
      getBrandsWithCount(),
      db.product.aggregate({
        where: { isActive: true },
        _min: { priceCents: true },
        _max: { priceCents: true },
      }),
    ]);

  const filterCats = cats.map((c) => ({
    slug: c.slug,
    name: locale === "it" ? c.nameIt : c.nameEn,
    count: c._count.products,
  }));
  const filterBrands = brands.map((b) => ({
    slug: b.slug,
    name: b.name,
    count: b._count.products,
  }));
  const priceRange = {
    min: priceAgg._min.priceCents ?? 0,
    max: priceAgg._max.priceCents ?? 1000,
  };

  const activeCategoryName =
    filters.categorySlug &&
    filterCats.find((c) => c.slug === filters.categorySlug)?.name;

  return (
    <main className="container mx-auto px-4 max-w-7xl py-6 sm:py-10">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          {activeCategoryName ?? t("title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {total} {total === 1 ? "prodotto" : "prodotti"}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar filtri (desktop) */}
        <aside className="hidden md:block w-64 shrink-0 sticky top-24 self-start">
          <Filters
            categories={filterCats}
            brands={filterBrands}
            priceRange={priceRange}
          />
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-4">
            <FiltersDrawer
              categories={filterCats}
              brands={filterBrands}
              priceRange={priceRange}
            />
            <div className="ml-auto">
              <CatalogSort />
            </div>
          </div>

          {products.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-5xl mb-3">🍭</p>
              <p className="text-lg font-medium">{t("noResults")}</p>
              <Link
                href="/catalogo"
                className={buttonVariants({ variant: "outline", className: "mt-4" })}
              >
                {t("clearFilters")}
              </Link>
            </div>
          ) : (
            <>
              <ProductGrid
                products={products}
                locale={locale}
                prioritizeFirst={4}
              />

              {totalPages > 1 && <Pagination page={page} totalPages={totalPages} sp={sp} />}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function Pagination({
  page,
  totalPages,
  sp,
}: {
  page: number;
  totalPages: number;
  sp: Record<string, string | string[] | undefined>;
}) {
  function pageHref(p: number) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) {
      if (k === "page") continue;
      if (typeof v === "string") params.set(k, v);
    }
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/catalogo${qs ? `?${qs}` : ""}` as const;
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-10">
      {page > 1 && (
        <Link
          href={pageHref(page - 1)}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          ←
        </Link>
      )}
      <span className="px-3 py-1.5 text-sm">
        Pagina {page} di {totalPages}
      </span>
      {page < totalPages && (
        <Link
          href={pageHref(page + 1)}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          →
        </Link>
      )}
    </nav>
  );
}
