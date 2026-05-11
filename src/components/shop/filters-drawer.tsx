"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { CatalogFilters, type FilterCategory, type FilterBrand } from "./catalog-filters";

type Props = {
  categories: FilterCategory[];
  brands: FilterBrand[];
  priceRange: { min: number; max: number };
};

export function FiltersDrawer({ categories, brands, priceRange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" size="sm" className="md:hidden">
            <Filter className="size-4" />
            Filtri
          </Button>
        }
      />
      <SheetContent side="left" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtri</SheetTitle>
        </SheetHeader>
        <div className="mt-4 pb-8">
          <CatalogFilters
            categories={categories}
            brands={brands}
            priceRange={priceRange}
            onApply={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
