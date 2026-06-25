"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/client";
import { Button, cn } from "@/components/ui";
import { Icon } from "@/components/icons";

export function RsvpButton({
  eventId,
  initialGoing,
  initialCount,
  loggedIn,
}: {
  eventId: string;
  initialGoing: boolean;
  initialCount: number;
  loggedIn: boolean;
}) {
  const { dict } = useI18n();
  const router = useRouter();
  const [going, setGoing] = useState(initialGoing);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!loggedIn) {
      router.push("/login");
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/events/${eventId}/rsvp`, { method: "POST" });
    if (res.ok) {
      const j = await res.json();
      setGoing(j.going);
      setCount(j.count);
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        size="sm"
        variant={going ? "secondary" : "outline"}
        onClick={toggle}
        disabled={loading}
        className={cn(going && "gap-1.5")}
      >
        {going && <Icon name="check" size={15} />}
        {going ? dict.community.events.youAreGoing : dict.community.events.rsvp}
      </Button>
      {count > 0 && (
        <span className="text-xs text-muted">
          {count} {dict.community.events.attendees}
        </span>
      )}
    </div>
  );
}
