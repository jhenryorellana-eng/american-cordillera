import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/admin/ui";
import { Badge } from "@/components/ui";

export default async function AdminDonations() {
  const donations = await prisma.donation.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageTitle>Donaciones</PageTitle>
      <p className="-mt-4 mb-6 text-sm text-muted">
        Intenciones de donación registradas (los pagos se conectan más adelante).
      </p>

      {donations.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-surface-line bg-paper p-10 text-center text-muted">
          Aún no hay donaciones registradas.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-surface-line bg-paper">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Donante</th>
                <th className="px-4 py-3">Nivel</th>
                <th className="px-4 py-3">Frecuencia</th>
                <th className="px-4 py-3">Monto</th>
                <th className="px-4 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id} className="border-t border-surface-line">
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy">{d.donorName}</p>
                    <p className="text-xs text-muted">{d.donorEmail}</p>
                  </td>
                  <td className="px-4 py-3">{d.tier}</td>
                  <td className="px-4 py-3">{d.frequency}</td>
                  <td className="px-4 py-3">{d.amount ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{d.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
