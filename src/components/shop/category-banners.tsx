import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";

const CATEGORY_CONFIG: Record<
  string,
  { emoji: string; bg: string; text: string; shadow: string; tilt: string }
> = {
  cioccolato: { emoji: "🍫", bg: "bg-[#7B3F00]", text: "text-white", shadow: "shadow-brutal-yellow", tilt: "tilt-l" },
  caramelle: { emoji: "🍬", bg: "bg-candy-pink", text: "text-white", shadow: "shadow-brutal-yellow", tilt: "tilt-r" },
  "patatine-popcorn": { emoji: "🍟", bg: "bg-candy-yellow", text: "text-ink", shadow: "shadow-brutal-pink", tilt: "tilt-l" },
  "bevande-americane": { emoji: "🥤", bg: "bg-candy-blue", text: "text-white", shadow: "shadow-brutal-yellow", tilt: "tilt-r" },
  "snack-dolci": { emoji: "🍪", bg: "bg-candy-orange", text: "text-white", shadow: "shadow-brutal-blue", tilt: "tilt-l" },
  cereali: { emoji: "🥣", bg: "bg-candy-mint", text: "text-ink", shadow: "shadow-brutal-pink", tilt: "tilt-r" },
};

export async function CategoryBanners() {
  const locale = await getLocale();
  const t = await getTranslations("home");
  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <section className="container mx-auto px-4 max-w-7xl py-12 sm:py-16">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-ink/60">★ Shop by category</span>
          <h2 className="font-display text-3xl sm:text-4xl mt-1">{t("trending")}</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((c, i) => {
          const cfg = CATEGORY_CONFIG[c.slug] ?? {
            emoji: "🍭",
            bg: "bg-candy-pink",
            text: "text-white",
            shadow: "shadow-brutal-yellow",
            tilt: i % 2 === 0 ? "tilt-l" : "tilt-r",
          };
          return (
            <Link
              key={c.id}
              href={{ pathname: "/catalogo", query: { cat: c.slug } }}
              className={`group relative aspect-square rounded-3xl ${cfg.bg} ${cfg.text} border-2 border-ink ${cfg.shadow} p-3 sm:p-4 flex flex-col justify-between overflow-hidden hover-brutal`}
            >
              <span className="text-5xl sm:text-6xl transition-transform group-hover:scale-110 group-hover:rotate-6">
                {cfg.emoji}
              </span>
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-wider opacity-80">
                  Shop
                </span>
                <span className="font-display text-base sm:text-lg leading-none">
                  {locale === "it" ? c.nameIt : c.nameEn}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 size-16 rounded-full bg-white/15 grid place-items-center text-2xl opacity-0 group-hover:opacity-100 transition">
                →
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
