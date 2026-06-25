import { type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().max(80).optional(),
});

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => null);
  const parsed = schema.safeParse(data);
  if (!parsed.success) return Response.json({ error: "invalid" }, { status: 400 });

  const email = parsed.data.email.toLowerCase();
  await prisma.newsletterSignup.upsert({
    where: { email },
    update: { name: parsed.data.name },
    create: { email, name: parsed.data.name },
  });
  return Response.json({ ok: true }, { status: 201 });
}
