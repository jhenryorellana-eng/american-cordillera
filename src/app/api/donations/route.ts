import { type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Public donation intent. No payment is processed yet (Stripe wired later);
// this records the donor's intent so nothing is lost.
const schema = z.object({
  donorName: z.string().trim().min(2).max(80),
  donorEmail: z.string().trim().email(),
  amount: z.string().trim().max(40).optional(),
  frequency: z.enum(["ONETIME", "MONTHLY"]).optional(),
  tier: z.string().trim().max(40).optional(),
  message: z.string().trim().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => null);
  const parsed = schema.safeParse(data);
  if (!parsed.success) return Response.json({ error: "invalid" }, { status: 400 });

  await prisma.donation.create({
    data: {
      donorName: parsed.data.donorName,
      donorEmail: parsed.data.donorEmail.toLowerCase(),
      amount: parsed.data.amount,
      frequency: parsed.data.frequency ?? "ONETIME",
      tier: parsed.data.tier ?? "ONETIME",
      message: parsed.data.message,
      status: "INTENT",
    },
  });
  return Response.json({ ok: true }, { status: 201 });
}
