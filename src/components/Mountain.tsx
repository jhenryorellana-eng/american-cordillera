import Link from "next/link";

/** Small circular mountain glyph used in the logo. */
export function MountainGlyph({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden
    >
      <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
      <path
        d="M8 27 L16 15 L21 22 L26 13 L32 27 Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path d="M6 30 H34" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const color = tone === "light" ? "text-white" : "text-navy";
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 ${color} ${className ?? ""}`}
    >
      <MountainGlyph className={tone === "light" ? "text-white" : "text-terra"} />
      <span className="font-display text-[0.92rem] uppercase tracking-[0.18em] leading-none">
        <span className="font-extrabold">American</span>{" "}
        <span className="font-light">Cordillera</span>
      </span>
    </Link>
  );
}

/**
 * Layered cordillera divider. Place at the bottom of hero/closing sections.
 * `variant` picks colors that sit on a cream or navy background.
 */
export function MountainDivider({
  variant = "cream",
  className,
}: {
  variant?: "cream" | "navy";
  className?: string;
}) {
  const c =
    variant === "navy"
      ? { back: "#22395a", mid: "#1b2f4c", front: "#22395a", strip: "#c75b33" }
      : { back: "#ece4d4", mid: "#e3d8c3", front: "#ece4d4", strip: "#c75b33" };
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={`block w-full ${className ?? ""}`}
      aria-hidden
    >
      <polygon points="0,120 200,46 400,120" fill={c.back} />
      <polygon points="240,120 520,28 800,120" fill={c.mid} />
      <polygon points="640,120 920,40 1200,120" fill={c.front} />
      <polygon points="0,120 180,60 360,120" fill={c.mid} opacity="0.7" />
      <rect x="0" y="112" width="1200" height="8" fill={c.strip} />
    </svg>
  );
}
