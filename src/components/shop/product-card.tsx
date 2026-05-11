import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { formatPrice, discountPercent } from "@/lib/format";
import type { ProductCard as ProductCardType } from "@/lib/queries/products";

type Props = {
  product: ProductCardType;
  locale: string;
  priority?: boolean;
};

export function ProductCard({ product, locale, priority }: Props) {
  const name = locale === "it" ? product.nameIt : product.nameEn;
  const image = product.images[0];
  const discount = discountPercent(product.priceCents, product.compareAtCents);
  const outOfStock = product.stock <= 0;

  return (
    <Link
      href={`/prodotto/${product.slug}`}
      className="group relative flex flex-col rounded-2xl border-2 border-ink bg-white overflow-hidden shadow-brutal hover-brutal"
    >
      <div className="relative aspect-square bg-candy-cream overflow-hidden border-b-2 border-ink">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority={priority}
            unoptimized
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-5xl">🍬</div>
        )}

        {/* Badges sticker */}
        <div className="absolute top-2 left-2 flex flex-col gap-2 items-start">
          {product.isNew && (
            <span className="inline-flex items-center bg-candy-yellow text-ink border-2 border-ink rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider tilt-l shadow-brutal">
              ✦ NEW
            </span>
          )}
          {discount && (
            <span className="inline-flex items-center bg-candy-pink text-white border-2 border-ink rounded-full px-2.5 py-0.5 text-[11px] font-display tilt-r shadow-brutal">
              -{discount}%
            </span>
          )}
        </div>

        {outOfStock && (
          <div className="absolute inset-0 grid place-items-center bg-ink/70 text-white font-display text-xl tracking-wide">
            ESAURITO
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 flex flex-col gap-1 flex-1 min-w-0 relative">
        <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-ink/60 truncate">
          {product.brand.name}
        </span>
        <h3 className="font-bold text-sm sm:text-[15px] leading-snug line-clamp-2 flex-1">
          {name}
        </h3>
        <div className="flex items-baseline justify-between gap-2 mt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-xl leading-none">{formatPrice(product.priceCents)}</span>
            {product.compareAtCents && product.compareAtCents > product.priceCents && (
              <span className="text-[11px] text-ink/50 line-through">
                {formatPrice(product.compareAtCents)}
              </span>
            )}
          </div>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center size-7 rounded-full bg-candy-pink text-white text-sm font-bold border-2 border-ink">
            +
          </span>
        </div>
      </div>
    </Link>
  );
}
