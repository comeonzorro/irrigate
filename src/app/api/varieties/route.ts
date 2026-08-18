import { NextResponse } from "next/server";
import { getPublicVarieties } from "@/lib/server/catalog";
import type { SunExposure } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const regionId = searchParams.get("regionId") ?? "france";
  const sun = (searchParams.get("sun") ?? "S") as SunExposure;

  const data = getPublicVarieties(regionId, sun);
  return NextResponse.json(data);
}
