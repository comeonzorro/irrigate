import "server-only";
import type { PlotConfig, SunExposure } from "@/lib/types";
import {
  getRecommendedVarieties,
  getVarietiesForRegion,
  getVariety,
} from "@/lib/data/crops";

export interface PublicVariety {
  id: string;
  name: string;
  emoji: string;
  color: string;
  cropId: string;
  recommended?: boolean;
}

export function getPublicVarieties(
  regionId: string,
  sun: SunExposure
): { all: PublicVariety[]; recommended: PublicVariety[] } {
  const toPublic = (v: ReturnType<typeof getVarietiesForRegion>[number]): PublicVariety => ({
    id: v.id,
    name: v.name,
    emoji: v.emoji,
    color: v.color,
    cropId: v.cropId,
  });

  const all = getVarietiesForRegion(regionId).map(toPublic);
  const recommendedIds = new Set(
    getRecommendedVarieties(regionId, sun).map((v) => v.id)
  );

  return {
    all,
    recommended: all
      .filter((v) => recommendedIds.has(v.id))
      .map((v) => ({ ...v, recommended: true })),
  };
}

export function getVarietyDisplayMap(
  varietyIds: string[]
): Record<string, { name: string; emoji: string; color: string }> {
  const map: Record<string, { name: string; emoji: string; color: string }> = {};
  for (const id of varietyIds) {
    const v = getVariety(id);
    if (v) map[id] = { name: v.name, emoji: v.emoji, color: v.color };
  }
  return map;
}

export type { PlotConfig };
