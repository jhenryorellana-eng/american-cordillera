"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/client";
import { Button, Input, Label, cn } from "./ui";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const { dict } = useI18n();
  const A = dict.auth;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<"MEMBER" | "MENTOR">("MEMBER");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload =
      mode === "signup"
        ? {
            name: fd.get("name"),
            email: fd.get("email"),
            password: fd.get("password"),
            role,
          }
        : { email: fd.get("email"), password: fd.get("password") };

    const res = await fetch(`/api/auth/${mode === "signup" ? "register" : "login"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(
        j.error === "exists"
          ? A.errorExists
          : j.error === "invalid"
            ? A.errorInvalid
            : A.errorGeneric,
      );
      setLoading(false);
      return;
    }
    const { user } = await res.json();
    router.refresh();
    router.push(user.role === "ADMIN" ? "/admin" : "/community");
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-line bg-paper p-8 shadow-sm">
      <h1 className="text-2xl font-extrabold text-navy">
        {mode === "signup" ? A.signupTitle : A.loginTitle}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {mode === "signup" ? A.signupSubtitle : A.loginSubtitle}
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {mode === "signup" && (
          <div>
            <Label htmlFor="name">{dict.common.name}</Label>
            <Input id="name" name="name" required autoComplete="name" />
          </div>
        )}
        <div>
          <Label htmlFor="email">{dict.common.email}</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <Label htmlFor="password">{dict.common.password}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={mode === "signup" ? 6 : undefined}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        </div>

        {mode === "signup" && (
          <div>
            <Label>{A.iAmA}</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["MEMBER", "MENTOR"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                    role === r
                      ? "border-terra bg-terra-50 text-terra-700"
                      : "border-surface-line text-muted hover:border-navy/30",
                  )}
                >
                  {r === "MEMBER" ? A.youth : A.mentor}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading
            ? dict.common.loading
            : mode === "signup"
              ? A.submitSignup
              : A.submitLogin}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        {mode === "signup" ? A.haveAccount : A.noAccount}{" "}
        <Link
          href={mode === "signup" ? "/login" : "/signup"}
          className="font-semibold text-terra hover:underline"
        >
          {mode === "signup" ? dict.common.login : dict.common.signup}
        </Link>
      </p>
    </div>
  );
}
