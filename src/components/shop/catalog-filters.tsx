"use client";

import { useTransition, useState } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";

export type FilterCategory = { slug: string; name: string; count: number };
export type FilterBrand = { slug: string; name: string; count: number };

type Props = {
  categories: FilterCategory[];
  brands: FilterBrand[];
  /** prezzi in centesimi */
  priceRange: { min: number; max: number };
  onApply?: () => void;
};

export function CatalogFilters({ categories, brands, priceRange, onApply }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [, startTransition] = useTransition();

  const selectedCat = sp.get("cat") ?? "";
  const selectedBrands = sp.get("brand")?.split(",").filter(Boolean) ?? [];
  const onSale = sp.get("sale") === "1";
  const onlyNew = sp.get("new") === "1";

  const minSp = Number(sp.get("min")) || priceRange.min / 100;
  const maxSp = Number(sp.get("max")) || priceRange.max / 100;
  const [priceVal, setPriceVal] = useState<[number, number]>([minSp, maxSp]);

  function navigate(params: URLSearchParams) {
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}` as never);
      onApply?.();
    });
  }

  function update(key: string, value: string | null) {
    const params = new URLSearchParams(sp.toString());
    if (value === null || value === "") params.delete(key);
    else params.set(key, value);
    params.delete("page");
    navigate(params);
  }

  function toggleBrand(slug: string) {
    const next = selectedBrands.includes(slug)
      ? selectedBrands.filter((s) => s !== slug)
      : [...selectedBrands, slug];
    update("brand", next.length === 0 ? null : next.join(","));
  }

  function applyPrice() {
    const params = new URLSearchParams(sp.toString());
    if (priceVal[0] > priceRange.min / 100) params.set("min", String(priceVal[0]));
    else params.delete("min");
    if (priceVal[1] < priceRange.max / 100) params.set("max", String(priceVal[1]));
    else params.delete("max");
    params.delete("page");
    navigate(params);
  }

  function reset() {
    navigate(new URLSearchParams());
  }

  const activeCount =
    (selectedCat ? 1 : 0) +
    selectedBrands.length +
    (onSale ? 1 : 0) +
    (onlyNew ? 1 : 0) +
    (sp.get("min") || sp.get("max") ? 1 : 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filtri</h3>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={reset}>
            <X className="size-3" />
            Reset ({activeCount})
          </Button>
        )}
      </div>

      <div>
        <Label className="text-sm font-semibold">Categoria</Label>
        <div className="mt-2 space-y-1.5">
          <button
            className={`block w-full text-left text-sm px-2 py-1.5 rounded hover:bg-muted ${
              !selectedCat ? "bg-muted font-medium" : ""
            }`}
            onClick={() => update("cat", null)}
          >
            Tutte
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              className={`block w-full text-left text-sm px-2 py-1.5 rounded hover:bg-muted flex justify-between ${
                selectedCat === c.slug ? "bg-muted font-medium" : ""
              }`}
              onClick={() => update("cat", c.slug)}
            >
              <span>{c.name}</span>
              <span className="text-xs text-muted-foreground">{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-sm font-semibold">Prezzo (€)</Label>
        <div className="mt-3 px-1">
          <Slider
            value={priceVal}
            onValueChange={(v) => {
              const arr = Array.isArray(v) ? v : [v];
              if (arr.length >= 2) setPriceVal([arr[0], arr[1]]);
            }}
            onValueCommitted={applyPrice}
            min={Math.floor(priceRange.min / 100)}
            max={Math.ceil(priceRange.max / 100)}
            step={1}
            minStepsBetweenValues={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>€{priceVal[0]}</span>
            <span>€{priceVal[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-sm font-semibold">Marca</Label>
        <div className="mt-2 space-y-1.5 max-h-64 overflow-y-auto pr-1">
          {brands.map((b) => (
            <label
              key={b.slug}
              className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted cursor-pointer"
            >
              <Checkbox
                checked={selectedBrands.includes(b.slug)}
                onCheckedChange={() => toggleBrand(b.slug)}
              />
              <span className="text-sm flex-1">{b.name}</span>
              <span className="text-xs text-muted-foreground">{b.count}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={onSale}
            onCheckedChange={(v) => update("sale", v ? "1" : null)}
          />
          <span className="text-sm">🔥 Solo in offerta</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={onlyNew}
            onCheckedChange={(v) => update("new", v ? "1" : null)}
          />
          <span className="text-sm">✨ Solo novità</span>
        </label>
      </div>
    </div>
  );
}
