"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/lib/i18n/client";
import { DONATION_TIERS } from "@/lib/constants";
import { Button, Input, Label, Textarea, Kicker, cn } from "@/components/ui";
import { Icon } from "@/components/icons";
import { Stagger, StaggerItem, SuccessCheck } from "@/components/motion";

type Tier = (typeof DONATION_TIERS)[number];

export function DonateTiers() {
  const { locale, dict } = useI18n();
  const T = dict.donate.tiers;
  const [tier, setTier] = useState<Tier | null>(null);

  return (
    <section id="donate" className="container-ac py-16">
      <Kicker>{T.kicker}</Kicker>
      <h2 className="mt-3 text-4xl font-extrabold text-navy">{T.title}</h2>

      <Stagger className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {DONATION_TIERS.map((t) => {
          const copy = locale === "es" ? t.es : t.en;
          const isSponsor = t.key === "CHAPTER_SPONSOR";
          return (
            <StaggerItem
              key={t.key}
              className="flex flex-col rounded-2xl border border-line bg-paper p-6 transition-shadow hover:shadow-md"
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTier(t)}
                    className="transition-transform active:scale-95"
                  >
                    {T.choose}
                  </Button>
                )}
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>

      <p className="mt-6 max-w-2xl text-sm text-muted">{T.note}</p>

      <AnimatePresence>
        {tier && (
          <DonateModal key="donate-modal" tier={tier} onClose={() => setTier(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function DonateModal({ tier, onClose }: { tier: Tier; onClose: () => void }) {
  const { locale, dict } = useI18n();
  const copy = locale === "es" ? tier.es : tier.en;
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

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
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="w-full max-w-md rounded-2xl bg-paper p-7 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
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
            <div className="flex justify-center">
              <SuccessCheck size={56} />
            </div>
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
      </motion.div>
    </motion.div>
  );
}
