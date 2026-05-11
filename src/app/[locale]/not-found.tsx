import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations("common");
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-6xl font-bold">404</p>
      <p className="mt-4 text-lg text-muted-foreground">{t("error")}</p>
      <Link href="/" className={buttonVariants({ className: "mt-6" })}>
        {t("back")}
      </Link>
    </main>
  );
}
