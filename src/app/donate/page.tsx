import { prisma } from "@/lib/prisma";
import { getDict } from "@/lib/i18n/server";
import { FLAGS } from "@/lib/constants";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LinkButton, Kicker, Badge } from "@/components/ui";
import { MountainGlyph } from "@/components/Mountain";
import { Icon } from "@/components/icons";
import { DonateTiers } from "@/components/donate/DonateTiers";
import { NewsletterForm } from "@/components/donate/NewsletterForm";

export default async function DonatePage() {
  const { locale, dict } = await getDict();
  const D = dict.donate;

  const [chapters, countries, youthAgg] = await Promise.all([
    prisma.chapter.count(),
    prisma.country.count(),
    prisma.chapter.aggregate({ _sum: { cohortSize: true } }),
  ]);
  const youth = youthAgg._sum.cohortSize ?? 0;

  const stats: Array<[string, string]> = [
    [String(chapters), locale === "es" ? "Capítulos" : "Chapters"],
    [String(youth), locale === "es" ? "Jóvenes en formación" : "Youth in training"],
    [String(countries), locale === "es" ? "Países" : "Countries"],
    ["7", locale === "es" ? "Semanas por capítulo" : "Weeks per chapter"],
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* HERO */}
      <section className="border-b border-line">
        <div className="container-ac grid items-center gap-12 py-16 md:grid-cols-2">
          <div>
            <Kicker>{D.hero.kicker}</Kicker>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-navy sm:text-5xl">
              {D.hero.h1}
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/85">
              {D.hero.lead}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="#donate" size="lg">
                {D.hero.ctaDonate}
              </LinkButton>
              <LinkButton href="/donate/sponsor" size="lg" variant="outline">
                {D.hero.ctaSponsor}
              </LinkButton>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-terra via-terra-bright to-navy shadow-xl">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
              <MountainGlyph size={72} className="text-white/90" />
              <p className="mt-4 max-w-[16rem] font-serif text-lg italic">
                “{dict.landing.promise.split(":")[1]?.trim()}”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT STRIP */}
      <section className="border-b border-line bg-cream-200/50">
        <div className="container-ac grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {stats.map(([big, label]) => (
            <div key={label} className="text-center">
              <p className="font-display text-4xl font-extrabold text-navy">{big}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="container-ac py-16">
        <Kicker>{D.why.kicker}</Kicker>
        <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
          {D.why.title}
        </h2>
        <div className="mt-6 grid max-w-4xl gap-6 md:grid-cols-2">
          <p className="text-[0.98rem] leading-relaxed text-ink/85">{D.why.p1}</p>
          <p className="text-[0.98rem] leading-relaxed text-ink/85">{D.why.p2}</p>
        </div>
        <p className="mt-6 font-serif text-2xl text-terra">{D.why.punch}</p>
      </section>

      {/* TWO DESTINATIONS */}
      <section className="bg-navy py-16 text-white">
        <div className="container-ac">
          <Kicker className="text-terra-bright">{D.destinations.kicker}</Kicker>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
            {D.destinations.title}
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl bg-navy-700 p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-terra/20 text-terra-bright">
                <Icon name="observatory" size={24} />
              </span>
              <h3 className="mt-4 text-xl font-bold text-white">{D.destinations.d1Title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                {D.destinations.d1Body}
              </p>
            </div>
            <div className="rounded-2xl bg-navy-700 p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-terra/20 text-terra-bright">
                <Icon name="chapters" size={24} />
              </span>
              <h3 className="mt-4 text-xl font-bold text-white">{D.destinations.d2Title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                {D.destinations.d2Body}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section className="container-ac py-16">
        <Kicker>{D.proof.kicker}</Kicker>
        <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
          {D.proof.title}
        </h2>
        <div className="mt-6 grid max-w-4xl gap-6 md:grid-cols-2">
          <p className="text-[0.98rem] leading-relaxed text-ink/85">{D.proof.p1}</p>
          <p className="text-[0.98rem] leading-relaxed text-ink/85">{D.proof.p2}</p>
        </div>
      </section>

      {/* TIERS */}
      <DonateTiers />

      {/* NEWSLETTER BAND */}
      <section className="bg-terra">
        <div className="container-ac flex flex-col items-center gap-5 py-12 text-center">
          <h2 className="text-2xl font-extrabold text-white">
            {locale === "es"
              ? "Sumate al boletín de la cordillera"
              : "Join the cordillera newsletter"}
          </h2>
          <p className="max-w-md text-sm text-white/80">
            {locale === "es"
              ? "Historias de éxito, nuevos capítulos y el avance del movimiento."
              : "Success stories, new chapters, and the movement's progress."}
          </p>
          <div className="flex justify-center">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="container-ac py-20 text-center">
        <Kicker>{D.closing.kicker}</Kicker>
        <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-extrabold text-navy sm:text-5xl">
          {D.closing.title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink/80">{D.closing.body}</p>
        <div className="mt-8 flex justify-center">
          <LinkButton href="#donate" size="lg">
            {D.closing.cta}
          </LinkButton>
        </div>
        <p className="mx-auto mt-8 max-w-md text-xs text-muted">
          {FLAGS.taxReceipt501c3 ? D.closing.legal : D.closing.legalPending}
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}
