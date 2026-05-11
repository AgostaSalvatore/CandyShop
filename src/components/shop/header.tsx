import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Search, Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { LangSwitcher } from "./lang-switcher";
import { CartDrawer } from "./cart-drawer";
import { AccountMenu } from "./account-menu";
import { Marquee } from "./marquee";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

async function getNavCategories() {
  return db.category.findMany({
    orderBy: { sortOrder: "asc" },
    take: 6,
  });
}

const MARQUEE_ITEMS = [
  "🚚 SPEDIZIONE GRATIS OVER €25",
  "✨ NUOVI ARRIVI OGNI SETTIMANA",
  "🇺🇸 100% ORIGINALI USA",
  "💸 USA CODICE WELCOME10 PER IL 10% DI SCONTO",
  "🍭 OLTRE 500 PRODOTTI",
  "📦 CONSEGNA IN 24/48H",
];

export async function Header() {
  const t = await getTranslations();
  const locale = await getLocale();
  const [categories, session] = await Promise.all([
    getNavCategories(),
    auth(),
  ]);

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b-2 border-ink">
      {/* Marquee top */}
      <div className="bg-ink text-candy-yellow py-2 border-b-2 border-ink overflow-hidden">
        <Marquee
          speed="slow"
          items={MARQUEE_ITEMS.map((m, i) => (
            <span key={i} className="text-xs sm:text-sm font-bold tracking-wider whitespace-nowrap font-mono uppercase">
              {m}
            </span>
          ))}
        />
      </div>

      <div className="container mx-auto flex items-center gap-3 px-4 h-16 sm:h-18 max-w-7xl">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden border-2 border-ink rounded-lg" aria-label="Menu">
                <Menu className="size-5" />
              </Button>
            }
          />
          <SheetContent side="left" className="w-72 border-r-2 border-ink">
            <SheetHeader>
              <SheetTitle className="text-left font-display text-2xl">{t("common.appName")}</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 mt-4">
              <Link href="/" className="px-3 py-2 rounded-md hover:bg-candy-yellow font-medium">
                {t("nav.home")}
              </Link>
              <Link href="/catalogo" className="px-3 py-2 rounded-md hover:bg-candy-yellow font-medium">
                {t("nav.catalog")}
              </Link>
              <div className="mt-2 pl-3 text-xs uppercase text-muted-foreground tracking-wider font-mono">
                {t("nav.categories")}
              </div>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={{ pathname: "/catalogo", query: { cat: c.slug } }}
                  className="px-3 py-2 rounded-md hover:bg-candy-yellow text-sm"
                >
                  {locale === "it" ? c.nameIt : c.nameEn}
                </Link>
              ))}
              <Link
                href={{ pathname: "/catalogo", query: { sale: "1" } }}
                className="px-3 py-2 rounded-md hover:bg-candy-yellow text-sm text-candy-pink font-bold mt-2"
              >
                🔥 {t("nav.offers")}
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <span className="inline-block size-10 rounded-full bg-candy-pink border-2 border-ink grid place-items-center text-white text-xl transition-transform group-hover:rotate-12 shadow-brutal">
            🍭
          </span>
          <span className="hidden sm:inline font-display text-2xl leading-none tracking-tight">
            Candy<span className="text-candy-pink">Shop</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5 ml-4">
          <Link
            href="/catalogo"
            className="px-3 py-2 text-sm font-bold hover:bg-candy-yellow rounded-md transition"
          >
            CATALOGO
          </Link>
          {categories.slice(0, 4).map((c) => (
            <Link
              key={c.id}
              href={{ pathname: "/catalogo", query: { cat: c.slug } }}
              className="px-3 py-2 text-sm font-bold hover:bg-candy-yellow rounded-md transition"
            >
              {(locale === "it" ? c.nameIt : c.nameEn).toUpperCase()}
            </Link>
          ))}
          <Link
            href={{ pathname: "/catalogo", query: { sale: "1" } }}
            className="px-3 py-2 text-sm font-bold text-candy-pink hover:bg-candy-pink hover:text-white rounded-md transition"
          >
            🔥 OFFERTE
          </Link>
        </nav>

        {/* Search (desktop) */}
        <form
          action={`/${locale}/catalogo`}
          className="ml-auto hidden lg:flex items-center relative max-w-xs flex-1"
        >
          <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none z-10" />
          <Input
            type="search"
            name="q"
            placeholder={t("common.search")}
            className="pl-9 h-10 border-2 border-ink rounded-full bg-white focus-visible:ring-candy-pink"
          />
        </form>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-auto lg:ml-2">
          <AccountMenu user={session?.user ?? null} />
          <CartDrawer />
          <LangSwitcher />
        </div>
      </div>
    </header>
  );
}
