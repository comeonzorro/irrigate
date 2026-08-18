import { NextResponse } from "next/server";
import { locateFromPostalCode } from "@/lib/server/postal";

export async function POST(request: Request) {
  try {
    const { postalCode } = await request.json();
    if (typeof postalCode !== "string") {
      return NextResponse.json({ error: "Code postal invalide" }, { status: 400 });
    }
    const location = locateFromPostalCode(postalCode);
    if (!location) {
      return NextResponse.json(
        { error: "Entrez un code postal français à 5 chiffres" },
        { status: 400 }
      );
    }
    return NextResponse.json(location);
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
}
