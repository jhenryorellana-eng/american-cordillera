"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/client";
import { COMMUNITY_SPACES } from "@/lib/constants";
import { Icon, type IconName } from "@/components/icons";
import { cn } from "@/components/ui";

// Spaces shown as primary tabs in the bottom bar; the rest go in the "More" sheet.
const PRIMARY = ["feed", "posts", "events", "podcast"];

// Short labels keep the tab bar tidy (full labels stay on the desktop sidebar).
const SHORT: Record<string, { en: string; es: string }> = {
  feed: { en: "Feed", es: "Feed" },
  posts: { en: "Posts", es: "Posts" },
  events: { en: "Events", es: "Eventos" },
  podcast: { en: "Podcast", es: "Podcast" },
};

export function CommunityBottomNav({ isMember }: { isMember: boolean }) {
  const { locale, dict } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/community" ? pathname === "/community" : pathname.startsWith(href);
  const label = (key: string) =>
    dict.community.spaces[key as keyof typeof dict.community.spaces];
  const shortLabel = (key: string) =>
    SHORT[key] ? (locale === "es" ? SHORT[key].es : SHORT[key].en) : label(key);

  const primary = COMMUNITY_SPACES.filter((s) => PRIMARY.includes(s.key));
  const secondary = COMMUNITY_SPACES.filter((s) => !PRIMARY.includes(s.key));
  const moreActive = secondary.some((s) => isActive(s.href));
  const moreLabel = locale === "es" ? "Más" : "More";

  return (
    <>
      {/* "More" bottom sheet */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-paper p-5 shadow-2xl"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-surface-line" />
            <p className="mb-3 font-display text-sm font-bold text-navy">{moreLabel}</p>
            <div className="grid grid-cols-2 gap-3">
              {secondary.map((s) => {
                const locked = s.gated && !isMember;
                const active = isActive(s.href);
                return (
                  <Link
                    key={s.key}
                    href={s.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border p-3.5 transition-colors",
                      active
                        ? "border-terra bg-terra-50"
                        : "border-surface-line bg-surface active:border-navy/20",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        active ? "bg-terra text-white" : "bg-paper text-navy",
                      )}
                    >
                      <Icon name={s.icon as IconName} size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-navy">
                        {label(s.key)}
                      </span>
                      {locked && (
                        <span className="text-[0.65rem] text-muted">
                          🔒 {locale === "es" ? "Miembros" : "Members"}
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Fixed bottom tab bar (mobile only) */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-line bg-paper/95 backdrop-blur lg:hidden"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
          boxShadow: "0 -4px 20px rgba(20,35,60,0.06)",
        }}
      >
        <div className="mx-auto flex max-w-xl items-stretch">
          {primary.map((s) => (
            <Tab
              key={s.key}
              href={s.href}
              icon={s.icon as IconName}
              label={shortLabel(s.key)}
              active={isActive(s.href)}
            />
          ))}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5 transition-colors",
              moreActive ? "text-terra" : "text-muted active:text-navy",
            )}
            aria-label={moreLabel}
          >
            {moreActive && (
              <span className="absolute top-0 h-1 w-7 rounded-full bg-terra" />
            )}
            <Icon name="menu" size={22} />
            <span className="text-[0.62rem] font-semibold">{moreLabel}</span>
          </button>
        </div>
      </nav>
    </>
  );
}

function Tab({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: IconName;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5 transition-colors",
        active ? "text-terra" : "text-muted active:text-navy",
      )}
    >
      {active && <span className="absolute top-0 h-1 w-7 rounded-full bg-terra" />}
      <Icon name={icon} size={22} />
      <span className="truncate text-[0.62rem] font-semibold">{label}</span>
    </Link>
  );
}
