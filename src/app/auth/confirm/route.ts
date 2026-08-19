import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const RECOVERY_DEST = "/compte?reset=1";
const DEFAULT_DEST = "/compte";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");

  if (!token_hash || !type) {
    return NextResponse.redirect(`${origin}${DEFAULT_DEST}?error=auth_link_invalid`);
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.redirect(`${origin}${DEFAULT_DEST}?error=auth_not_configured`);
  }

  const { error } = await supabase.auth.verifyOtp({ token_hash, type });
  if (error) {
    return NextResponse.redirect(`${origin}${DEFAULT_DEST}?error=auth_link_expired`);
  }

  if (next && next.startsWith("/")) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  const destination = type === "recovery" ? RECOVERY_DEST : DEFAULT_DEST;
  return NextResponse.redirect(`${origin}${destination}`);
}
