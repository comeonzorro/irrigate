import type { LocationInfo, PlotConfig } from "@/lib/types";

export interface CityAccess {
  postalCode: string;
  regionId: string;
  cityHint: string;
  regionName: string;
  locatedAt: string;
}

export interface SavedProject {
  id: string;
  name: string;
  config: PlotConfig;
  location: LocationInfo | null;
  updatedAt: string;
  /** Projet stocké localement, pas encore synchronisé cloud */
  localOnly?: boolean;
}

export interface ProjectStore {
  projects: SavedProject[];
  activeProjectId: string | null;
}

export const CITY_ACCESS_KEY = "irrigate:city-access";
export const PROJECT_STORE_KEY = "irrigate:project-store";

export function createProjectId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `proj_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function defaultProjectName(index: number): string {
  return index <= 1 ? "Mon potager" : `Potager ${index}`;
}

export function configFromCityAccess(
  city: CityAccess,
  base?: Partial<PlotConfig>
): PlotConfig {
  return {
    widthM: 4,
    lengthM: 6,
    postalCode: city.postalCode,
    regionId: city.regionId,
    sunExposure: "S",
    soilType: "mixte",
    hasGreenhouse: false,
    selectedVarieties: [],
    irrigationModeId: "drip_buried",
    ...base,
  };
}

export function locationFromCityAccess(city: CityAccess): LocationInfo {
  return {
    postalCode: city.postalCode,
    department: city.postalCode.slice(0, 2),
    departmentName: "",
    cityHint: city.cityHint,
    regionId: city.regionId,
    regionName: city.regionName,
    climateZone: "",
    avgRainfallMm: 0,
    frostFreeDays: 0,
  };
}

export function createSavedProject(
  partial: Partial<SavedProject> & Pick<SavedProject, "config">
): SavedProject {
  return {
    id: partial.id ?? createProjectId(),
    name: partial.name ?? "Mon potager",
    config: partial.config,
    location: partial.location ?? null,
    updatedAt: partial.updatedAt ?? new Date().toISOString(),
    localOnly: partial.localOnly ?? true,
  };
}
