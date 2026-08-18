import { NextResponse } from "next/server";
import { getRecommendedProducts } from "@/lib/server/products";
import type { PlotConfig } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const config = (await request.json()) as PlotConfig;
    const products = getRecommendedProducts(config);
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: [] }, { status: 400 });
  }
}
