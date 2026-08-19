"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GardenPlanner } from "@/components/GardenPlanner";
import { ProjectBar } from "@/components/ProjectBar";
import {
  createProjectId,
  defaultProjectName,
  configFromCityAccess,
  locationFromCityAccess,
  createSavedProject,
  type SavedProject,
  type ProjectStore,
} from "@/lib/projects/types";
import {
  getCityAccess,
  loadProjectStore,
  ensureDefaultProject,
  saveProjectStore,
  getActiveProject,
  replaceProjectStore,
} from "@/lib/projects/storage";
import { mergeProjects } from "@/lib/projects/sync";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { LocationInfo, PlotConfig } from "@/lib/types";

export function AppShell() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [store, setStore] = useState<ProjectStore>({
    projects: [],
    activeProjectId: null,
  });
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const city = getCityAccess();
    if (!city) {
      router.replace("/");
      return;
    }
    const initial = ensureDefaultProject(city);
    setStore(initial);
    setReady(true);
  }, [router]);

  const syncCloud = useCallback(async (current: ProjectStore) => {
    if (!isSupabaseConfigured()) return current;
    const supabase = createClient();
    if (!supabase) return current;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return current;

    setSyncing(true);
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) return current;
      const data = (await res.json()) as { projects?: SavedProject[] };
      const merged = mergeProjects(current.projects, data.projects ?? []);
      const activeId =
        current.activeProjectId &&
        merged.some((p) => p.id === current.activeProjectId)
          ? current.activeProjectId
          : merged[0]?.id ?? null;

      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects: merged }),
      });

      const next = { projects: merged.map((p) => ({ ...p, localOnly: false })), activeProjectId: activeId };
      replaceProjectStore(next.projects, next.activeProjectId);
      return next;
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    void syncCloud(store).then((next) => {
      if (next !== store) setStore(next);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const activeProject = getActiveProject(store);

  const persistProject = useCallback(
    (config: PlotConfig, location: LocationInfo | null) => {
      if (!activeProject) return;
      const updated: SavedProject = {
        ...activeProject,
        config,
        location,
        updatedAt: new Date().toISOString(),
      };
      const projects = store.projects.map((p) =>
        p.id === updated.id ? updated : p
      );
      const next = { projects, activeProjectId: store.activeProjectId };
      saveProjectStore(next);
      setStore(next);
    },
    [activeProject, store]
  );

  const handleSelect = useCallback((id: string) => {
    const next = loadProjectStore();
    next.activeProjectId = id;
    saveProjectStore(next);
    setStore({ ...next });
  }, []);

  const handleCreate = useCallback(() => {
    const city = getCityAccess();
    if (!city) return;
    const current = loadProjectStore();
    const project = createSavedProject({
      id: createProjectId(),
      name: defaultProjectName(current.projects.length + 1),
      config: configFromCityAccess(city),
      location: locationFromCityAccess(city),
      localOnly: true,
    });
    const next = {
      projects: [...current.projects, project],
      activeProjectId: project.id,
    };
    saveProjectStore(next);
    setStore(next);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      const current = loadProjectStore();
      const projects = current.projects.filter((p) => p.id !== id);
      let activeProjectId = current.activeProjectId;
      if (activeProjectId === id) activeProjectId = projects[0]?.id ?? null;
      const next = { projects, activeProjectId };
      saveProjectStore(next);
      setStore(next);

      if (isSupabaseConfigured()) {
        await fetch(`/api/projects/${id}`, { method: "DELETE" });
      }
    },
    []
  );

  const handleRename = useCallback((id: string, name: string) => {
    const current = loadProjectStore();
    const projects = current.projects.map((p) =>
      p.id === id ? { ...p, name, updatedAt: new Date().toISOString() } : p
    );
    const next = { ...current, projects };
    saveProjectStore(next);
    setStore(next);
  }, []);

  if (!ready || !activeProject) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-emerald-700">
        Chargement…
      </div>
    );
  }

  return (
    <>
      <ProjectBar
        projects={store.projects}
        activeProjectId={store.activeProjectId}
        onSelect={handleSelect}
        onCreate={handleCreate}
        onDelete={handleDelete}
        onRename={handleRename}
        syncing={syncing}
      />
      <GardenPlanner
        key={activeProject.id}
        initialConfig={activeProject.config}
        initialLocation={activeProject.location}
        onPersist={persistProject}
      />
    </>
  );
}
