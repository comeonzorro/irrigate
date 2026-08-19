import type { SavedProject } from "@/lib/projects/types";
import type { LocationInfo, PlotConfig } from "@/lib/types";

export interface DbProjectRow {
  id: string;
  user_id: string;
  name: string;
  config: PlotConfig;
  location: LocationInfo | null;
  created_at: string;
  updated_at: string;
}

export function rowToSavedProject(row: DbProjectRow): SavedProject {
  return {
    id: row.id,
    name: row.name,
    config: row.config,
    location: row.location,
    updatedAt: row.updated_at,
    localOnly: false,
  };
}

export function savedProjectToRow(
  project: SavedProject,
  userId: string
): Omit<DbProjectRow, "created_at" | "updated_at"> {
  return {
    id: project.id,
    user_id: userId,
    name: project.name,
    config: project.config,
    location: project.location,
  };
}

/** Fusionne projets locaux et cloud (le plus récent updatedAt gagne). */
export function mergeProjects(
  local: SavedProject[],
  remote: SavedProject[]
): SavedProject[] {
  const map = new Map<string, SavedProject>();
  for (const p of remote) map.set(p.id, p);
  for (const localProject of local) {
    const existing = map.get(localProject.id);
    if (!existing) {
      map.set(localProject.id, localProject);
      continue;
    }
    const localTime = Date.parse(localProject.updatedAt);
    const remoteTime = Date.parse(existing.updatedAt);
    map.set(
      localProject.id,
      localTime >= remoteTime ? { ...localProject, localOnly: false } : existing
    );
  }
  return [...map.values()].sort(
    (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
  );
}
