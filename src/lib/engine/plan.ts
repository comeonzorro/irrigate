import "server-only";
import type { PlotConfig, PlanResult } from "../types";
import { layoutPlants } from "./layout";
import { layoutIrrigationPipes } from "./pipes";
import {
  computeWaterPlan,
  computeSetupCost,
  computeMonthlyOperatingCost,
  computeYield,
} from "./calculate";
import { computeFertilizerPlan } from "../data/soil";

export function generatePlan(config: PlotConfig): PlanResult {
  const areaM2 = config.widthM * config.lengthM;
  const { plants, gridCols, gridRows, tileSizeM, zones, advice } = layoutPlants(
    config.widthM,
    config.lengthM,
    config.selectedVarieties,
    config.sunExposure,
    config.hasGreenhouse
  );

  const irrigation = layoutIrrigationPipes(
    plants,
    gridCols,
    gridRows,
    tileSizeM,
    config.irrigationModeId
  );

  const water = computeWaterPlan(
    plants,
    config.irrigationModeId,
    config.sunExposure,
    config.soilType,
    config.regionId,
    areaM2,
    config.hasGreenhouse
  );

  const yieldEst = computeYield(
    plants,
    config.sunExposure,
    config.hasGreenhouse
  );
  const fertilizer = computeFertilizerPlan(
    config.soilType,
    areaM2,
    plants.length
  );
  const setupCost =
    computeSetupCost(areaM2, config.irrigationModeId) +
    (config.hasGreenhouse ? Math.round(areaM2 * 12 * 100) / 100 : 0);
  const monthlyOperatingCost = computeMonthlyOperatingCost(
    water,
    fertilizer.costEstimate,
    config.irrigationModeId
  );

  const netMonthly = yieldEst.revenuePerMonth - monthlyOperatingCost;
  const breakEvenMonths =
    netMonthly > 0 ? Math.ceil(setupCost / netMonthly) : Infinity;

  return {
    plants,
    gridCols,
    gridRows,
    tileSizeM,
    plantCount: plants.length,
    zones,
    layoutAdvice: advice,
    irrigation,
    water,
    yield: yieldEst,
    fertilizer,
    setupCost,
    monthlyOperatingCost,
    breakEvenMonths,
  };
}
