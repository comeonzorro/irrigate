import { mergeProjects } from "@/lib/projects/sync";
import { replaceProjectStore } from "@/lib/projects/storage";
import {
  createProjectId,
  type ProjectStore,
  type SavedProject,
} from "@/lib/projects/types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type CloudSyncResult =
  | { ok: true; store: ProjectStore }
  | { ok: false; error: string; status?: number };

function isValidUuid(id: string): boolean {
  return UUID_RE.test(id);
}

/** Remplace les ids locaux non-UUID avant upsert Supabase. */
export function normalizeProjectsForCloud(store: ProjectStore): ProjectStore {
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

async function readApiError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    return body.error ?? `Erreur serveur (${res.status})`;
  } catch {
    return `Erreur serveur (${res.status})`;
  }
}

/** Fusionne le store local avec Supabase via /api/projects. */
export async function syncProjectStoreWithCloud(
  current: ProjectStore
): Promise<CloudSyncResult> {
  const normalized = normalizeProjectsForCloud(current);

  const getRes = await fetch("/api/projects", {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!getRes.ok) {
    return {
      ok: false,
      status: getRes.status,
      error: await readApiError(getRes),
    };
  }

  const getData = (await getRes.json()) as { projects?: SavedProject[] };
  const merged = mergeProjects(normalized.projects, getData.projects ?? []);
  const activeProjectId = resolveActiveProjectId(normalized, merged);

  const postRes = await fetch("/api/projects", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projects: merged }),
  });

  if (!postRes.ok) {
    return {
      ok: false,
      status: postRes.status,
      error: await readApiError(postRes),
    };
  }

  const next: ProjectStore = {
    projects: merged.map((p) => ({ ...p, localOnly: false })),
    activeProjectId,
  };
  replaceProjectStore(next.projects, next.activeProjectId);
  return { ok: true, store: next };
}

/** Supprime un projet côté cloud (best-effort). */
export async function deleteCloudProject(id: string): Promise<boolean> {
  if (!isValidUuid(id)) return false;
  const res = await fetch(`/api/projects/${id}`, {
    method: "DELETE",
    credentials: "same-origin",
  });
  return res.ok;
}
