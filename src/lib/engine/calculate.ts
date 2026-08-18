import "server-only";
import type { CropVariety, IrrigationModeId, SunExposure, WaterPlan } from "../types";
import { getVariety, getCrop } from "../data/crops";
import {
  getIrrigationMode,
  WATERING_CAN_CAPACITY_L,
  MINUTES_PER_WATERING_CAN,
} from "../data/irrigation";
import { getSoilProfile } from "../data/soil";
import { getRegion } from "../data/regions";
import { sunMultiplier } from "./layout";
import type { SoilType } from "../types";

export function computeWaterPlan(
  plants: { varietyId: string }[],
  irrigationModeId: IrrigationModeId,
  sun: SunExposure,
  soilType: SoilType,
  regionId: string,
  areaM2: number,
  hasGreenhouse = false
): WaterPlan {
  const mode = getIrrigationMode(irrigationModeId)!;
  const soil = getSoilProfile(soilType);
  const region = getRegion(regionId);
  const sunMult = sunMultiplier(sun, hasGreenhouse);

  let baseLitersPerWeek = 0;
  for (const p of plants) {
    const variety = getVariety(p.varietyId);
    if (variety) baseLitersPerWeek += variety.waterLitersPerWeek;
  }

  const rainfallFactor = region ? Math.max(0.7, 1 - region.avgRainfallMm / 2000) : 1;
  const adjustedWeekly =
    (baseLitersPerWeek * sunMult * soil.waterRetention * rainfallFactor) /
    mode.efficiency;

  const litersPerWeek = Math.round(adjustedWeekly * 10) / 10;
  const litersPerDay = Math.round((litersPerWeek / 7) * 10) / 10;
  const litersPerMonth = Math.round(litersPerWeek * 4.33 * 10) / 10;

  let sessionsPerWeek = 3;
  let minutesPerSession = mode.laborMinutesPerWeek / sessionsPerWeek;
  let wateringCanTrips: number | undefined;

  if (irrigationModeId === "watering_can") {
    wateringCanTrips = Math.ceil(litersPerWeek / WATERING_CAN_CAPACITY_L);
    sessionsPerWeek = Math.min(7, Math.max(3, Math.ceil(wateringCanTrips / 3)));
    minutesPerSession =
      (wateringCanTrips * MINUTES_PER_WATERING_CAN) / sessionsPerWeek;
  } else if (irrigationModeId === "hose_jet") {
    sessionsPerWeek = 4;
    minutesPerSession = mode.laborMinutesPerWeek / sessionsPerWeek;
  } else if (irrigationModeId === "sprinkler_auto") {
    sessionsPerWeek = 7;
    minutesPerSession = 1;
  }

  const estimatedWaterCostMonthly =
    Math.round(litersPerMonth * mode.waterCostPerLiter * 100) / 100;

  void areaM2;
  return {
    litersPerDay,
    litersPerWeek,
    litersPerMonth,
    sessionsPerWeek,
    minutesPerSession: Math.round(minutesPerSession),
    wateringCanTrips,
    estimatedWaterCostMonthly,
  };
}

export function computeSetupCost(
  areaM2: number,
  irrigationModeId: IrrigationModeId
): number {
  const mode = getIrrigationMode(irrigationModeId);
  if (!mode) return 0;
  return Math.round(areaM2 * mode.setupCostPerM2 * 100) / 100;
}

export function computeMonthlyOperatingCost(
  water: WaterPlan,
  fertilizerCost: number,
  irrigationModeId: IrrigationModeId
): number {
  const mode = getIrrigationMode(irrigationModeId)!;
  const laborCost = (mode.laborMinutesPerWeek * 4.33 * 15) / 60;
  return Math.round((water.estimatedWaterCostMonthly + fertilizerCost / 6 + laborCost) * 100) / 100;
}

export function computeYield(
  plants: { varietyId: string }[],
  sun: SunExposure,
  hasGreenhouse = false
): {
  kgPerDay: number;
  kgPerWeek: number;
  kgPerMonth: number;
  revenuePerDay: number;
  revenuePerWeek: number;
  revenuePerMonth: number;
} {
  const sunMult = sunMultiplier(sun, hasGreenhouse);
  const ghBoost = hasGreenhouse ? 1.15 : 1;
  let totalKgSeason = 0;
  let totalRevenueSeason = 0;

  for (const p of plants) {
    const variety = getVariety(p.varietyId);
    if (!variety) continue;
    const crop = getCrop(variety.cropId);
    const kg = variety.yieldKgPerPlant * sunMult * ghBoost;
    totalKgSeason += kg;
    totalRevenueSeason += kg * (crop?.basePricePerKg ?? 3);
  }

  const harvestDays = 90;
  const kgPerDay = totalKgSeason / harvestDays;
  const kgPerWeek = kgPerDay * 7;
  const kgPerMonth = kgPerDay * 30;
  const revenuePerDay = totalRevenueSeason / harvestDays;
  const revenuePerWeek = revenuePerDay * 7;
  const revenuePerMonth = revenuePerDay * 30;

  return {
    kgPerDay: Math.round(kgPerDay * 100) / 100,
    kgPerWeek: Math.round(kgPerWeek * 100) / 100,
    kgPerMonth: Math.round(kgPerMonth * 100) / 100,
    revenuePerDay: Math.round(revenuePerDay * 100) / 100,
    revenuePerWeek: Math.round(revenuePerWeek * 100) / 100,
    revenuePerMonth: Math.round(revenuePerMonth * 100) / 100,
  };
}
