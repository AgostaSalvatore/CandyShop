import { setRequestLocale, getTranslations } from "next-intl/server";
import { CartFullView } from "@/components/shop/cart-full-view";

export const metadata = { title: "Carrello" };

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cart");

  return (
    <main className="container mx-auto px-4 max-w-7xl py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">{t("title")}</h1>
      <CartFullView />
    </main>
  );
}
