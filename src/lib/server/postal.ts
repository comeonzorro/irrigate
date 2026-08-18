import "server-only";
import { getRegion } from "@/lib/data/regions";

const DEPT_TO_REGION: Record<string, string> = {
  "01": "auvergne-rhone-alpes",
  "07": "auvergne-rhone-alpes",
  "26": "auvergne-rhone-alpes",
  "38": "auvergne-rhone-alpes",
  "42": "auvergne-rhone-alpes",
  "43": "auvergne-rhone-alpes",
  "63": "auvergne-rhone-alpes",
  "69": "auvergne-rhone-alpes",
  "73": "auvergne-rhone-alpes",
  "74": "auvergne-rhone-alpes",
  "75": "ile-de-france",
  "77": "ile-de-france",
  "78": "ile-de-france",
  "91": "ile-de-france",
  "92": "ile-de-france",
  "93": "ile-de-france",
  "94": "ile-de-france",
  "95": "ile-de-france",
  "16": "nouvelle-aquitaine",
  "17": "nouvelle-aquitaine",
  "24": "nouvelle-aquitaine",
  "33": "nouvelle-aquitaine",
  "40": "nouvelle-aquitaine",
  "47": "nouvelle-aquitaine",
  "64": "nouvelle-aquitaine",
  "79": "nouvelle-aquitaine",
  "86": "nouvelle-aquitaine",
  "87": "nouvelle-aquitaine",
};

const DEPT_NAMES: Record<string, string> = {
  "75": "Paris",
  "77": "Seine-et-Marne",
  "78": "Yvelines",
  "91": "Essonne",
  "92": "Hauts-de-Seine",
  "93": "Seine-Saint-Denis",
  "94": "Val-de-Marne",
  "95": "Val-d'Oise",
  "69": "Rhône",
  "33": "Gironde",
  "38": "Isère",
};

const POSTAL_CITY_HINTS: Record<string, string> = {
  "94450": "Limeil-Brévannes",
  "75001": "Paris",
  "78000": "Versailles",
  "77000": "Melun",
  "69001": "Lyon",
  "33000": "Bordeaux",
};

export interface LocationResult {
  postalCode: string;
  department: string;
  departmentName: string;
  cityHint: string;
  regionId: string;
  regionName: string;
  climateZone: string;
  avgRainfallMm: number;
  frostFreeDays: number;
}

export function normalizePostalCode(input: string): string | null {
  const digits = input.replace(/\D/g, "").slice(0, 5);
  if (digits.length !== 5) return null;
  return digits;
}

export function locateFromPostalCode(input: string): LocationResult | null {
  const postalCode = normalizePostalCode(input);
  if (!postalCode) return null;

  const dept = postalCode.slice(0, 2);
  const regionId = DEPT_TO_REGION[dept] ?? "france";
  const region = getRegion(regionId) ?? getRegion("france")!;
  const departmentName = DEPT_NAMES[dept] ?? `Département ${dept}`;
  const cityHint =
    POSTAL_CITY_HINTS[postalCode] ??
    (dept === "94" && postalCode.startsWith("944")
      ? "Val-de-Marne"
      : departmentName);

  return {
    postalCode,
    department: dept,
    departmentName,
    cityHint,
    regionId: region.id,
    regionName: region.name,
    climateZone: region.climateZone,
    avgRainfallMm: region.avgRainfallMm,
    frostFreeDays: region.frostFreeDays,
  };
}
