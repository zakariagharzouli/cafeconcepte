import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(80),
  phone: z
    .string()
    .trim()
    .min(8, "Numéro invalide")
    .max(20)
    .regex(/^[+0-9 ().-]+$/, "Numéro invalide"),
  email: z.string().trim().email("Email invalide").max(120),
  subject: z.enum([
    "Contact général",
    "Traiteur — Demande de devis",
    "Commande à emporter",
    "Autre demande",
  ]),
  message: z.string().trim().min(10, "Message trop court").max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Vérifiez les champs du formulaire.",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const saved = await db.contactMessage.create({ data: parsed.data });

    return NextResponse.json({ ok: true, id: saved.id }, { status: 201 });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { ok: false, error: "Une erreur est survenue. Réessayez ou appelez-nous." },
      { status: 500 }
    );
  }
}
