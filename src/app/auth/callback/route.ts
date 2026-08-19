import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        const failPath = buildRedirectPath("/compte", {
          error: "auth_callback_failed",
        });
        return NextResponse.redirect(`${origin}${failPath}`);
      }
    }
  }

  const destination = buildRedirectPath(next, {
    reset: reset ?? (type === "recovery" ? "1" : null),
  });

  return NextResponse.redirect(`${origin}${destination}`);
}
