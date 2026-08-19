import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

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

  let destination = DEFAULT_DEST;
  if (next && next.startsWith("/")) {
    destination = next;
  } else if (type === "recovery") {
    destination = RECOVERY_DEST;
  }

  const response = NextResponse.redirect(`${origin}${destination}`);
  const supabase = await createRouteHandlerClient(response);
  if (!supabase) {
    return NextResponse.redirect(`${origin}${DEFAULT_DEST}?error=auth_not_configured`);
  }

  const { error } = await supabase.auth.verifyOtp({ token_hash, type });
  if (error) {
    return NextResponse.redirect(`${origin}${DEFAULT_DEST}?error=auth_link_expired`);
  }

  return response;
}
