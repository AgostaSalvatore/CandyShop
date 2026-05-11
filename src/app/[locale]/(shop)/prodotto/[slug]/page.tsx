import { notFound } from "next/navigation";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Truck, ShieldCheck, Package } from "lucide-react";
import { getProductBySlug } from "@/lib/queries/products";
import { formatPrice, discountPercent } from "@/lib/format";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: locale === "it" ? product.nameIt : product.nameEn,
    description: locale === "it" ? product.descIt : product.descEn,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const name = locale === "it" ? product.nameIt : product.nameEn;
  const desc = locale === "it" ? product.descIt : product.descEn;
  const catName = locale === "it" ? product.category.nameIt : product.category.nameEn;
  const image = product.images[0];
  const discount = discountPercent(product.priceCents, product.compareAtCents);
  const outOfStock = product.stock <= 0;

  return (
    <main className="container mx-auto px-4 max-w-7xl py-6 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="size-3.5" />
        <Link href="/catalogo" className="hover:text-foreground">{t("nav.catalog")}</Link>
        <ChevronRight className="size-3.5" />
        <Link
          href={{ pathname: "/catalogo", query: { cat: product.category.slug } }}
          className="hover:text-foreground"
        >
          {catName}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground truncate">{name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Galleria */}
        <div className="relative aspect-square rounded-3xl bg-muted overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
              unoptimized
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-9xl">🍬</div>
          )}
          {(product.isNew || discount) && (
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white border-0">
                  NEW
                </Badge>
              )}
              {discount && (
                <Badge className="bg-pink-600 hover:bg-pink-600 text-white border-0">
                  -{discount}%
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <Link
              href={{ pathname: "/catalogo", query: { brand: product.brand.slug } }}
              className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              {product.brand.name}
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1">
              {name}
            </h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold">{formatPrice(product.priceCents)}</span>
            {product.compareAtCents && product.compareAtCents > product.priceCents && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compareAtCents)}
              </span>
            )}
          </div>

          {!outOfStock ? (
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-900 hover:bg-emerald-100">
              ● {t("common.inStock")}
            </Badge>
          ) : (
            <Badge variant="destructive">{t("common.outOfStock")}</Badge>
          )}

          {desc && (
            <p className="text-muted-foreground leading-relaxed">{desc}</p>
          )}

          {/* Attributi */}
          {product.attributes.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">{t("product.details")}</h3>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                {product.attributes.map((a) => (
                  <div
                    key={a.id}
                    className="flex justify-between border-b border-dashed py-1.5"
                  >
                    <dt className="capitalize text-muted-foreground">{a.key}</dt>
                    <dd className="font-medium">{a.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* CTA */}
          <div className="pt-2">
            <AddToCartButton
              large
              product={{
                productId: product.id,
                slug: product.slug,
                name,
                priceCents: product.priceCents,
                image: image ?? null,
                maxStock: product.stock,
              }}
            />
          </div>

          <Separator />

          {/* Vantaggi */}
          <ul className="grid sm:grid-cols-3 gap-3 text-xs">
            <li className="flex items-center gap-2 text-muted-foreground">
              <Truck className="size-4 text-pink-600" />
              Consegna interna
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="size-4 text-pink-600" />
              Pagamento sicuro
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <Package className="size-4 text-pink-600" />
              Prodotti originali
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
