import "server-only";
import type { SunExposure } from "@/lib/types";
import {
  getRecommendedVarieties,
  getVarietiesForLocation,
  getVariety,
} from "@/lib/data/crops";
import { getRegion } from "@/lib/data/regions";

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
  sun: SunExposure,
  postalCode?: string
): {
  all: PublicVariety[];
  recommended: PublicVariety[];
  regionLabel: string;
} {
  const toPublic = (
    v: ReturnType<typeof getVarietiesForLocation>[number]
  ): PublicVariety => ({
    id: v.id,
    name: v.name,
    emoji: v.emoji,
    color: v.color,
    cropId: v.cropId,
  });

  const all = getVarietiesForLocation(regionId, postalCode).map(toPublic);
  const recommendedIds = new Set(
    getRecommendedVarieties(regionId, sun, postalCode).map((v) => v.id)
  );

  const region = getRegion(regionId);
  const regionLabel =
    postalCode?.length === 5 && region
      ? `${region.name} (${postalCode.slice(0, 2)})`
      : region?.name ?? "France";

  return {
    all,
    recommended: all
      .filter((v) => recommendedIds.has(v.id))
      .map((v) => ({ ...v, recommended: true })),
    regionLabel,
  };
}

export function getVarietyDisplayMap(
  varietyIds: string[]
): Record<string, { name: string; emoji: string; color: string }> {
  const map: Record<string, { name: string; emoji: string; color: string }> =
    {};
  for (const id of varietyIds) {
    const v = getVariety(id);
    if (v) map[id] = { name: v.name, emoji: v.emoji, color: v.color };
  }
  return map;
}
