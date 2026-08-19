import type {
  LayoutAdvice,
  LocationInfo,
  PlanResult,
  PlotConfig,
  PublicVariety,
  RecommendedProduct,
  VarietyDisplay,
} from "../types";
import type { SavedProject } from "../lib/projectStorage";

export const EMPTY_PLAN: PlanResult = {
  plants: [],
  gridCols: 1,
  gridRows: 1,
  tileSizeM: 0.5,
  plantCount: 0,
  zones: [],
  layoutAdvice: {
    status: "ok",
    message: "Configurez votre parcelle.",
    varieties: [],
  },
  irrigation: {
    segments: [],
    nodes: [],
    totalPipeLengthM: 0,
    dripperCount: 0,
  },
  water: {
    litersPerDay: 0,
    litersPerWeek: 0,
    litersPerMonth: 0,
    sessionsPerWeek: 0,
    minutesPerSession: 0,
    estimatedWaterCostMonthly: 0,
  },
  yield: {
    kgPerDay: 0,
    kgPerWeek: 0,
    kgPerMonth: 0,
    revenuePerDay: 0,
    revenuePerWeek: 0,
    revenuePerMonth: 0,
  },
  fertilizer: {
    type: "",
    npk: "",
    amountKg: 0,
    frequency: "",
    costEstimate: 0,
    notes: "",
  },
  setupCost: 0,
  monthlyOperatingCost: 0,
  breakEvenMonths: Infinity,
};

export const DEFAULT_CONFIG: PlotConfig = {
  widthM: 4,
  lengthM: 6,
  postalCode: "",
  regionId: "france",
  sunExposure: "S",
  soilType: "mixte",
  hasGreenhouse: false,
  selectedVarieties: [],
  irrigationModeId: "drip_buried",
};

export interface PlannerState {
  hydrated: boolean;
  projects: SavedProject[];
  activeProjectId: string | null;
  config: PlotConfig;
  location: LocationInfo | null;
  plan: PlanResult;
  varietyDisplay: Record<string, VarietyDisplay>;
  varieties: PublicVariety[];
  recommendedVarieties: PublicVariety[];
  varietiesRegionLabel: string;
  products: RecommendedProduct[];
  planLoading: boolean;
  varietiesLoading: boolean;
  productsLoading: boolean;
  locating: boolean;
  postalError: string | null;
}

export interface PlannerActions {
  updateConfig: (patch: Partial<PlotConfig>) => void;
  locatePostal: () => Promise<void>;
  setSelectedVarieties: (ids: string[]) => void;
  selectProject: (projectId: string) => Promise<void>;
  createProject: () => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
}

export type PlannerContextValue = PlannerState & PlannerActions;
