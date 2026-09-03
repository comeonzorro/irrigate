import { createClient, isSupabaseConfigured } from "./supabase";
import {
  createProjectId,
  type ProjectStore,
  type SavedProject,
} from "./projectStorage";
import type { LocationInfo, PlotConfig } from "../types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface DbProjectRow {
  id: string;
  user_id: string;
  name: string;
  config: PlotConfig;
  location: LocationInfo | null;
  created_at: string;
  updated_at: string;
}

function isValidUuid(id: string): boolean {
  return UUID_RE.test(id);
}

function rowToSavedProject(row: DbProjectRow): SavedProject {
  return {
    id: row.id,
    name: row.name,
    config: row.config,
    location: row.location,
    updatedAt: row.updated_at,
    localOnly: false,
  };
}

function savedProjectToRow(project: SavedProject, userId: string) {
  return {
    id: project.id,
    user_id: userId,
    name: project.name,
    config: project.config,
    location: project.location,
    updated_at: project.updatedAt,
  };
}

function mergeProjects(
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

function normalizeProjectsForCloud(store: ProjectStore): ProjectStore {
  const idMap = new Map<string, string>();
  const projects = store.projects.map((project) => {
    if (isValidUuid(project.id)) return project;
    const newId = createProjectId();
    idMap.set(project.id, newId);
    return {
      ...project,
      id: newId,
      updatedAt: new Date().toISOString(),
    };
  });

  let activeProjectId = store.activeProjectId;
  if (activeProjectId && idMap.has(activeProjectId)) {
    activeProjectId = idMap.get(activeProjectId) ?? activeProjectId;
  }

  return { projects, activeProjectId };
}

function reassignForeignProjectIds(
  projects: SavedProject[],
  foreignIds: Set<string>
): { projects: SavedProject[]; idRemap: Record<string, string> } {
  const idRemap: Record<string, string> = {};
  const next = projects.map((project) => {
    if (!foreignIds.has(project.id)) return project;
    const newId = createProjectId();
    idRemap[project.id] = newId;
    return {
      ...project,
      id: newId,
      updatedAt: new Date().toISOString(),
    };
  });
  return { projects: next, idRemap };
}

function resolveActiveProjectId(
  current: ProjectStore,
  merged: SavedProject[]
): string | null {
  if (
    current.activeProjectId &&
    merged.some((p) => p.id === current.activeProjectId)
  ) {
    return current.activeProjectId;
  }
  return merged[0]?.id ?? null;
}

/** Fusionne le store local avec Supabase (table projects). */
export async function syncProjectStoreWithCloud(
  current: ProjectStore
): Promise<ProjectStore | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const normalized = normalizeProjectsForCloud(current);

  const { data: remoteRows, error: fetchError } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  if (fetchError) return null;

  const remote = (remoteRows ?? []).map((row) =>
    rowToSavedProject(row as DbProjectRow)
  );
  const merged = mergeProjects(normalized.projects, remote);
  const activeProjectId = resolveActiveProjectId(normalized, merged);

  if (merged.length > 0) {
    const ids = merged.map((project) => project.id);
    const { data: existingRows, error: lookupError } = await supabase
      .from("projects")
      .select("id, user_id")
      .in("id", ids);

    if (lookupError) return null;

    const foreignIds = new Set(
      (existingRows ?? [])
        .filter((row) => row.user_id !== user.id)
        .map((row) => row.id)
    );

    const { projects: safeProjects, idRemap } = reassignForeignProjectIds(
      merged,
      foreignIds
    );

    const rows = safeProjects.map((project) => savedProjectToRow(project, user.id));
    const { error: upsertError } = await supabase
      .from("projects")
      .upsert(rows, { onConflict: "id" });

    if (upsertError) return null;

    const remappedActive = normalized.activeProjectId
      ? (idRemap[normalized.activeProjectId] ?? normalized.activeProjectId)
      : null;

    return {
      projects: safeProjects.map((p) => ({ ...p, localOnly: false })),
      activeProjectId:
        remappedActive &&
        safeProjects.some((project) => project.id === remappedActive)
          ? remappedActive
          : (safeProjects[0]?.id ?? null),
    };
  }

  return {
    projects: merged.map((p) => ({ ...p, localOnly: false })),
    activeProjectId,
  };
}

/** Supprime un projet côté cloud. */
export async function deleteCloudProject(id: string): Promise<boolean> {
  if (!isValidUuid(id) || !isSupabaseConfigured()) return false;

  const supabase = createClient();
  if (!supabase) return false;

  const { error } = await supabase.from("projects").delete().eq("id", id);
  return !error;
}
