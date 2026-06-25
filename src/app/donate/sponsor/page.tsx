import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getDict } from "@/lib/i18n/server";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Kicker } from "@/components/ui";
import { SponsorFlow, type CountryDTO } from "@/components/donate/SponsorFlow";

export default async function SponsorPage() {
  const { dict } = await getDict();
  const S = dict.donate.sponsor;
  const user = await getCurrentUser();

  const countries = await prisma.country.findMany({
    include: { chapters: { orderBy: { createdAt: "asc" } } },
    orderBy: { name: "asc" },
  });

  const dto: CountryDTO[] = countries
    .map((c) => ({
      id: c.id,
      name: c.name,
      code: c.code,
      flag: c.flag,
      chapters: c.chapters.map((ch) => ({
        id: ch.id,
        name: ch.name,
        city: ch.city,
        slug: ch.slug,
        stake: ch.stake,
        status: ch.status,
        cohortSize: ch.cohortSize,
        currentWeek: ch.currentWeek,
      })),
    }))
    .sort((a, b) => b.chapters.length - a.chapters.length || a.name.localeCompare(b.name));

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container-ac flex-1 py-12">
        <div className="max-w-3xl">
          <Kicker>{S.kicker}</Kicker>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-navy sm:text-5xl">
            {S.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink/85">{S.intro}</p>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">{S.follow}</p>
        </div>

        {/* pilot callout */}
        <div className="my-8 rounded-2xl border-l-4 border-terra bg-cream-200/60 p-5">
          <p className="font-bold text-terra">{S.pilotBadge}</p>
          <p className="mt-1 text-sm text-ink/85">{S.pilotText}</p>
        </div>

        <div className="rounded-3xl border border-line bg-paper p-6 sm:p-8">
          <h2 className="mb-6 font-display text-sm font-semibold uppercase tracking-wider text-muted">
            {S.steps}
          </h2>
          <SponsorFlow
            countries={dto}
            prefill={user ? { name: user.name, email: user.email } : null}
          />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
