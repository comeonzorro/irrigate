export type SunExposure = "N" | "S" | "E" | "O";

export type SoilType = "argileux" | "limoneux" | "sableux" | "mixte";

export type RegionLevel = "commune" | "region" | "pays";

export interface Region {
  id: string;
  name: string;
  level: RegionLevel;
  parentId?: string;
  climateZone: string;
  avgRainfallMm: number;
  frostFreeDays: number;
}

export interface CropVariety {
  id: string;
  name: string;
  cropId: string;
  regionIds: string[];
  sunPreference: SunExposure[];
  spacingCm: { row: number; plant: number };
  waterLitersPerWeek: number;
  yieldKgPerPlant: number;
  daysToHarvest: number;
  season: "printemps" | "ete" | "automne" | "hiver" | "perenne";
  emoji: string;
  color: string;
}

export interface Crop {
  id: string;
  name: string;
  category: "legume" | "fruit" | "herbe" | "fleur";
  basePricePerKg: number;
}

export type IrrigationModeId =
  | "drip_buried"
  | "drip_surface"
  | "sprinkler_auto"
  | "hose_jet"
  | "watering_can"
  | "arduino_smart";

export interface IrrigationMode {
  id: IrrigationModeId;
  name: string;
  description: string;
  efficiency: number;
  setupCostPerM2: number;
  waterCostPerLiter: number;
  laborMinutesPerWeek: number;
  available: boolean;
  v2?: boolean;
}

export interface PlotConfig {
  widthM: number;
  lengthM: number;
  regionId: string;
  sunExposure: SunExposure;
  soilType: SoilType;
  selectedVarieties: string[];
  irrigationModeId: IrrigationModeId;
}

export interface PlacedPlant {
  varietyId: string;
  x: number;
  y: number;
}

export interface WaterPlan {
  litersPerDay: number;
  litersPerWeek: number;
  litersPerMonth: number;
  sessionsPerWeek: number;
  minutesPerSession: number;
  wateringCanTrips?: number;
  estimatedWaterCostMonthly: number;
}

export interface YieldEstimate {
  kgPerDay: number;
  kgPerWeek: number;
  kgPerMonth: number;
  revenuePerDay: number;
  revenuePerWeek: number;
  revenuePerMonth: number;
}

export interface FertilizerPlan {
  type: string;
  npk: string;
  amountKg: number;
  frequency: string;
  costEstimate: number;
  notes: string;
}

export interface PlanResult {
  plants: PlacedPlant[];
  gridCols: number;
  gridRows: number;
  tileSizeM: number;
  plantCount: number;
  water: WaterPlan;
  yield: YieldEstimate;
  fertilizer: FertilizerPlan;
  setupCost: number;
  monthlyOperatingCost: number;
  breakEvenMonths: number;
}
