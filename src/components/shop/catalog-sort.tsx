"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

export function CatalogSort() {
  const t = useTranslations("catalog");
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [, startTransition] = useTransition();

  const current = sp.get("sort") ?? "newest";

  function change(value: string | null) {
    if (!value) return;
    const params = new URLSearchParams(sp.toString());
    if (value === "newest") params.delete("sort");
    else params.set("sort", value);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}` as never);
    });
  }

  return (
    <Select value={current} onValueChange={change}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder={t("sort")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">{t("sortNewest")}</SelectItem>
        <SelectItem value="price_asc">{t("sortPriceAsc")}</SelectItem>
        <SelectItem value="price_desc">{t("sortPriceDesc")}</SelectItem>
        <SelectItem value="name">{t("sortName")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
