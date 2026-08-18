import "server-only";
import { getRegion } from "@/lib/data/regions";

const DEPT_TO_REGION: Record<string, string> = {
  // Auvergne-Rhône-Alpes
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
  // Île-de-France
  "75": "ile-de-france",
  "77": "ile-de-france",
  "78": "ile-de-france",
  "91": "ile-de-france",
  "92": "ile-de-france",
  "93": "ile-de-france",
  "94": "ile-de-france",
  "95": "ile-de-france",
  // Nouvelle-Aquitaine
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
  // Bretagne
  "22": "bretagne",
  "29": "bretagne",
  "35": "bretagne",
  "56": "bretagne",
  // Normandie
  "14": "normandie",
  "27": "normandie",
  "50": "normandie",
  "61": "normandie",
  "76": "normandie",
  // Pays de la Loire
  "44": "pays-de-la-loire",
  "49": "pays-de-la-loire",
  "53": "pays-de-la-loire",
  "72": "pays-de-la-loire",
  "85": "pays-de-la-loire",
  // Occitanie
  "09": "occitanie",
  "11": "occitanie",
  "12": "occitanie",
  "30": "occitanie",
  "31": "occitanie",
  "32": "occitanie",
  "34": "occitanie",
  "46": "occitanie",
  "48": "occitanie",
  "65": "occitanie",
  "66": "occitanie",
  "81": "occitanie",
  "82": "occitanie",
  // PACA
  "04": "provence-alpes-cote-azur",
  "05": "provence-alpes-cote-azur",
  "06": "provence-alpes-cote-azur",
  "13": "provence-alpes-cote-azur",
  "83": "provence-alpes-cote-azur",
  "84": "provence-alpes-cote-azur",
  // Hauts-de-France
  "02": "hauts-de-france",
  "59": "hauts-de-france",
  "60": "hauts-de-france",
  "62": "hauts-de-france",
  "80": "hauts-de-france",
  // Grand Est
  "08": "grand-est",
  "10": "grand-est",
  "51": "grand-est",
  "52": "grand-est",
  "54": "grand-est",
  "55": "grand-est",
  "57": "grand-est",
  "67": "grand-est",
  "68": "grand-est",
  "88": "grand-est",
};

const DEPT_NAMES: Record<string, string> = {
  "22": "Côtes-d'Armor",
  "29": "Finistère",
  "35": "Ille-et-Vilaine",
  "56": "Morbihan",
  "75": "Paris",
  "77": "Seine-et-Marne",
  "94": "Val-de-Marne",
  "69": "Rhône",
  "33": "Gironde",
  "38": "Isère",
  "44": "Loire-Atlantique",
  "59": "Nord",
  "13": "Bouches-du-Rhône",
  "31": "Haute-Garonne",
};

const POSTAL_CITY_HINTS: Record<string, string> = {
  "94450": "Limeil-Brévannes",
  "75001": "Paris",
  "69001": "Lyon",
  "33000": "Bordeaux",
  "35000": "Rennes",
  "29200": "Brest",
  "56000": "Vannes",
  "22000": "Saint-Brieuc",
  "44000": "Nantes",
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
  const cityHint = POSTAL_CITY_HINTS[postalCode] ?? departmentName;

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
