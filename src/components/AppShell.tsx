"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GardenPlanner } from "@/components/GardenPlanner";
import { GuestModeBanner } from "@/components/GuestModeBanner";
import { ProjectBar } from "@/components/ProjectBar";
import { useAuthSession } from "@/lib/useAuthSession";
import {
  deleteCloudProject,
  syncProjectStoreWithCloud,
} from "@/lib/projects/cloud-sync";
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
} from "@/lib/projects/storage";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { LocationInfo, PlotConfig } from "@/lib/types";

const DEFAULT_CONFIG: PlotConfig = {
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

function storesEqual(a: ProjectStore, b: ProjectStore): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function AppShell() {
  const { user, loading: authLoading } = useAuthSession();
  const guestMode = !user;
  const [ready, setReady] = useState(false);
  const [store, setStore] = useState<ProjectStore>({
    projects: [],
    activeProjectId: null,
  });
  const [syncing, setSyncing] = useState(false);
  const syncInFlight = useRef(false);
  const hasSyncedOnce = useRef(false);

  useEffect(() => {
    if (authLoading) return;

    if (guestMode) {
      setReady(true);
      return;
    }

    const city = getCityAccess();
    let initial = loadProjectStore();

    if (!initial.projects.length) {
      initial = city
        ? ensureDefaultProject(city)
        : (() => {
            const project = createSavedProject({
              id: createProjectId(),
              name: defaultProjectName(1),
              config: DEFAULT_CONFIG,
              location: null,
              localOnly: true,
            });
            const next = { projects: [project], activeProjectId: project.id };
            saveProjectStore(next);
            return next;
          })();
    }

    setStore(initial);
    setReady(true);
  }, [authLoading, guestMode]);

  const syncCloud = useCallback(
    async (current: ProjectStore): Promise<ProjectStore | null> => {
      if (guestMode || !isSupabaseConfigured()) return null;

      const supabase = createClient();
      if (!supabase) return null;

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) return null;

      if (syncInFlight.current) return null;
      syncInFlight.current = true;
      setSyncing(true);

      try {
        return await syncProjectStoreWithCloud(current);
      } finally {
        syncInFlight.current = false;
        setSyncing(false);
      }
    },
    [guestMode]
  );

  useEffect(() => {
    if (!ready || guestMode) return;

    const delay = hasSyncedOnce.current ? 1200 : 0;
    const timer = setTimeout(() => {
      void syncCloud(store).then((next) => {
        hasSyncedOnce.current = true;
        if (next && !storesEqual(next, store)) {
          setStore(next);
        }
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [store, ready, guestMode, syncCloud]);

  const activeProject = guestMode ? null : getActiveProject(store);

  const persistProject = useCallback(
    (config: PlotConfig, location: LocationInfo | null) => {
      if (guestMode || !activeProject) return;
      const updated: SavedProject = {
        ...activeProject,
        config,
        location,
        updatedAt: new Date().toISOString(),
        localOnly: true,
      };
      const projects = store.projects.map((p) =>
        p.id === updated.id ? updated : p
      );
      const next = { projects, activeProjectId: store.activeProjectId };
      saveProjectStore(next);
      setStore(next);
    },
    [activeProject, guestMode, store]
  );

  const handleSelect = useCallback((id: string) => {
    const next = loadProjectStore();
    next.activeProjectId = id;
    saveProjectStore(next);
    setStore({ ...next });
  }, []);

  const handleCreate = useCallback(() => {
    if (guestMode) return;
    const city = getCityAccess();
    const current = loadProjectStore();
    const project = createSavedProject({
      id: createProjectId(),
      name: defaultProjectName(current.projects.length + 1),
      config: city ? configFromCityAccess(city) : DEFAULT_CONFIG,
      location: city ? locationFromCityAccess(city) : null,
      localOnly: true,
    });
    const next = {
      projects: [...current.projects, project],
      activeProjectId: project.id,
    };
    saveProjectStore(next);
    setStore(next);
  }, [guestMode]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (guestMode) return;
      const current = loadProjectStore();
      const projects = current.projects.filter((p) => p.id !== id);
      let activeProjectId = current.activeProjectId;
      if (activeProjectId === id) activeProjectId = projects[0]?.id ?? null;
      const next = { projects, activeProjectId };
      saveProjectStore(next);
      setStore(next);

      await deleteCloudProject(id);
    },
    [guestMode]
  );

  const handleRename = useCallback(
    (id: string, name: string) => {
      if (guestMode) return;
      const current = loadProjectStore();
      const projects = current.projects.map((p) =>
        p.id === id
          ? { ...p, name, updatedAt: new Date().toISOString(), localOnly: true }
          : p
      );
      const next = { ...current, projects };
      saveProjectStore(next);
      setStore(next);
    },
    [guestMode]
  );

  if (authLoading || (!guestMode && !ready)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-emerald-700">
        Chargement…
      </div>
    );
  }

  if (guestMode) {
    return (
      <>
        <GuestModeBanner />
        <GardenPlanner guestMode embedded />
      </>
    );
  }

  if (!activeProject) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-emerald-700">
        Chargement du projet…
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
        embedded
      />
    </>
  );
}
