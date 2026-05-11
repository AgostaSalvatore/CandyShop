import { ProductCard } from "./product-card";
import type { ProductCard as ProductCardType } from "@/lib/queries/products";

type Props = {
  products: ProductCardType[];
  locale: string;
  prioritizeFirst?: number;
};

export function ProductGrid({ products, locale, prioritizeFirst = 0 }: Props) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <p className="text-4xl mb-2">🍭</p>
        <p>Nessun prodotto trovato</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {products.map((p, i) => (
        <ProductCard
          key={p.id}
          product={p}
          locale={locale}
          priority={i < prioritizeFirst}
        />
      ))}
    </div>
  );
}
