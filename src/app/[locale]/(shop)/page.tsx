import { setRequestLocale, getTranslations } from "next-intl/server";
import { Hero } from "@/components/shop/hero";
import { BrandStrip } from "@/components/shop/brand-strip";
import { CategoryBanners } from "@/components/shop/category-banners";
import { ProductGrid } from "@/components/shop/product-grid";
import { ProductCarousel } from "@/components/shop/product-carousel";
import { SectionHeader } from "@/components/shop/section-header";
import { USPSection } from "@/components/shop/usp-section";
import { NewsletterCTA } from "@/components/shop/newsletter-cta";
import {
  getNewProducts,
  getOnSaleProducts,
  getRandomProducts,
  getFeaturedProducts,
} from "@/lib/queries/products";

export const revalidate = 300;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const [newProducts, onSale, random, featured] = await Promise.all([
    getNewProducts(8),
    getOnSaleProducts(8),
    getRandomProducts(12),
    getFeaturedProducts(8),
  ]);

  return (
    <main>
      <Hero />
      <BrandStrip />

      <CategoryBanners />

      {newProducts.length > 0 && (
        <section className="container mx-auto px-4 max-w-7xl py-12 sm:py-16">
          <SectionHeader
            eyebrow="Fresh drop"
            title={t("newArrivals")}
            subtitle={t("newArrivalsSubtitle")}
            viewAllHref="/catalogo?new=1"
            viewAllLabel="Vedi tutti"
          />
          <ProductGrid products={newProducts} locale={locale} prioritizeFirst={4} />
        </section>
      )}

      <USPSection />

      {onSale.length > 0 && (
        <section className="bg-candy-pink py-14 sm:py-20 border-y-2 border-ink relative overflow-hidden">
          <div className="absolute inset-0 bg-noise pointer-events-none" />
          <div className="container mx-auto px-4 max-w-7xl relative">
            <div className="flex items-end justify-between gap-4 mb-8 text-white">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-candy-yellow">★ Limited time</span>
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-2 leading-none">
                  Saldi 🔥 Saldi 🔥
                </h2>
                <p className="text-white/85 mt-3 max-w-lg">
                  Snack iconici scontati fino al 30%. Fino a esaurimento scorte.
                </p>
              </div>
            </div>
            <ProductGrid products={onSale} locale={locale} />
          </div>
        </section>
      )}

      {random.length > 0 && (
        <section className="container mx-auto px-4 max-w-7xl py-12 sm:py-16">
          <SectionHeader
            eyebrow="Trending now"
            title={t("trending")}
            subtitle={t("trendingSubtitle")}
          />
          <ProductCarousel products={random} locale={locale} />
        </section>
      )}

      {featured.length > 0 && (
        <section className="container mx-auto px-4 max-w-7xl py-12 sm:py-16">
          <SectionHeader
            eyebrow="Hand picked"
            title="I nostri preferiti"
            subtitle="I bestseller della settimana, selezionati dal team."
            viewAllHref="/catalogo"
            viewAllLabel="Vedi tutti"
          />
          <ProductGrid products={featured} locale={locale} />
        </section>
      )}

      <NewsletterCTA />
    </main>
  );
}
