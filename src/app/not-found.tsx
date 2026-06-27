import { getLocale } from "@/lib/i18n/server";
import { LinkButton } from "@/components/ui";
import { MountainGlyph } from "@/components/Mountain";

export default async function NotFound() {
  const es = (await getLocale()) === "es";
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <MountainGlyph size={56} className="text-terra" />
      <p className="mt-6 font-display text-7xl font-extrabold text-navy">404</p>
      <p className="mt-3 max-w-sm text-muted">
        {es
          ? "Esta página se perdió en la montaña."
          : "This page got lost in the mountains."}
      </p>
      <LinkButton href="/" className="mt-8">
        {es ? "Volver al inicio" : "Back home"}
      </LinkButton>
    </div>
  );
}
