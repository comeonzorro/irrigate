import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  fetchPlan,
  fetchProducts,
  fetchVarieties,
  locatePostalCode,
} from "../api/client";
import type { PlotConfig } from "../types";
import {
  DEFAULT_CONFIG,
  EMPTY_PLAN,
  type PlannerContextValue,
} from "./plannerDefaults";
import {
  createProjectId,
  createSavedProject,
  defaultProjectName,
  getActiveProject,
  loadProjectStore,
  saveProjectStore,
  type ProjectStore,
  type SavedProject,
} from "../lib/projectStorage";

const PlannerContext = createContext<PlannerContextValue | null>(null);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [projectStore, setProjectStore] = useState<ProjectStore>({
    projects: [],
    activeProjectId: null,
  });
  const [config, setConfig] = useState<PlotConfig>(DEFAULT_CONFIG);
  const [location, setLocation] = useState<PlannerContextValue["location"]>(
    null
  );
  const [plan, setPlan] = useState(EMPTY_PLAN);
  const [varietyDisplay, setVarietyDisplay] = useState<
    PlannerContextValue["varietyDisplay"]
  >({});
  const [varieties, setVarieties] = useState<
    PlannerContextValue["varieties"]
  >([]);
  const [recommendedVarieties, setRecommendedVarieties] = useState<
    PlannerContextValue["recommendedVarieties"]
  >([]);
  const [varietiesRegionLabel, setVarietiesRegionLabel] = useState("");
  const [products, setProducts] = useState<
    PlannerContextValue["products"]
  >([]);
  const [planLoading, setPlanLoading] = useState(false);
  const [varietiesLoading, setVarietiesLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [postalError, setPostalError] = useState<string | null>(null);
  const skipSaveRef = useRef(false);

  const applyProject = useCallback((project: SavedProject) => {
    skipSaveRef.current = true;
    setConfig(project.config);
    setLocation(project.location);
  }, []);

  useEffect(() => {
    void (async () => {
      let store = await loadProjectStore();
      if (store.projects.length === 0) {
        const project = createSavedProject({
          id: createProjectId(),
          name: defaultProjectName(1),
          config: DEFAULT_CONFIG,
          location: null,
          localOnly: true,
        });
        store = { projects: [project], activeProjectId: project.id };
        await saveProjectStore(store);
      }
      setProjectStore(store);
      const active = getActiveProject(store);
      if (active) applyProject(active);
      setHydrated(true);
    })();
  }, [applyProject]);

  const persistActiveProject = useCallback(
    async (nextConfig = config, nextLocation = location) => {
      if (!hydrated || skipSaveRef.current) {
        skipSaveRef.current = false;
        return;
      }
      const store = await loadProjectStore();
      const active = getActiveProject(store);
      if (!active) return;
      const updated: SavedProject = {
        ...active,
        config: nextConfig,
        location: nextLocation,
        updatedAt: new Date().toISOString(),
      };
      const projects = store.projects.map((p) =>
        p.id === updated.id ? updated : p
      );
      const nextStore = { ...store, projects };
      await saveProjectStore(nextStore);
      setProjectStore(nextStore);
    },
    [config, location, hydrated]
  );

  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(() => {
      void persistActiveProject();
    }, 500);
    return () => clearTimeout(timer);
  }, [config, location, hydrated, persistActiveProject]);

  const updateConfig = useCallback((patch: Partial<PlotConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  const setSelectedVarieties = useCallback((ids: string[]) => {
    setConfig((prev) => ({ ...prev, selectedVarieties: ids }));
  }, []);

  const locatePostal = useCallback(async () => {
    const cp = config.postalCode.trim();
    if (cp.length === 0) {
      setLocation(null);
      updateConfig({ regionId: "france" });
      setPostalError(null);
      return;
    }
    if (cp.replace(/\D/g, "").length !== 5) {
      setPostalError("Le code postal doit contenir 5 chiffres.");
      return;
    }
    setLocating(true);
    setPostalError(null);
    const result = await locatePostalCode(cp);
    setLocating(false);
    if (!result) {
      setPostalError("Code postal non reconnu.");
      setLocation(null);
      return;
    }
    setLocation(result);
    updateConfig({ regionId: result.regionId, postalCode: result.postalCode });
  }, [config.postalCode, updateConfig]);

  const selectProject = useCallback(
    async (projectId: string) => {
      const store = await loadProjectStore();
      const project = store.projects.find((p) => p.id === projectId);
      if (!project) return;
      const next = { ...store, activeProjectId: projectId };
      await saveProjectStore(next);
      setProjectStore(next);
      applyProject(project);
    },
    [applyProject]
  );

  const createProject = useCallback(async () => {
    const store = await loadProjectStore();
    const base = getActiveProject(store)?.config ?? config;
    const project = createSavedProject({
      id: createProjectId(),
      name: defaultProjectName(store.projects.length + 1),
      config: {
        ...base,
        selectedVarieties: [],
      },
      location,
      localOnly: true,
    });
    const next = {
      projects: [...store.projects, project],
      activeProjectId: project.id,
    };
    await saveProjectStore(next);
    setProjectStore(next);
    applyProject(project);
  }, [applyProject, config, location]);

  const deleteProject = useCallback(
    async (projectId: string) => {
      const store = await loadProjectStore();
      const projects = store.projects.filter((p) => p.id !== projectId);
      let activeProjectId = store.activeProjectId;
      if (activeProjectId === projectId) {
        activeProjectId = projects[0]?.id ?? null;
      }
      const next = { projects, activeProjectId };
      await saveProjectStore(next);
      setProjectStore(next);
      const active = getActiveProject(next);
      if (active) applyProject(active);
    },
    [applyProject]
  );

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    setVarietiesLoading(true);
    fetchVarieties(
      config.regionId,
      config.sunExposure,
      config.postalCode,
      config.hasGreenhouse
    ).then((data) => {
      if (cancelled) return;
      setVarieties(data.all);
      setRecommendedVarieties(data.recommended);
      setVarietiesRegionLabel(data.regionLabel ?? config.regionId);
      setVarietiesLoading(false);
      const validIds = new Set(data.all.map((v) => v.id));
      setConfig((prev) => {
        const filtered = prev.selectedVarieties.filter((id) => validIds.has(id));
        if (filtered.length === prev.selectedVarieties.length) return prev;
        return { ...prev, selectedVarieties: filtered };
      });
    });
    return () => {
      cancelled = true;
    };
  }, [
    hydrated,
    config.regionId,
    config.sunExposure,
    config.postalCode,
    config.hasGreenhouse,
  ]);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setPlanLoading(true);
      const result = await fetchPlan(config);
      if (cancelled) return;
      if (result) {
        setPlan(result.plan);
        setVarietyDisplay(result.varietyDisplay);
      }
      setPlanLoading(false);
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [hydrated, config]);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setProductsLoading(true);
      const data = await fetchProducts(config);
      if (cancelled) return;
      setProducts(data);
      setProductsLoading(false);
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [hydrated, config]);

  const value = useMemo<PlannerContextValue>(
    () => ({
      hydrated,
      projects: projectStore.projects,
      activeProjectId: projectStore.activeProjectId,
      config,
      location,
      plan,
      varietyDisplay,
      varieties,
      recommendedVarieties,
      varietiesRegionLabel,
      products,
      planLoading,
      varietiesLoading,
      productsLoading,
      locating,
      postalError,
      updateConfig,
      locatePostal,
      setSelectedVarieties,
      selectProject,
      createProject,
      deleteProject,
    }),
    [
      hydrated,
      projectStore,
      config,
      location,
      plan,
      varietyDisplay,
      varieties,
      recommendedVarieties,
      varietiesRegionLabel,
      products,
      planLoading,
      varietiesLoading,
      productsLoading,
      locating,
      postalError,
      updateConfig,
      locatePostal,
      setSelectedVarieties,
      selectProject,
      createProject,
      deleteProject,
    ]
  );

  if (!hydrated) {
    return null;
  }

  return (
    <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>
  );
}

export function usePlanner(): PlannerContextValue {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error("usePlanner must be used within PlannerProvider");
  return ctx;
}
