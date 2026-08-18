import "server-only";
import type { Crop, CropVariety, SunExposure } from "../types";
import { getRegion } from "./regions";

export const CROPS: Crop[] = [
  { id: "tomate", name: "Tomate", category: "legume", basePricePerKg: 4.5 },
  { id: "courgette", name: "Courgette", category: "legume", basePricePerKg: 2.8 },
  { id: "salade", name: "Salade", category: "legume", basePricePerKg: 3.2 },
  { id: "carotte", name: "Carotte", category: "legume", basePricePerKg: 2.0 },
  { id: "haricot", name: "Haricot vert", category: "legume", basePricePerKg: 5.0 },
  { id: "poivron", name: "Poivron", category: "legume", basePricePerKg: 6.0 },
  { id: "basilic", name: "Basilic", category: "herbe", basePricePerKg: 25.0 },
  { id: "fraisier", name: "Fraisier", category: "fruit", basePricePerKg: 8.0 },
  { id: "melon", name: "Melon", category: "fruit", basePricePerKg: 3.5 },
];

export const VARIETIES: CropVariety[] = [
  // —— Île-de-France ——
  {
    id: "tomate-cerise-idf",
    name: "Tomate cerise « Sweet Million »",
    cropId: "tomate",
    regionIds: ["ile-de-france"],
    sunPreference: ["S", "E", "O"],
    spacingCm: { row: 80, plant: 50 },
    waterLitersPerWeek: 8,
    yieldKgPerPlant: 4.5,
    daysToHarvest: 75,
    season: "ete",
    emoji: "🍅",
    color: "#e74c3c",
  },
  {
    id: "tomate-beef-idf",
    name: "Tomate cœur de bœuf « Marmande »",
    cropId: "tomate",
    regionIds: ["ile-de-france"],
    sunPreference: ["S"],
    spacingCm: { row: 100, plant: 70 },
    waterLitersPerWeek: 12,
    yieldKgPerPlant: 6.0,
    daysToHarvest: 90,
    season: "ete",
    emoji: "🍅",
    color: "#c0392b",
  },
  {
    id: "courgette-idf",
    name: "Courgette « Black Beauty »",
    cropId: "courgette",
    regionIds: ["ile-de-france"],
    sunPreference: ["S", "E"],
    spacingCm: { row: 100, plant: 80 },
    waterLitersPerWeek: 10,
    yieldKgPerPlant: 8.0,
    daysToHarvest: 55,
    season: "ete",
    emoji: "🥒",
    color: "#27ae60",
  },
  {
    id: "salade-idf",
    name: "Laitue « Batavia »",
    cropId: "salade",
    regionIds: ["ile-de-france"],
    sunPreference: ["E", "O", "N"],
    spacingCm: { row: 30, plant: 25 },
    waterLitersPerWeek: 3,
    yieldKgPerPlant: 0.4,
    daysToHarvest: 45,
    season: "printemps",
    emoji: "🥬",
    color: "#2ecc71",
  },
  {
    id: "haricot-idf",
    name: "Haricot vert « Contender »",
    cropId: "haricot",
    regionIds: ["ile-de-france"],
    sunPreference: ["S", "E"],
    spacingCm: { row: 40, plant: 10 },
    waterLitersPerWeek: 4,
    yieldKgPerPlant: 1.2,
    daysToHarvest: 60,
    season: "ete",
    emoji: "🫛",
    color: "#1abc9c",
  },
  {
    id: "basilic-idf",
    name: "Basilic « Genovese »",
    cropId: "basilic",
    regionIds: ["ile-de-france"],
    sunPreference: ["S", "E"],
    spacingCm: { row: 30, plant: 20 },
    waterLitersPerWeek: 3,
    yieldKgPerPlant: 0.3,
    daysToHarvest: 40,
    season: "ete",
    emoji: "🌿",
    color: "#16a085",
  },
  {
    id: "fraisier-idf",
    name: "Fraisier « Gariguette »",
    cropId: "fraisier",
    regionIds: ["ile-de-france"],
    departmentIds: ["77", "78", "91", "92", "93", "94", "95"],
    sunPreference: ["S", "E", "O"],
    spacingCm: { row: 35, plant: 30 },
    waterLitersPerWeek: 5,
    yieldKgPerPlant: 0.8,
    daysToHarvest: 60,
    season: "perenne",
    emoji: "🍓",
    color: "#e84393",
  },
  {
    id: "carotte-idf",
    name: "Carotte « Nantaise »",
    cropId: "carotte",
    regionIds: ["ile-de-france"],
    sunPreference: ["S", "E", "O"],
    spacingCm: { row: 30, plant: 5 },
    waterLitersPerWeek: 2,
    yieldKgPerPlant: 0.5,
    daysToHarvest: 70,
    season: "printemps",
    emoji: "🥕",
    color: "#e67e22",
  },

  // —— Auvergne-Rhône-Alpes ——
  {
    id: "tomate-saint-pierre-ara",
    name: "Tomate « Saint-Pierre »",
    cropId: "tomate",
    regionIds: ["auvergne-rhone-alpes"],
    sunPreference: ["S", "E"],
    spacingCm: { row: 90, plant: 60 },
    waterLitersPerWeek: 10,
    yieldKgPerPlant: 5.5,
    daysToHarvest: 85,
    season: "ete",
    emoji: "🍅",
    color: "#d35400",
  },
  {
    id: "poivron-ara",
    name: "Poivron « California Wonder »",
    cropId: "poivron",
    regionIds: ["auvergne-rhone-alpes"],
    sunPreference: ["S"],
    spacingCm: { row: 60, plant: 45 },
    waterLitersPerWeek: 7,
    yieldKgPerPlant: 2.5,
    daysToHarvest: 80,
    season: "ete",
    emoji: "🫑",
    color: "#27ae60",
  },
  {
    id: "courgette-ara",
    name: "Courgette « Verte non coureuse »",
    cropId: "courgette",
    regionIds: ["auvergne-rhone-alpes"],
    sunPreference: ["S", "E"],
    spacingCm: { row: 100, plant: 80 },
    waterLitersPerWeek: 11,
    yieldKgPerPlant: 7.5,
    daysToHarvest: 50,
    season: "ete",
    emoji: "🥒",
    color: "#2ecc71",
  },
  {
    id: "haricot-ara",
    name: "Haricot « Cobra »",
    cropId: "haricot",
    regionIds: ["auvergne-rhone-alpes"],
    sunPreference: ["S", "E"],
    spacingCm: { row: 45, plant: 10 },
    waterLitersPerWeek: 5,
    yieldKgPerPlant: 1.4,
    daysToHarvest: 58,
    season: "ete",
    emoji: "🫛",
    color: "#16a085",
  },
  {
    id: "basilic-ara",
    name: "Basilic « Grand Vert »",
    cropId: "basilic",
    regionIds: ["auvergne-rhone-alpes"],
    sunPreference: ["S", "E", "O"],
    spacingCm: { row: 30, plant: 20 },
    waterLitersPerWeek: 4,
    yieldKgPerPlant: 0.35,
    daysToHarvest: 45,
    season: "ete",
    emoji: "🌿",
    color: "#1e8449",
  },
  {
    id: "fraisier-mara-ara",
    name: "Fraisier « Mara des bois »",
    cropId: "fraisier",
    regionIds: ["auvergne-rhone-alpes"],
    sunPreference: ["S", "E", "O"],
    spacingCm: { row: 35, plant: 30 },
    waterLitersPerWeek: 5,
    yieldKgPerPlant: 0.7,
    daysToHarvest: 65,
    season: "perenne",
    emoji: "🍓",
    color: "#c0392b",
  },
  {
    id: "salade-ara",
    name: "Salade « Reine des glaces »",
    cropId: "salade",
    regionIds: ["auvergne-rhone-alpes"],
    sunPreference: ["E", "O", "N"],
    spacingCm: { row: 30, plant: 25 },
    waterLitersPerWeek: 3,
    yieldKgPerPlant: 0.35,
    daysToHarvest: 50,
    season: "printemps",
    emoji: "🥬",
    color: "#58d68d",
  },

  // —— Nouvelle-Aquitaine ——
  {
    id: "tomate-rose-naq",
    name: "Tomate « Rose de Berne »",
    cropId: "tomate",
    regionIds: ["nouvelle-aquitaine"],
    sunPreference: ["S", "E", "O"],
    spacingCm: { row: 90, plant: 65 },
    waterLitersPerWeek: 11,
    yieldKgPerPlant: 5.8,
    daysToHarvest: 88,
    season: "ete",
    emoji: "🍅",
    color: "#e91e63",
  },
  {
    id: "melon-charentais-naq",
    name: "Melon « Charentais »",
    cropId: "melon",
    regionIds: ["nouvelle-aquitaine"],
    departmentIds: ["16", "17", "79", "86"],
    sunPreference: ["S"],
    spacingCm: { row: 150, plant: 100 },
    waterLitersPerWeek: 15,
    yieldKgPerPlant: 2.0,
    daysToHarvest: 95,
    season: "ete",
    emoji: "🍈",
    color: "#f1c40f",
  },
  {
    id: "courgette-naq",
    name: "Courgette « Ronde de Nice »",
    cropId: "courgette",
    regionIds: ["nouvelle-aquitaine"],
    sunPreference: ["S", "E"],
    spacingCm: { row: 100, plant: 80 },
    waterLitersPerWeek: 10,
    yieldKgPerPlant: 7.0,
    daysToHarvest: 52,
    season: "ete",
    emoji: "🥒",
    color: "#239b56",
  },
  {
    id: "carotte-naq",
    name: "Carotte « Touchon »",
    cropId: "carotte",
    regionIds: ["nouvelle-aquitaine"],
    sunPreference: ["S", "E", "O"],
    spacingCm: { row: 30, plant: 5 },
    waterLitersPerWeek: 2,
    yieldKgPerPlant: 0.55,
    daysToHarvest: 65,
    season: "printemps",
    emoji: "🥕",
    color: "#ca6f1e",
  },
  {
    id: "poivron-naq",
    name: "Poivron « Lamuyo »",
    cropId: "poivron",
    regionIds: ["nouvelle-aquitaine"],
    sunPreference: ["S", "E"],
    spacingCm: { row: 60, plant: 45 },
    waterLitersPerWeek: 8,
    yieldKgPerPlant: 2.2,
    daysToHarvest: 85,
    season: "ete",
    emoji: "🫑",
    color: "#e74c3c",
  },
  {
    id: "haricot-naq",
    name: "Haricot « Provider »",
    cropId: "haricot",
    regionIds: ["nouvelle-aquitaine"],
    sunPreference: ["S", "E"],
    spacingCm: { row: 40, plant: 10 },
    waterLitersPerWeek: 4,
    yieldKgPerPlant: 1.3,
    daysToHarvest: 55,
    season: "ete",
    emoji: "🫛",
    color: "#148f77",
  },
  {
    id: "salade-naq",
    name: "Salade « Rougette de Montpellier »",
    cropId: "salade",
    regionIds: ["nouvelle-aquitaine"],
    sunPreference: ["E", "O", "N"],
    spacingCm: { row: 30, plant: 25 },
    waterLitersPerWeek: 3,
    yieldKgPerPlant: 0.38,
    daysToHarvest: 48,
    season: "printemps",
    emoji: "🥬",
    color: "#82e0aa",
  },

  // —— France (fallback sans code postal précis) ——
  {
    id: "tomate-national",
    name: "Tomate « Moneymaker »",
    cropId: "tomate",
    regionIds: ["france"],
    sunPreference: ["S", "E", "O"],
    spacingCm: { row: 80, plant: 55 },
    waterLitersPerWeek: 9,
    yieldKgPerPlant: 4.0,
    daysToHarvest: 80,
    season: "ete",
    emoji: "🍅",
    color: "#e74c3c",
  },
  {
    id: "salade-national",
    name: "Laitue « Great Lakes »",
    cropId: "salade",
    regionIds: ["france"],
    sunPreference: ["E", "O", "N"],
    spacingCm: { row: 30, plant: 25 },
    waterLitersPerWeek: 3,
    yieldKgPerPlant: 0.35,
    daysToHarvest: 50,
    season: "printemps",
    emoji: "🥬",
    color: "#2ecc71",
  },
  {
    id: "carotte-national",
    name: "Carotte « Amsterdam »",
    cropId: "carotte",
    regionIds: ["france"],
    sunPreference: ["S", "E", "O"],
    spacingCm: { row: 30, plant: 5 },
    waterLitersPerWeek: 2,
    yieldKgPerPlant: 0.45,
    daysToHarvest: 68,
    season: "printemps",
    emoji: "🥕",
    color: "#e67e22",
  },
];

export function getCrop(id: string): Crop | undefined {
  return CROPS.find((c) => c.id === id);
}

export function getVariety(id: string): CropVariety | undefined {
  return VARIETIES.find((v) => v.id === id);
}

function buildRegionHierarchy(regionId: string): string[] {
  const hierarchy = [regionId];
  let region = getRegion(regionId);
  while (region?.parentId) {
    hierarchy.push(region.parentId);
    region = getRegion(region.parentId);
  }
  return hierarchy;
}

function matchesDepartment(
  variety: CropVariety,
  department: string | undefined
): boolean {
  if (!variety.departmentIds || variety.departmentIds.length === 0) return true;
  if (!department) return true;
  return variety.departmentIds.includes(department);
}

export function getVarietiesForLocation(
  regionId: string,
  postalCode?: string
): CropVariety[] {
  const hierarchy = buildRegionHierarchy(regionId);
  const department = postalCode?.length === 5 ? postalCode.slice(0, 2) : undefined;

  const matched = VARIETIES.filter((v) => {
    const regionMatch = v.regionIds.some((rid) => hierarchy.includes(rid));
    if (!regionMatch) return false;
    return matchesDepartment(v, department);
  });

  if (regionId !== "france" && matched.length > 0) {
    const regionalOnly = matched.filter((v) => !v.regionIds.includes("france"));
    if (regionalOnly.length > 0) return regionalOnly;
  }

  return matched;
}

/** @deprecated use getVarietiesForLocation */
export function getVarietiesForRegion(regionId: string): CropVariety[] {
  return getVarietiesForLocation(regionId);
}

export function getRecommendedVarieties(
  regionId: string,
  sun: string,
  postalCode?: string
): CropVariety[] {
  return getVarietiesForLocation(regionId, postalCode).filter((v) =>
    v.sunPreference.includes(sun as SunExposure)
  );
}

export function isVarietyAvailableInLocation(
  varietyId: string,
  regionId: string,
  postalCode?: string
): boolean {
  return getVarietiesForLocation(regionId, postalCode).some(
    (v) => v.id === varietyId
  );
}
