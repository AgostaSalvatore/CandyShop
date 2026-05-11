"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/stores/cart";
import { formatPrice } from "@/lib/format";

export function CartFullView() {
  const t = useTranslations();
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="py-16 text-center text-muted-foreground">{t("common.loading")}</div>;
  }

  const subtotal = items.reduce((s, i) => s + i.priceCents * i.quantity, 0);
  const shippingEstimate = subtotal >= 2500 ? 0 : 300; // stima placeholder
  const total = subtotal + shippingEstimate;

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <ShoppingBag className="size-16 mx-auto text-muted-foreground/40 mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t("cart.empty")}</h2>
        <p className="text-muted-foreground mb-6">{t("cart.emptyHint")}</p>
        <Link
          href="/catalogo"
          className={buttonVariants({
            size: "lg",
            className: "rounded-full bg-pink-600 hover:bg-pink-700 text-white",
          })}
        >
          {t("cart.continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-8">
      {/* Lista */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex flex-col sm:flex-row gap-4 border rounded-xl p-3 sm:p-4"
          >
            <Link
              href={`/prodotto/${item.slug}`}
              className="relative aspect-square sm:size-28 rounded-lg bg-muted overflow-hidden shrink-0"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="120px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="grid place-items-center w-full h-full text-3xl">🍬</div>
              )}
            </Link>

            <div className="flex-1 min-w-0 flex flex-col">
              <Link
                href={`/prodotto/${item.slug}`}
                className="font-medium hover:underline line-clamp-2"
              >
                {item.name}
              </Link>
              <div className="text-sm text-muted-foreground mt-1">
                {formatPrice(item.priceCents)} cad.
              </div>

              <div className="mt-auto pt-3 flex items-center justify-between gap-3">
                <div className="inline-flex items-center rounded-full border h-9">
                  <button
                    type="button"
                    className="px-3 h-9 hover:bg-muted rounded-l-full"
                    onClick={() => setQty(item.productId, item.quantity - 1)}
                    aria-label="Diminuisci"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="min-w-9 text-center text-sm font-medium tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    className="px-3 h-9 hover:bg-muted rounded-r-full"
                    onClick={() => setQty(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.maxStock}
                    aria-label="Aumenta"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold">
                    {formatPrice(item.priceCents * item.quantity)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(item.productId)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={t("cart.remove")}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => {
            if (confirm("Svuotare il carrello?")) clear();
          }}
          className="text-sm text-muted-foreground hover:text-destructive mt-2"
        >
          Svuota carrello
        </button>
      </div>

      {/* Riepilogo */}
      <aside className="lg:sticky lg:top-24 lg:self-start border rounded-2xl p-6 bg-card space-y-4 h-fit">
        <h2 className="text-lg font-bold">{t("checkout.orderSummary")}</h2>
        <Separator />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("cart.subtotal")}</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("cart.shipping")}</span>
            <span className="font-medium">
              {shippingEstimate === 0 ? (
                <span className="text-emerald-600">Gratis 🎉</span>
              ) : (
                `~${formatPrice(shippingEstimate)}`
              )}
            </span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between items-baseline">
          <span className="font-semibold">{t("cart.total")}</span>
          <span className="text-2xl font-bold">{formatPrice(total)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Costi di consegna definitivi calcolati al checkout in base al CAP.
        </p>
        <Link
          href="/checkout"
          className={buttonVariants({
            size: "lg",
            className: "w-full h-12 rounded-full bg-pink-600 hover:bg-pink-700 text-white",
          })}
        >
          {t("cart.checkout")} →
        </Link>
        <Link
          href="/catalogo"
          className="block text-center text-sm text-muted-foreground hover:text-foreground"
        >
          ← {t("cart.continueShopping")}
        </Link>
      </aside>
    </div>
  );
}
