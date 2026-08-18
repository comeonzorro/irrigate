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
    id: "paris",
    name: "Paris",
    level: "commune",
    parentId: "ile-de-france",
    climateZone: "océanique",
    avgRainfallMm: 630,
    frostFreeDays: 215,
  },
  {
    id: "versailles",
    name: "Versailles",
    level: "commune",
    parentId: "ile-de-france",
    climateZone: "océanique",
    avgRainfallMm: 660,
    frostFreeDays: 208,
  },
  {
    id: "melun",
    name: "Melun",
    level: "commune",
    parentId: "ile-de-france",
    climateZone: "océanique dégradé",
    avgRainfallMm: 680,
    frostFreeDays: 200,
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
    id: "lyon",
    name: "Lyon",
    level: "commune",
    parentId: "auvergne-rhone-alpes",
    climateZone: "semi-continental",
    avgRainfallMm: 820,
    frostFreeDays: 220,
  },
  {
    id: "auvergne-rhone-alpes",
    name: "Auvergne-Rhône-Alpes",
    level: "region",
    parentId: "france",
    climateZone: "semi-continental",
    avgRainfallMm: 900,
    frostFreeDays: 195,
  },
  {
    id: "bordeaux",
    name: "Bordeaux",
    level: "commune",
    parentId: "nouvelle-aquitaine",
    climateZone: "océanique",
    avgRainfallMm: 950,
    frostFreeDays: 230,
  },
  {
    id: "nouvelle-aquitaine",
    name: "Nouvelle-Aquitaine",
    level: "region",
    parentId: "france",
    climateZone: "océanique",
    avgRainfallMm: 920,
    frostFreeDays: 225,
  },
  {
    id: "france",
    name: "France (national)",
    level: "pays",
    climateZone: "tempéré",
    avgRainfallMm: 700,
    frostFreeDays: 200,
  },
];

export const COMMUNES = REGIONS.filter((r) => r.level === "commune");
export const REGION_LEVEL = REGIONS.filter((r) => r.level === "region");

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
