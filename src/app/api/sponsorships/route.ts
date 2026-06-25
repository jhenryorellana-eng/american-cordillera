import { type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Sponsor-a-chapter intent. Registers the sponsorship → chapter relationship.
// Payment is wired later; this captures intent and links the sponsor.
const schema = z.object({
  sponsorName: z.string().trim().min(2).max(80),
  sponsorEmail: z.string().trim().email(),
  chapterId: z.string().min(1),
  message: z.string().trim().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => null);
  const parsed = schema.safeParse(data);
  if (!parsed.success) return Response.json({ error: "invalid" }, { status: 400 });

  const chapter = await prisma.chapter.findUnique({
    where: { id: parsed.data.chapterId },
  });
  if (!chapter) return Response.json({ error: "not_found" }, { status: 404 });

  const session = await getSession();

  await prisma.sponsorship.create({
    data: {
      chapterId: chapter.id,
      sponsorId: session?.sub ?? null,
      sponsorName: parsed.data.sponsorName,
      sponsorEmail: parsed.data.sponsorEmail.toLowerCase(),
      message: parsed.data.message,
      status: "PENDING",
    },
  });
  return Response.json({ ok: true }, { status: 201 });
}
