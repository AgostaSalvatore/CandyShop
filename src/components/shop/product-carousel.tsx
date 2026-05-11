"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import type { ProductCard as ProductCardType } from "@/lib/queries/products";

type Props = {
  products: ProductCardType[];
  locale: string;
  autoplay?: boolean;
};

export function ProductCarousel({ products, locale, autoplay = true }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", loop: true, dragFree: true },
    autoplay ? [Autoplay({ delay: 4000, stopOnInteraction: true })] : [],
  );
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (products.length === 0) return null;

  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-3 sm:gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="shrink-0 basis-[60%] sm:basis-[40%] md:basis-[28%] lg:basis-[22%]"
            >
              <ProductCard product={p} locale={locale} />
            </div>
          ))}
        </div>
      </div>

      <div className="hidden sm:block">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-background shadow-md rounded-full size-10"
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canPrev}
          aria-label="Previous"
        >
          <ChevronLeft className="size-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-background shadow-md rounded-full size-10"
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canNext}
          aria-label="Next"
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </div>
  );
}
