import type { CityAccess, ProjectStore, SavedProject } from "./types";
import {
  CITY_ACCESS_KEY,
  PROJECT_STORE_KEY,
  createProjectId,
  createSavedProject,
  defaultProjectName,
  configFromCityAccess,
  locationFromCityAccess,
} from "./types";
import type { LocationInfo, PlotConfig } from "@/lib/types";

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getCityAccess(): CityAccess | null {
  return readJson<CityAccess>(CITY_ACCESS_KEY);
}

export function setCityAccess(city: CityAccess): void {
  writeJson(CITY_ACCESS_KEY, city);
}

export function clearCityAccess(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CITY_ACCESS_KEY);
}

export function loadProjectStore(): ProjectStore {
  const stored = readJson<ProjectStore>(PROJECT_STORE_KEY);
  if (stored?.projects?.length) {
    return stored;
  }
  return { projects: [], activeProjectId: null };
}

export function saveProjectStore(store: ProjectStore): void {
  writeJson(PROJECT_STORE_KEY, store);
}

export function ensureDefaultProject(city: CityAccess): ProjectStore {
  const store = loadProjectStore();
  if (store.projects.length > 0) {
    return store;
  }
  const project = createSavedProject({
    id: createProjectId(),
    name: defaultProjectName(1),
    config: configFromCityAccess(city),
    location: locationFromCityAccess(city),
    localOnly: true,
  });
  const next: ProjectStore = {
    projects: [project],
    activeProjectId: project.id,
  };
  saveProjectStore(next);
  return next;
}

export function upsertProjectInStore(
  project: SavedProject,
  makeActive = true
): ProjectStore {
  const store = loadProjectStore();
  const idx = store.projects.findIndex((p) => p.id === project.id);
  const projects =
    idx >= 0
      ? store.projects.map((p, i) => (i === idx ? project : p))
      : [...store.projects, project];
  const next: ProjectStore = {
    projects,
    activeProjectId: makeActive ? project.id : store.activeProjectId,
  };
  saveProjectStore(next);
  return next;
}

export function setActiveProjectInStore(projectId: string): ProjectStore {
  const store = loadProjectStore();
  if (!store.projects.some((p) => p.id === projectId)) return store;
  const next = { ...store, activeProjectId: projectId };
  saveProjectStore(next);
  return next;
}

export function deleteProjectFromStore(projectId: string): ProjectStore {
  const store = loadProjectStore();
  const projects = store.projects.filter((p) => p.id !== projectId);
  let activeProjectId = store.activeProjectId;
  if (activeProjectId === projectId) {
    activeProjectId = projects[0]?.id ?? null;
  }
  const next = { projects, activeProjectId };
  saveProjectStore(next);
  return next;
}

export function getActiveProject(store: ProjectStore): SavedProject | null {
  if (!store.activeProjectId) return store.projects[0] ?? null;
  return store.projects.find((p) => p.id === store.activeProjectId) ?? null;
}

export function patchActiveProject(
  patch: { name?: string; config?: PlotConfig; location?: LocationInfo | null },
  store = loadProjectStore()
): ProjectStore {
  const active = getActiveProject(store);
  if (!active) return store;
  const updated: SavedProject = {
    ...active,
    ...patch,
    config: patch.config ?? active.config,
    updatedAt: new Date().toISOString(),
    localOnly: active.localOnly ?? true,
  };
  return upsertProjectInStore(updated, true);
}

export function replaceProjectStore(projects: SavedProject[], activeId: string | null) {
  saveProjectStore({ projects, activeProjectId: activeId });
}
