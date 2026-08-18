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
  postalCode: string;
  regionId: string;
  sunExposure: SunExposure;
  soilType: SoilType;
  selectedVarieties: string[];
  irrigationModeId: IrrigationModeId;
}

export interface RecommendedProduct {
  id: string;
  name: string;
  category: "irrigation" | "semence" | "engrais" | "outil";
  description: string;
  priceEstimate: number;
  reason: string;
  shopHint: string;
}

export interface PublicVariety {
  id: string;
  name: string;
  emoji: string;
  color: string;
  cropId: string;
  recommended?: boolean;
}

export interface VarietyDisplay {
  name: string;
  emoji: string;
  color: string;
}

export interface LocationInfo {
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

export interface PlanApiResponse {
  plan: PlanResult;
  varietyDisplay: Record<string, VarietyDisplay>;
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

export type PipeKind =
  | "main"
  | "lateral"
  | "dripper"
  | "sprinkler"
  | "valve"
  | "source"
  | "hose_path";

export interface PipeSegment {
  id: string;
  kind: PipeKind;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  buried?: boolean;
  dashed?: boolean;
}

export interface PipeNode {
  id: string;
  kind: PipeKind;
  x: number;
  y: number;
  label?: string;
  radius?: number;
}

export interface IrrigationLayout {
  segments: PipeSegment[];
  nodes: PipeNode[];
  totalPipeLengthM: number;
  dripperCount: number;
  buriedDepthCm?: number;
}

export interface LayoutZone {
  varietyId: string;
  colStart: number;
  colEnd: number;
  rowStart: number;
  rowEnd: number;
}

export interface VarietyLayoutInfo {
  varietyId: string;
  name: string;
  emoji: string;
  placed: number;
  maxPossible: number;
  minAreaM2: number;
  zoneAreaM2?: number;
}

export type LayoutStatus = "ok" | "tight" | "overflow";

export interface LayoutAdvice {
  status: LayoutStatus;
  message: string;
  varieties: VarietyLayoutInfo[];
  unplacedVarietyIds?: string[];
  suggestedWidthM?: number;
  suggestedLengthM?: number;
  suggestedAreaM2?: number;
}

export interface PlanResult {
  plants: PlacedPlant[];
  gridCols: number;
  gridRows: number;
  tileSizeM: number;
  plantCount: number;
  zones: LayoutZone[];
  layoutAdvice: LayoutAdvice;
  irrigation: IrrigationLayout;
  water: WaterPlan;
  yield: YieldEstimate;
  fertilizer: FertilizerPlan;
  setupCost: number;
  monthlyOperatingCost: number;
  breakEvenMonths: number;
}
