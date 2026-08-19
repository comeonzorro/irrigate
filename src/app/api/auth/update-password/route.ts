import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

const MIN_PASSWORD_LENGTH = 8;

export async function POST(request: Request) {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const password = body.password?.trim();
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Mot de passe requis (min. ${MIN_PASSWORD_LENGTH} caractères).` },
      { status: 400 }
    );
  }

  const response = NextResponse.json({ ok: true });
  const supabase = await createRouteHandlerClient(response);
  if (!supabase) {
    return NextResponse.json({ error: "Supabase non configuré." }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Session expirée — refaites une demande de réinitialisation." },
      { status: 401 }
    );
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return response;
}
