"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCart, type CartItem } from "@/stores/cart";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format";

type Props = {
  product: Omit<CartItem, "quantity">;
  /** True = stile grande full-width per pagina prodotto */
  large?: boolean;
};

export function AddToCartButton({ product, large }: Props) {
  const t = useTranslations();
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);

  if (product.maxStock <= 0) {
    return (
      <Button disabled size={large ? "lg" : "default"} className={large ? "h-12 rounded-full w-full sm:w-auto" : ""}>
        {t("common.outOfStock")}
      </Button>
    );
  }

  function handleAdd() {
    add(product, qty);
    toast.success(t("cart.itemAdded"), {
      description: `${product.name} × ${qty}`,
    });
  }

  if (large) {
    return (
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="inline-flex items-center rounded-full border bg-background h-12 px-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full size-9"
            onClick={() => setQty(Math.max(1, qty - 1))}
            aria-label="Diminuisci"
          >
            <Minus className="size-4" />
          </Button>
          <span className="min-w-8 text-center font-medium tabular-nums">{qty}</span>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full size-9"
            onClick={() => setQty(Math.min(product.maxStock, qty + 1))}
            aria-label="Aumenta"
          >
            <Plus className="size-4" />
          </Button>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className={buttonVariants({
            size: "lg",
            className: "flex-1 h-12 text-base rounded-full bg-pink-600 hover:bg-pink-700 text-white",
          })}
        >
          <ShoppingCart className="size-4 mr-1" />
          {t("common.addToCart")} · {formatPrice(product.priceCents * qty)}
        </button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleAdd();
      }}
      className="bg-pink-600 hover:bg-pink-700 text-white"
    >
      <Plus className="size-3.5" />
      Aggiungi
    </Button>
  );
}

// Indicatore "già nel carrello" (versione compatta per ProductCard)
export function InCartIndicator({ productId }: { productId: string }) {
  const qty = useCart((s) => s.items.find((i) => i.productId === productId)?.quantity ?? 0);
  if (qty === 0) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
      <Check className="size-3" /> {qty} nel carrello
    </span>
  );
}
