import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

function buildRedirectPath(
  next: string,
  extra: Record<string, string | null>
): string {
  const url = new URL(next, "https://irrigate.fr");
  for (const [key, value] of Object.entries(extra)) {
    if (value) url.searchParams.set(key, value);
  }
  return `${url.pathname}${url.search}`;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/compte";
  const reset = searchParams.get("reset");
  const type = searchParams.get("type");

  const destination = buildRedirectPath(next, {
    reset: reset ?? (type === "recovery" ? "1" : null),
  });

  if (!code) {
    return NextResponse.redirect(`${origin}${destination}`);
  }

  const response = NextResponse.redirect(`${origin}${destination}`);
  const supabase = await createRouteHandlerClient(response);
  if (!supabase) {
    return NextResponse.redirect(`${origin}/compte?error=auth_not_configured`);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/compte?error=auth_callback_failed`);
  }

  return response;
}
