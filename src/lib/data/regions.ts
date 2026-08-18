import type { Region } from "../types";

export const REGIONS: Region[] = [
  {
    id: "limeil-brevannes",
    name: "Limeil-Brévannes",
    level: "commune",
    parentId: "ile-de-france",
    climateZone: "océanique dégradé",
    avgRainfallMm: 650,
    frostFreeDays: 210,
  },
  {
    id: "ile-de-france",
    name: "Île-de-France",
    level: "region",
    parentId: "france",
    climateZone: "océanique",
    avgRainfallMm: 640,
    frostFreeDays: 205,
  },
  {
    id: "france",
    name: "France",
    level: "pays",
    climateZone: "tempéré",
    avgRainfallMm: 700,
    frostFreeDays: 200,
  },
];

export function getRegion(id: string): Region | undefined {
  return REGIONS.find((r) => r.id === id);
}

export function getRegionHierarchy(id: string): Region[] {
  const result: Region[] = [];
  let current = getRegion(id);
  while (current) {
    result.unshift(current);
    current = current.parentId ? getRegion(current.parentId) : undefined;
  }
  return result;
}
