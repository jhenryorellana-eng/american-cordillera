import { getDict } from "@/lib/i18n/server";
import { INTELLIGENCES, BRAND } from "@/lib/constants";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LinkButton, Kicker, Badge } from "@/components/ui";
import { MountainGlyph, MountainDivider } from "@/components/Mountain";
import { Icon } from "@/components/icons";
import { Reveal, RevealSection } from "@/components/motion";

export default async function LandingPage() {
  const { locale, dict } = await getDict();
  const L = dict.landing;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden">
        <div className="container-ac grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
          <Reveal>
            <Kicker>{L.kicker}</Kicker>
            <h1 className="mt-5 text-5xl font-extrabold leading-[1.04] tracking-tight text-navy sm:text-6xl">
              {L.h1a}
              <br />
              <span className="text-terra">{L.h1b}</span>
            </h1>
            <p className="mt-6 max-w-md font-serif text-lg leading-relaxed text-ink/85">
              {L.lead}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <LinkButton href="/community" size="lg">
                {L.ctaCommunity}
                <Icon name="arrowRight" size={18} />
              </LinkButton>
              <LinkButton href="/donate" size="lg" variant="outline">
                {L.ctaDonate}
              </LinkButton>
            </div>
          </Reveal>

          {/* Brand visual card */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-navy via-navy-700 to-terra shadow-xl">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                <MountainGlyph size={84} className="text-white/90" />
                <p className="mt-5 font-display text-2xl font-extrabold uppercase tracking-[0.2em]">
                  American
                </p>
                <p className="font-display text-2xl font-light uppercase tracking-[0.3em]">
                  Cordillera
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.25em] text-white/55">
                  Est. {BRAND.est}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- MODEL IN THREE WORDS ---------------- */}
      <RevealSection className="container-ac py-16">
        <Kicker>{L.modelKicker}</Kicker>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            { n: "01", t: L.learn, d: L.learnDesc },
            { n: "02", t: L.build, d: L.buildDesc },
            { n: "03", t: L.sell, d: L.sellDesc },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-line bg-paper p-7 transition-shadow hover:shadow-sm"
            >
              <span className="font-display text-2xl font-extrabold text-terra">
                {s.n}
              </span>
              <h3 className="mt-3 text-xl font-bold text-navy">{s.t}</h3>
              <p className="mt-1.5 text-sm text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* ---------------- THREE SPACES ---------------- */}
      <RevealSection className="container-ac py-16">
        <Kicker>{L.spacesKicker}</Kicker>
        <h2 className="mt-3 max-w-xl text-4xl font-extrabold leading-tight text-navy">
          {L.spacesTitle}
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              t: L.spaceCommunity,
              tag: L.spaceCommunityTag,
              d: L.spaceCommunityDesc,
              tone: "terra" as const,
            },
            {
              t: L.spaceGenesix,
              tag: L.spaceGenesixTag,
              d: L.spaceGenesixDesc,
              tone: "navy" as const,
            },
            {
              t: L.spaceObservatory,
              tag: L.spaceObservatoryTag,
              d: L.spaceObservatoryDesc,
              tone: "green" as const,
            },
          ].map((s) => (
            <div key={s.t} className="rounded-2xl border border-line bg-paper p-7">
              <Badge tone={s.tone}>{s.tag}</Badge>
              <h3 className="mt-4 text-xl font-bold text-navy">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* ---------------- PILOT TRUJILLO ---------------- */}
      <RevealSection className="container-ac py-16">
        <div className="rounded-3xl border border-line bg-cream-200/60 p-8 md:p-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Kicker>{L.pilotKicker}</Kicker>
              <h2 className="mt-2 text-4xl font-extrabold text-navy">
                {L.pilotTitle.split(" ")[0]}{" "}
                <span className="text-terra">
                  {L.pilotTitle.split(" ").slice(1).join(" ")}
                </span>
              </h2>
            </div>
            <Badge tone="terra" className="px-4 py-1.5 text-sm">
              7 {locale === "es" ? "semanas" : "weeks"}
            </Badge>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Trujillo, Perú", locale === "es" ? "Dónde" : "Where"],
              ["30 " + (locale === "es" ? "jóvenes" : "youth"), "Estaca Laureles"],
              [
                locale === "es" ? "Un padrino" : "One sponsor",
                locale === "es" ? "Apadrina el capítulo" : "Sponsors the chapter",
              ],
              [
                locale === "es" ? "Historias de éxito" : "Success stories",
                locale === "es" ? "Productos vendidos a EE.UU." : "Products sold to the US",
              ],
            ].map(([big, small]) => (
              <div key={big}>
                <p className="text-lg font-bold text-navy">{big}</p>
                <p className="text-sm text-muted">{small}</p>
              </div>
            ))}
          </div>

          <div className="mt-9 border-t border-line pt-6">
            <p className="mb-3 font-display text-xs font-semibold uppercase tracking-wider text-muted">
              {locale === "es" ? "Una inteligencia por semana" : "One intelligence per week"}
            </p>
            <div className="flex flex-wrap gap-2">
              {INTELLIGENCES.map((i) => (
                <span
                  key={i.week}
                  className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1 text-sm text-navy ring-1 ring-line"
                >
                  <span className="font-semibold text-terra">{i.week}</span>
                  {locale === "es" ? i.es : i.en}
                </span>
              ))}
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ---------------- PROMISE BAND ---------------- */}
      <RevealSection className="relative mt-8 bg-navy">
        <div className="container-ac py-16 text-center">
          <Kicker className="text-terra-bright">
            {locale === "es" ? "La promesa" : "The promise"}
          </Kicker>
          <p className="mx-auto mt-4 max-w-3xl font-serif text-3xl leading-snug text-white sm:text-4xl">
            {L.promise.split(":")[0]}:{" "}
            <span className="italic text-terra-bright">{L.promise.split(":")[1]}</span>
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <LinkButton href="/community" size="lg">
              {L.ctaCommunity}
            </LinkButton>
            <LinkButton href="/donate" size="lg" variant="outlineLight">
              {L.ctaDonate}
            </LinkButton>
          </div>
        </div>
      </RevealSection>

      <SiteFooter />
    </div>
  );
}
