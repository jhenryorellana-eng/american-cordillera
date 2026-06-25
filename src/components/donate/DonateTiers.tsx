"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/client";
import { DONATION_TIERS } from "@/lib/constants";
import { Button, Input, Label, Textarea, Kicker, cn } from "@/components/ui";
import { Icon } from "@/components/icons";

type Tier = (typeof DONATION_TIERS)[number];

export function DonateTiers() {
  const { locale, dict } = useI18n();
  const T = dict.donate.tiers;
  const [tier, setTier] = useState<Tier | null>(null);

  return (
    <section id="donate" className="container-ac py-16">
      <Kicker>{T.kicker}</Kicker>
      <h2 className="mt-3 text-4xl font-extrabold text-navy">{T.title}</h2>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {DONATION_TIERS.map((t) => {
          const copy = locale === "es" ? t.es : t.en;
          const isSponsor = t.key === "CHAPTER_SPONSOR";
          return (
            <div
              key={t.key}
              className="flex flex-col rounded-2xl border border-line bg-paper p-6"
            >
              <h3 className="text-lg font-bold text-navy">{copy.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{copy.desc}</p>
              <div className="mt-5">
                {isSponsor ? (
                  <Link
                    href="/donate/sponsor"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-terra hover:underline"
                  >
                    {dict.donate.nav.sponsor} <Icon name="arrowRight" size={15} />
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setTier(t)}>
                    {T.choose}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 max-w-2xl text-sm text-muted">{T.note}</p>

      {tier && <DonateModal tier={tier} onClose={() => setTier(null)} />}
    </section>
  );
}

function DonateModal({ tier, onClose }: { tier: Tier; onClose: () => void }) {
  const { locale, dict } = useI18n();
  const copy = locale === "es" ? tier.es : tier.en;
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        donorName: fd.get("name"),
        donorEmail: fd.get("email"),
        amount: fd.get("amount") || undefined,
        message: fd.get("message") || undefined,
        frequency: tier.frequency,
        tier: tier.key,
      }),
    });
    setLoading(false);
    if (res.ok) setDone(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-paper p-7 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="kicker">{dict.common.donate}</p>
            <h3 className="mt-1 text-xl font-bold text-navy">{copy.name}</h3>
          </div>
          <button onClick={onClose} className="text-muted hover:text-navy" aria-label={dict.common.cancel}>
            <Icon name="close" size={20} />
          </button>
        </div>

        {done ? (
          <div className="py-6 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Icon name="check" size={28} />
            </span>
            <h4 className="mt-4 text-lg font-bold text-navy">
              {dict.donate.sponsor.thanksTitle}
            </h4>
            <p className="mt-2 text-sm text-muted">{dict.donate.sponsor.noPayments}</p>
            <Button className="mt-5" onClick={onClose}>
              {dict.common.back}
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="d-name">{dict.donate.sponsor.yourName}</Label>
              <Input id="d-name" name="name" required />
            </div>
            <div>
              <Label htmlFor="d-email">{dict.donate.sponsor.yourEmail}</Label>
              <Input id="d-email" name="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="d-amount">
                {locale === "es" ? "Monto" : "Amount"}{" "}
                <span className="font-normal text-muted">({dict.common.optional})</span>
              </Label>
              <Input id="d-amount" name="amount" placeholder={locale === "es" ? "$ — (placeholder)" : "$ — (placeholder)"} />
            </div>
            <div>
              <Label htmlFor="d-msg">
                {dict.common.message}{" "}
                <span className="font-normal text-muted">({dict.common.optional})</span>
              </Label>
              <Textarea id="d-msg" name="message" rows={2} />
            </div>
            <p className="text-xs text-muted">{dict.donate.sponsor.noPayments}</p>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? dict.common.loading : dict.donate.closing.cta}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
