"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/client";
import { COMMUNITY_SPACES } from "@/lib/constants";
import { Icon, type IconName } from "@/components/icons";
import { cn } from "@/components/ui";

/**
 * Mobile community navigation (lg:hidden):
 * a sticky top bar with a menu button + the current space name,
 * opening a left slide-in drawer. Top-anchored so it never fights the
 * browser's own bottom chrome.
 */
export function CommunityMobileNav({ isMember }: { isMember: boolean }) {
  const { dict } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/community" ? pathname === "/community" : pathname.startsWith(href);
  const label = (key: string) =>
    dict.community.spaces[key as keyof typeof dict.community.spaces];

  const current =
    [...COMMUNITY_SPACES].reverse().find((s) => isActive(s.href)) ?? COMMUNITY_SPACES[0];

  return (
    <div className="lg:hidden">
      {/* sticky top bar */}
      <div className="sticky top-16 z-30 border-b border-surface-line bg-surface/95 backdrop-blur">
        <div className="container-ac flex h-12 items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={dict.nav.community}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-line bg-paper text-navy active:bg-navy/[0.05]"
          >
            <Icon name="menu" size={20} />
          </button>
          <span className="flex items-center gap-2 text-navy">
            <Icon name={current.icon as IconName} size={18} className="text-terra" />
            <span className="font-display text-sm font-bold">{label(current.key)}</span>
          </span>
        </div>
      </div>

      {/* drawer */}
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-80 max-w-[84%] flex-col bg-paper shadow-2xl">
            <div className="flex items-center justify-between border-b border-surface-line px-4 py-3.5">
              <span className="font-display text-sm font-bold uppercase tracking-wider text-muted">
                {dict.nav.community}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted active:bg-navy/[0.05]"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3">
              {COMMUNITY_SPACES.map((s) => {
                const active = isActive(s.href);
                const locked = s.gated && !isMember;
                return (
                  <Link
                    key={s.key}
                    href={s.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] font-medium transition-colors",
                      active ? "bg-navy text-white" : "text-ink active:bg-navy/[0.05]",
                    )}
                  >
                    <Icon name={s.icon as IconName} size={20} />
                    <span>{label(s.key)}</span>
                    {locked && <Icon name="lock" size={14} className="ml-auto opacity-60" />}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
