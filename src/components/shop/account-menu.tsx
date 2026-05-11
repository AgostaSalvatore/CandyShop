import { User as UserIcon, LogOut, ShoppingBag, Shield } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/lib/actions/auth";
import { getTranslations } from "next-intl/server";

type SessionUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: "USER" | "ADMIN";
};

export async function AccountMenu({ user }: { user: SessionUser | null }) {
  const t = await getTranslations();

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className={buttonVariants({ variant: "ghost", size: "icon" })}
        aria-label={t("nav.login")}
      >
        <UserIcon className="size-5" />
      </Link>
    );
  }

  const initials = (user.name ?? user.email ?? "U").slice(0, 1).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Account">
            <span className="grid place-items-center size-6 rounded-full bg-pink-600 text-white text-xs font-bold">
              {initials}
            </span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="font-medium text-sm">{user.name ?? "Utente"}</div>
          <div className="text-xs text-muted-foreground truncate">{user.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={
            <Link href="/account">
              <UserIcon className="size-4" />
              {t("account.profile")}
            </Link>
          }
        />
        <DropdownMenuItem
          render={
            <Link href="/account/ordini">
              <ShoppingBag className="size-4" />
              {t("nav.orders")}
            </Link>
          }
        />
        {user.role === "ADMIN" && (
          <DropdownMenuItem
            render={
              <Link href="/admin">
                <Shield className="size-4" />
                {t("nav.admin")}
              </Link>
            }
          />
        )}
        <DropdownMenuSeparator />
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted text-destructive"
          >
            <LogOut className="size-4" />
            {t("nav.logout")}
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
