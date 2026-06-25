"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n/client";
import { Button, Input, Label, Badge, cn } from "@/components/ui";
import { Icon } from "@/components/icons";

export type ChapterDTO = {
  id: string;
  name: string;
  city: string;
  slug: string;
  stake: string | null;
  status: string;
  cohortSize: number;
  currentWeek: number;
};
export type CountryDTO = {
  id: string;
  name: string;
  code: string;
  flag: string | null;
  chapters: ChapterDTO[];
};

export function SponsorFlow({
  countries,
  prefill,
}: {
  countries: CountryDTO[];
  prefill: { name: string; email: string } | null;
}) {
  const { locale, dict } = useI18n();
  const S = dict.donate.sponsor;
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState<CountryDTO | null>(null);
  const [chapter, setChapter] = useState<ChapterDTO | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const statusLabel = (s: string) =>
    s === "ACTIVE"
      ? dict.community.chapters.active
      : s === "GRADUATED"
        ? dict.community.chapters.graduated
        : dict.community.chapters.recruiting;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!chapter) return;
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/sponsorships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sponsorName: fd.get("name"),
        sponsorEmail: fd.get("email"),
        chapterId: chapter.id,
        message: fd.get("message") || undefined,
      }),
    });
    setLoading(false);
    if (res.ok) setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-line bg-paper p-10 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <Icon name="check" size={32} />
        </span>
        <h3 className="mt-5 text-2xl font-extrabold text-navy">{S.thanksTitle}</h3>
        <p className="mx-auto mt-2 max-w-md text-muted">{S.thanksBody}</p>
        <p className="mt-2 text-sm text-muted">{S.noPayments}</p>
      </div>
    );
  }

  const steps = [S.step1, S.step2, S.step3];

  return (
    <div>
      {/* step indicator */}
      <div className="mb-8 flex items-center gap-2">
        {steps.map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const passed = step > n;
          return (
            <div key={label} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  active
                    ? "bg-terra text-white"
                    : passed
                      ? "bg-navy text-white"
                      : "bg-cream-200 text-muted",
                )}
              >
                {passed ? <Icon name="check" size={16} /> : n}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:block",
                  active ? "text-navy" : "text-muted",
                )}
              >
                {label}
              </span>
              {n < 3 && <span className="mx-1 h-px flex-1 bg-line" />}
            </div>
          );
        })}
      </div>

      {/* step 1: country */}
      {step === 1 && (
        <div>
          <h3 className="mb-4 text-lg font-bold text-navy">{S.selectCountry}</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {countries.map((c) => {
              const has = c.chapters.length > 0;
              return (
                <button
                  key={c.id}
                  disabled={!has}
                  onClick={() => {
                    setCountry(c);
                    setChapter(null);
                    setStep(2);
                  }}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors",
                    has
                      ? "border-line bg-paper text-navy hover:border-terra hover:bg-terra-50"
                      : "cursor-not-allowed border-line bg-cream-200/40 text-muted",
                  )}
                >
                  <span>
                    {c.flag} {c.name}
                  </span>
                  {has ? (
                    <Icon name="arrowRight" size={15} />
                  ) : (
                    <span className="text-[0.65rem] uppercase">
                      {locale === "es" ? "pronto" : "soon"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* step 2: chapter */}
      {step === 2 && country && (
        <div>
          <button
            onClick={() => setStep(1)}
            className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-navy"
          >
            <Icon name="arrowRight" size={14} className="rotate-180" /> {dict.common.back}
          </button>
          <h3 className="mb-4 text-lg font-bold text-navy">
            {country.flag} {country.name}
          </h3>
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-line bg-paper px-3.5 py-2">
            <Icon name="search" size={16} className="text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={S.searchCity}
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>
          <div className="space-y-3">
            {country.chapters
              .filter((ch) =>
                ch.city.toLowerCase().includes(search.toLowerCase().trim()),
              )
              .map((ch) => {
                const pilot = ch.slug === "trujillo";
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setChapter(ch);
                      setStep(3);
                    }}
                    className="flex w-full items-center justify-between gap-4 rounded-2xl border border-line bg-paper p-5 text-left transition-colors hover:border-terra"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-navy">{ch.name}</h4>
                        {pilot && <Badge tone="terra">{S.pilotBadge}</Badge>}
                      </div>
                      <p className="mt-0.5 text-sm text-muted">
                        {ch.city}
                        {ch.stake ? ` · ${ch.stake}` : ""} · {ch.cohortSize}{" "}
                        {dict.community.chapters.cohort} · {statusLabel(ch.status)}
                      </p>
                    </div>
                    <Icon name="arrowRight" size={18} className="shrink-0 text-terra" />
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* step 3: confirm */}
      {step === 3 && chapter && (
        <div className="max-w-lg">
          <button
            onClick={() => setStep(2)}
            className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-navy"
          >
            <Icon name="arrowRight" size={14} className="rotate-180" /> {dict.common.back}
          </button>
          <div className="mb-5 rounded-2xl border border-line bg-cream-200/50 p-5">
            <p className="text-sm text-muted">{dict.donate.nav.sponsor}</p>
            <p className="text-lg font-bold text-navy">{chapter.name}</p>
            <p className="text-sm text-muted">
              {country?.flag} {chapter.city}, {country?.name}
            </p>
          </div>
          <h3 className="mb-1 text-lg font-bold text-navy">{S.confirmTitle}</h3>
          <p className="mb-5 text-sm text-muted">{S.confirmBody}</p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="s-name">{S.yourName}</Label>
              <Input id="s-name" name="name" required defaultValue={prefill?.name ?? ""} />
            </div>
            <div>
              <Label htmlFor="s-email">{S.yourEmail}</Label>
              <Input
                id="s-email"
                name="email"
                type="email"
                required
                defaultValue={prefill?.email ?? ""}
              />
            </div>
            <div>
              <Label htmlFor="s-msg">
                {dict.common.message}{" "}
                <span className="font-normal text-muted">({dict.common.optional})</span>
              </Label>
              <textarea
                id="s-msg"
                name="message"
                rows={2}
                className="w-full rounded-xl border border-surface-line bg-paper px-3.5 py-2.5 text-sm focus:border-terra focus:outline-none focus:ring-2 focus:ring-terra/20"
              />
            </div>
            <p className="text-xs text-muted">{S.noPayments}</p>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? dict.common.loading : S.submit}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
