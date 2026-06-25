import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/admin/ui";

export default async function AdminSponsorships() {
  const sponsorships = await prisma.sponsorship.findMany({
    include: { chapter: { include: { country: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageTitle>Apadrinamientos</PageTitle>
      <p className="-mt-4 mb-6 text-sm text-muted">
        Relaciones padrino → capítulo registradas.
      </p>

      {sponsorships.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-surface-line bg-paper p-10 text-center text-muted">
          Aún no hay apadrinamientos.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-surface-line bg-paper">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Padrino</th>
                <th className="px-4 py-3">Capítulo</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {sponsorships.map((s) => (
                <tr key={s.id} className="border-t border-surface-line">
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy">{s.sponsorName}</p>
                    <p className="text-xs text-muted">{s.sponsorEmail}</p>
                  </td>
                  <td className="px-4 py-3">
                    {s.chapter.country.flag} {s.chapter.name}
                  </td>
                  <td className="px-4 py-3">{s.status}</td>
                  <td className="px-4 py-3 text-muted">{s.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
