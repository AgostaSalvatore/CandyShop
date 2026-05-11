import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AuthCard } from "@/components/shop/auth-card";
import { RegisterForm } from "@/components/shop/register-form";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  return (
    <AuthCard
      title={t("registerTitle")}
      subtitle={t("registerSubtitle")}
      footer={
        <>
          {t("haveAccount")}{" "}
          <Link href="/auth/login" className="text-pink-600 font-medium hover:underline">
            {t("signIn")}
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
