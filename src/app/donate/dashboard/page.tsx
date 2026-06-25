import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getDict } from "@/lib/i18n/server";
import { INTELLIGENCES } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Kicker, Badge, LinkButton } from "@/components/ui";
import { Icon } from "@/components/icons";

export default async function SponsorDashboardPage() {
  const { locale, dict } = await getDict();
  const DB = dict.donate.dashboard;
  const user = await getCurrentUser();

  const sponsorship = user
    ? await prisma.sponsorship.findFirst({
        where: { sponsorId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
          chapter: {
            include: {
              country: true,
              updates: { orderBy: { createdAt: "desc" } },
            },
          },
        },
      })
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />
      <main className="container-ac flex-1 py-12">
        <Kicker>{dict.donate.nav.dashboard}</Kicker>
        <h1 className="mt-2 text-3xl font-extrabold text-navy">{DB.title}</h1>
        <p className="mt-1 text-muted">{DB.subtitle}</p>

        {!sponsorship ? (
          <div className="mt-8 rounded-2xl border border-dashed border-surface-line bg-paper p-12 text-center">
            <p className="text-muted">{DB.none}</p>
            <LinkButton href="/donate/sponsor" className="mt-5">
              {dict.donate.nav.sponsor}
            </LinkButton>
          </div>
        ) : (
          (() => {
            const ch = sponsorship.chapter;
            const pct = Math.round((ch.currentWeek / 7) * 100);
            const intel = INTELLIGENCES.find((i) => i.week === ch.currentWeek);
            return (
              <div className="mt-8 grid gap-6 lg:grid-cols-3">
                {/* main column */}
                <div className="space-y-6 lg:col-span-2">
                  <div className="overflow-hidden rounded-2xl border border-surface-line bg-paper">
                    <div className="h-28 bg-gradient-to-br from-navy via-navy-700 to-terra" />
                    <div className="p-6">
                      <h2 className="text-2xl font-extrabold text-navy">{ch.name}</h2>
                      <p className="text-muted">
                        {ch.country.flag} {ch.city}, {ch.country.name}
                        {ch.stake ? ` · ${ch.stake}` : ""}
                      </p>
                      {ch.story && (
                        <p className="mt-3 text-sm leading-relaxed text-ink/85">{ch.story}</p>
                      )}
                    </div>
                  </div>

                  {/* updates */}
                  <div>
                    <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted">
                      {DB.updates}
                    </h3>
                    {ch.updates.length === 0 ? (
                      <p className="rounded-2xl border border-dashed border-surface-line bg-paper p-8 text-center text-sm text-muted">
                        {DB.noUpdates}
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {ch.updates.map((u) => (
                          <article
                            key={u.id}
                            className="rounded-2xl border border-surface-line bg-paper p-5"
                          >
                            <div className="flex items-center gap-2">
                              {u.week != null && (
                                <Badge tone="terra">
                                  {dict.community.chapters.week} {u.week}
                                </Badge>
                              )}
                              <span className="text-xs text-muted">
                                {formatDate(u.createdAt, locale)}
                              </span>
                            </div>
                            <h4 className="mt-2 font-bold text-navy">{u.title}</h4>
                            <p className="mt-1 text-sm leading-relaxed text-ink/85">{u.body}</p>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* sidebar: progress */}
                <aside className="space-y-6">
                  <div className="rounded-2xl border border-surface-line bg-paper p-6">
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted">
                      {DB.progress}
                    </h3>
                    <p className="mt-3 text-3xl font-extrabold text-navy">
                      {dict.community.chapters.week} {ch.currentWeek}
                      <span className="text-lg font-normal text-muted">
                        {" "}
                        {dict.community.chapters.of} 7
                      </span>
                    </p>
                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-cream-200">
                      <div className="h-full rounded-full bg-terra" style={{ width: `${pct}%` }} />
                    </div>
                    {intel && (
                      <div className="mt-5 rounded-xl bg-cream-200/60 p-4">
                        <p className="text-xs uppercase tracking-wide text-muted">
                          {DB.thisWeek}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 font-bold text-terra">
                          <Icon name="sparkles" size={16} />
                          {locale === "es" ? intel.es : intel.en}
                        </p>
                      </div>
                    )}
                    <p className="mt-4 text-sm text-muted">
                      {ch.cohortSize} {dict.community.chapters.cohort}
                    </p>
                  </div>
                </aside>
              </div>
            );
          })()
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
