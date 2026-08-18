import "server-only";
import type { Crop, CropVariety } from "../types";

export const CROPS: Crop[] = [
  { id: "tomate", name: "Tomate", category: "legume", basePricePerKg: 4.5 },
  { id: "courgette", name: "Courgette", category: "legume", basePricePerKg: 2.8 },
  { id: "salade", name: "Salade", category: "legume", basePricePerKg: 3.2 },
  { id: "carotte", name: "Carotte", category: "legume", basePricePerKg: 2.0 },
  { id: "haricot", name: "Haricot vert", category: "legume", basePricePerKg: 5.0 },
  { id: "poivron", name: "Poivron", category: "legume", basePricePerKg: 6.0 },
  { id: "basilic", name: "Basilic", category: "herbe", basePricePerKg: 25.0 },
  { id: "fraisier", name: "Fraisier", category: "fruit", basePricePerKg: 8.0 },
];

export const VARIETIES: CropVariety[] = [
  {
    id: "tomate-cerise-idf",
    name: "Tomate cerise « Sweet Million »",
    cropId: "tomate",
    regionIds: ["limeil-brevannes", "ile-de-france", "france"],
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
    regionIds: ["ile-de-france", "france"],
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
    regionIds: ["limeil-brevannes", "ile-de-france", "france"],
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
    regionIds: ["limeil-brevannes", "ile-de-france", "france"],
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
    id: "carotte-idf",
    name: "Carotte « Nantaise »",
    cropId: "carotte",
    regionIds: ["ile-de-france", "france"],
    sunPreference: ["S", "E", "O"],
    spacingCm: { row: 30, plant: 5 },
    waterLitersPerWeek: 2,
    yieldKgPerPlant: 0.5,
    daysToHarvest: 70,
    season: "printemps",
    emoji: "🥕",
    color: "#e67e22",
  },
  {
    id: "haricot-idf",
    name: "Haricot vert « Contender »",
    cropId: "haricot",
    regionIds: ["limeil-brevannes", "ile-de-france", "france"],
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
    regionIds: ["limeil-brevannes", "ile-de-france", "france"],
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
    regionIds: ["ile-de-france", "france"],
    sunPreference: ["S", "E", "O"],
    spacingCm: { row: 35, plant: 30 },
    waterLitersPerWeek: 5,
    yieldKgPerPlant: 0.8,
    daysToHarvest: 60,
    season: "perenne",
    emoji: "🍓",
    color: "#e84393",
  },
];

export function getCrop(id: string): Crop | undefined {
  return CROPS.find((c) => c.id === id);
}

export function getVariety(id: string): CropVariety | undefined {
  return VARIETIES.find((v) => v.id === id);
}

import { getRegion } from "./regions";

export function getVarietiesForRegion(regionId: string): CropVariety[] {
  const hierarchy = [regionId];
  let region = getRegion(regionId);
  while (region?.parentId) {
    hierarchy.push(region.parentId);
    region = getRegion(region.parentId);
  }

  return VARIETIES.filter((v) =>
    v.regionIds.some((rid) => hierarchy.includes(rid))
  );
}

export function getRecommendedVarieties(
  regionId: string,
  sun: string
): CropVariety[] {
  return getVarietiesForRegion(regionId).filter((v) =>
    v.sunPreference.includes(sun as CropVariety["sunPreference"][number])
  );
}
