import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import type { Route } from "next";

type Props = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
};

export function SectionHeader({ title, subtitle, eyebrow, viewAllHref, viewAllLabel }: Props) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
      <div>
        {eyebrow && (
          <span className="font-mono text-xs uppercase tracking-wider text-ink/60 block mb-1">
            ★ {eyebrow}
          </span>
        )}
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-none tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-ink/70 mt-2 max-w-xl">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref as Route}
          className="text-sm font-bold flex items-center gap-1.5 shrink-0 hover:text-candy-pink transition-colors font-mono uppercase tracking-wider"
        >
          {viewAllLabel ?? "Vedi tutti"}
          <ArrowRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}
