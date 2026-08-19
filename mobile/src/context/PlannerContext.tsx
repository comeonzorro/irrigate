import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

const PlannerContext = createContext<PlannerContextValue | null>(null);

export function PlannerProvider({ children }: { children: ReactNode }) {
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

  useEffect(() => {
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
    config.regionId,
    config.sunExposure,
    config.postalCode,
    config.hasGreenhouse,
  ]);

  useEffect(() => {
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
  }, [config]);

  useEffect(() => {
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
  }, [config]);

  const value = useMemo<PlannerContextValue>(
    () => ({
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
    }),
    [
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
    ]
  );

  return (
    <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>
  );
}

export function usePlanner(): PlannerContextValue {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error("usePlanner must be used within PlannerProvider");
  return ctx;
}
