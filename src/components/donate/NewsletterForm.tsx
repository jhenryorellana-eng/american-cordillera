"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n/client";

export function NewsletterForm() {
  const { locale, dict } = useI18n();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fd.get("email"), name: fd.get("name") || undefined }),
    });
    setLoading(false);
    if (res.ok) setDone(true);
  }

  if (done) {
    return (
      <p className="text-white/90">
        {locale === "es" ? "¡Gracias por sumarte! 🏔️" : "Thanks for joining! 🏔️"}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <input
        name="email"
        type="email"
        required
        placeholder={dict.common.email}
        className="flex-1 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/60 focus:border-white focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-navy hover:bg-white/90 disabled:opacity-60"
      >
        {loading ? dict.common.loading : (locale === "es" ? "Suscribirme" : "Subscribe")}
      </button>
    </form>
  );
}
