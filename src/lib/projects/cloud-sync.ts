import { mergeProjects } from "@/lib/projects/sync";
import { replaceProjectStore } from "@/lib/projects/storage";
import type { ProjectStore, SavedProject } from "@/lib/projects/types";

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

/** Fusionne le store local avec Supabase via /api/projects. */
export async function syncProjectStoreWithCloud(
  current: ProjectStore
): Promise<ProjectStore | null> {
  const getRes = await fetch("/api/projects");
  if (!getRes.ok) return null;

  const getData = (await getRes.json()) as { projects?: SavedProject[] };
  const merged = mergeProjects(current.projects, getData.projects ?? []);
  const activeProjectId = resolveActiveProjectId(current, merged);

  const postRes = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projects: merged }),
  });

  if (!postRes.ok) return null;

  const next: ProjectStore = {
    projects: merged.map((p) => ({ ...p, localOnly: false })),
    activeProjectId,
  };
  replaceProjectStore(next.projects, next.activeProjectId);
  return next;
}

/** Supprime un projet côté cloud (best-effort). */
export async function deleteCloudProject(id: string): Promise<boolean> {
  const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
  return res.ok;
}
