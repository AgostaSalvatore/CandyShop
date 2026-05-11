"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routing } from "@/i18n/routing";

export function LangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const otherLocale = routing.locales.find((l) => l !== locale) ?? "en";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        startTransition(() => {
          router.replace(pathname, { locale: otherLocale });
        });
      }}
      aria-label="Change language"
    >
      <Globe className="size-4" />
      <span className="uppercase">{otherLocale}</span>
    </Button>
  );
}
