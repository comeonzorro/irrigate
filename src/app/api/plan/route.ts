import { NextResponse } from "next/server";
import { generatePlan } from "@/lib/engine/plan";
import { getVarietyDisplayMap } from "@/lib/server/catalog";
import type { PlotConfig } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const config = (await request.json()) as PlotConfig;
    if (
      typeof config.widthM !== "number" ||
      typeof config.lengthM !== "number" ||
      !config.regionId
    ) {
      return NextResponse.json({ error: "Configuration invalide" }, { status: 400 });
    }

    const plan = generatePlan(config);
    const varietyIds = [
      ...new Set([
        ...config.selectedVarieties,
        ...plan.plants.map((p) => p.varietyId),
        ...plan.layoutAdvice.varieties.map((v) => v.varietyId),
      ]),
    ];
    const varietyDisplay = getVarietyDisplayMap(varietyIds);

    return NextResponse.json({ plan, varietyDisplay });
  } catch {
    return NextResponse.json({ error: "Calcul impossible" }, { status: 500 });
  }
}
