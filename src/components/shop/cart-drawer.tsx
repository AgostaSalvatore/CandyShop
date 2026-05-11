"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ShoppingCart, X, Minus, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/stores/cart";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const t = useTranslations();
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.priceCents * i.quantity, 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={t("nav.cart")}
          >
            <ShoppingCart className="size-5" />
            {mounted && totalQty > 0 && (
              <span className="absolute -top-1 -right-1 size-5 rounded-full bg-pink-600 text-white text-[10px] font-bold grid place-items-center">
                {totalQty > 99 ? "99+" : totalQty}
              </span>
            )}
          </Button>
        }
      />
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center justify-between">
            <span>
              {t("cart.title")} {totalQty > 0 && `(${totalQty})`}
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 grid place-items-center px-6 text-center">
            <div>
              <p className="text-6xl mb-4">🛒</p>
              <p className="font-semibold mb-1">{t("cart.empty")}</p>
              <p className="text-sm text-muted-foreground mb-6">{t("cart.emptyHint")}</p>
              <Link
                href="/catalogo"
                onClick={() => setOpen(false)}
                className={buttonVariants({
                  className: "rounded-full bg-pink-600 hover:bg-pink-700 text-white",
                })}
              >
                {t("cart.continueShopping")}
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3 border rounded-lg p-2">
                  <Link
                    href={`/prodotto/${item.slug}`}
                    onClick={() => setOpen(false)}
                    className="relative size-20 rounded-md bg-muted overflow-hidden shrink-0"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="grid place-items-center w-full h-full text-2xl">🍬</div>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <Link
                      href={`/prodotto/${item.slug}`}
                      onClick={() => setOpen(false)}
                      className="text-sm font-medium line-clamp-2 hover:underline"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center justify-between mt-1">
                      <div className="inline-flex items-center rounded-md border h-7">
                        <button
                          type="button"
                          className="px-1.5 h-7 hover:bg-muted"
                          onClick={() => setQty(item.productId, item.quantity - 1)}
                          aria-label="Diminuisci"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="min-w-7 text-center text-xs font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="px-1.5 h-7 hover:bg-muted"
                          onClick={() => setQty(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          aria-label="Aumenta"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <span className="font-semibold text-sm">
                        {formatPrice(item.priceCents * item.quantity)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.productId)}
                    className="self-start p-1 text-muted-foreground hover:text-destructive"
                    aria-label={t("cart.remove")}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Spese di consegna calcolate al checkout
              </p>
              <Link
                href="/carrello"
                onClick={() => setOpen(false)}
                className={buttonVariants({
                  size: "lg",
                  className: "w-full h-11 rounded-full bg-pink-600 hover:bg-pink-700 text-white",
                })}
              >
                {t("cart.checkout")}
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="block w-full text-center text-sm text-muted-foreground hover:text-foreground"
              >
                {t("cart.continueShopping")}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
