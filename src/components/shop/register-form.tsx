"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { registerAction, type ActionState } from "@/lib/actions/auth";

const initial: ActionState = {};

export function RegisterForm() {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState(registerAction, initial);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">{t("name")}</Label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          required
          placeholder="Mario Rossi"
        />
        {state.fieldErrors?.name && (
          <p className="text-xs text-destructive">{state.fieldErrors.name}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="tu@email.com"
        />
        {state.fieldErrors?.email && (
          <p className="text-xs text-destructive">{state.fieldErrors.email}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">{t("password")}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Almeno 8 caratteri"
        />
        {state.fieldErrors?.password && (
          <p className="text-xs text-destructive">{state.fieldErrors.password}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirm">{t("confirmPassword")}</Label>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
        />
        {state.fieldErrors?.confirm && (
          <p className="text-xs text-destructive">{state.fieldErrors.confirm}</p>
        )}
      </div>

      {state.error && (
        <div className="text-sm rounded-lg bg-destructive/10 text-destructive px-3 py-2">
          {state.error}
        </div>
      )}

      <Button
        type="submit"
        disabled={pending}
        size="lg"
        className="w-full h-11 rounded-full bg-pink-600 hover:bg-pink-700 text-white"
      >
        {pending ? "..." : t("registerButton")}
      </Button>
    </form>
  );
}
