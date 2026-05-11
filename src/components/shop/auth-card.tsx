import { Link } from "@/i18n/navigation";
import { Sparkles } from "lucide-react";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 max-w-md py-10 sm:py-16">
      <Link href="/" className="flex items-center gap-2 font-bold text-2xl justify-center mb-8">
        <span className="inline-block size-10 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-600 grid place-items-center text-white text-xl">
          🍭
        </span>
        CandyShop
      </Link>
      <div className="border rounded-2xl p-6 sm:p-8 bg-card shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold flex items-center gap-1.5 justify-center">
            <Sparkles className="size-5 text-pink-600" />
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {children}
        {footer && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
