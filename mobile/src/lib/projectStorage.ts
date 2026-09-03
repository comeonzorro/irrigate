import AsyncStorage from "@react-native-async-storage/async-storage";
import type { LocationInfo, PlotConfig } from "../types";

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
  localOnly?: boolean;
}

export interface ProjectStore {
  projects: SavedProject[];
  activeProjectId: string | null;
}

export const PROJECT_STORE_KEY = "irrigate:project-store";

export function createProjectId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export function defaultProjectName(index: number): string {
  return index <= 1 ? "Mon potager" : `Potager ${index}`;
}

export async function loadProjectStore(): Promise<ProjectStore> {
  try {
    const raw = await AsyncStorage.getItem(PROJECT_STORE_KEY);
    if (!raw) return { projects: [], activeProjectId: null };
    const parsed = JSON.parse(raw) as ProjectStore;
    if (parsed.projects?.length) return parsed;
  } catch {
    // ignore
  }
  return { projects: [], activeProjectId: null };
}

export async function saveProjectStore(store: ProjectStore): Promise<void> {
  await AsyncStorage.setItem(PROJECT_STORE_KEY, JSON.stringify(store));
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

export function getActiveProject(store: ProjectStore): SavedProject | null {
  if (!store.activeProjectId) return store.projects[0] ?? null;
  return store.projects.find((p) => p.id === store.activeProjectId) ?? null;
}
