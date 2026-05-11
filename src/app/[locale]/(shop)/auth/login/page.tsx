import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AuthCard } from "@/components/shop/auth-card";
import { LoginForm } from "@/components/shop/login-form";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");
  const sp = await searchParams;
  const callbackUrl = sp.callbackUrl || "/";
  const hasGoogle = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

  return (
    <AuthCard
      title={t("loginTitle")}
      subtitle={t("loginSubtitle")}
      footer={
        <>
          {t("noAccount")}{" "}
          <Link
            href={{ pathname: "/auth/register", query: callbackUrl !== "/" ? { callbackUrl } : {} }}
            className="text-pink-600 font-medium hover:underline"
          >
            {t("signUp")}
          </Link>
        </>
      }
    >
      <LoginForm callbackUrl={callbackUrl} hasGoogle={hasGoogle} />
    </AuthCard>
  );
}
