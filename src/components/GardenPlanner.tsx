"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";
import type {
  LocationInfo,
  PlanResult,
  PlotConfig,
  PublicVariety,
  RecommendedProduct,
  VarietyDisplay,
} from "@/lib/types";
import { fetchPlan, fetchProducts, fetchVarieties } from "@/lib/api/client";
import { Header } from "@/components/Header";
import { SettingsPanel } from "@/components/SettingsPanel";
import { PlotSetup } from "@/components/PlotSetup";
import { CropSelector } from "@/components/CropSelector";
import { IrrigationPanel } from "@/components/IrrigationPanel";
import { LayoutAdviceBanner } from "@/components/LayoutAdviceBanner";
import { PlotGrid } from "@/components/PlotGrid";
import { ResultsPanel } from "@/components/ResultsPanel";
import { IrrigationSolutionsGuide } from "@/components/IrrigationSolutionsGuide";
import { ProductRecommendations } from "@/components/ProductRecommendations";
import { Footer } from "@/components/Footer";

const PlotView3D = dynamic(
  () => import("@/components/PlotView3D").then((m) => m.PlotView3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700">
        Chargement de la vue 3D…
      </div>
    ),
  }
);

const EMPTY_PLAN: PlanResult = {
  plants: [],
  gridCols: 1,
  gridRows: 1,
  tileSizeM: 0.5,
  plantCount: 0,
  zones: [],
  layoutAdvice: {
    status: "ok",
    message: "Configurez votre parcelle.",
    varieties: [],
  },
  irrigation: {
    segments: [],
    nodes: [],
    totalPipeLengthM: 0,
    dripperCount: 0,
  },
  water: {
    litersPerDay: 0,
    litersPerWeek: 0,
    litersPerMonth: 0,
    sessionsPerWeek: 0,
    minutesPerSession: 0,
    estimatedWaterCostMonthly: 0,
  },
  yield: {
    kgPerDay: 0,
    kgPerWeek: 0,
    kgPerMonth: 0,
    revenuePerDay: 0,
    revenuePerWeek: 0,
    revenuePerMonth: 0,
  },
  fertilizer: {
    type: "",
    npk: "",
    amountKg: 0,
    frequency: "",
    costEstimate: 0,
    notes: "",
  },
  setupCost: 0,
  monthlyOperatingCost: 0,
  breakEvenMonths: Infinity,
};

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

type ViewMode = "2d" | "3d" | "both";

export function GardenPlanner() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [config, setConfig] = useState<PlotConfig>(DEFAULT_CONFIG);
  const [viewMode, setViewMode] = useState<ViewMode>("both");
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [plan, setPlan] = useState<PlanResult>(EMPTY_PLAN);
  const [varietyDisplay, setVarietyDisplay] = useState<
    Record<string, VarietyDisplay>
  >({});
  const [varieties, setVarieties] = useState<PublicVariety[]>([]);
  const [recommendedVarieties, setRecommendedVarieties] = useState<
    PublicVariety[]
  >([]);
  const [varietiesRegionLabel, setVarietiesRegionLabel] = useState<string>("");
  const [products, setProducts] = useState<RecommendedProduct[]>([]);
  const [planLoading, setPlanLoading] = useState(false);
  const [varietiesLoading, setVarietiesLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);

  const updateConfig = useCallback((patch: Partial<PlotConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    if (isMobile && viewMode === "both") {
      setViewMode("2d");
    }
  }, [isMobile, viewMode]);

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
  }, [config.regionId, config.sunExposure, config.postalCode, config.hasGreenhouse]);

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

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-emerald-700 focus:px-4 focus:py-2 focus:text-white"
      >
        Aller au contenu principal
      </a>
      <Header />
      <main id="main-content" className="mx-auto max-w-6xl flex-1 px-4 py-8">
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-600 p-6 text-white shadow-lg">
          <h2 className="text-xl font-semibold">
            Votre potager, votre arrosage, votre récolte
          </h2>
          <p className="mt-2 max-w-2xl text-emerald-100">
            Planifiez votre parcelle en quelques clics. Entrez votre code postal,
            choisissez vos cultures et visualisez le réseau d&apos;irrigation en
            2D ou 3D.
          </p>
        </div>

        {planLoading && (
          <p className="sr-only" role="status" aria-live="polite">
            Mise à jour du plan…
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <SettingsPanel
              config={config}
              location={location}
              onChange={updateConfig}
              onLocation={setLocation}
            />
            <PlotSetup config={config} onChange={updateConfig} />
            <CropSelector
              config={config}
              varieties={varieties}
              recommended={recommendedVarieties}
              regionLabel={
                location
                  ? `${location.cityHint} · ${location.regionName}`
                  : varietiesRegionLabel
              }
              loading={varietiesLoading}
              onChange={(selectedVarieties) =>
                updateConfig({ selectedVarieties })
              }
            />
            {config.selectedVarieties.length > 0 && (
              <LayoutAdviceBanner
                advice={plan.layoutAdvice}
                config={config}
                onExpand={(widthM, lengthM) =>
                  updateConfig({ widthM, lengthM })
                }
                onRemoveVarieties={(ids) =>
                  updateConfig({
                    selectedVarieties: config.selectedVarieties.filter(
                      (id) => !ids.includes(id)
                    ),
                  })
                }
              />
            )}
            <IrrigationPanel
              config={config}
              onChange={(irrigationModeId) =>
                updateConfig({ irrigationModeId })
              }
            />
          </div>

          <div className="space-y-6">
            <div
              role="tablist"
              aria-label="Mode d'affichage du plan"
              className="flex flex-wrap gap-2"
            >
              {(
                [
                  { id: "2d" as const, label: "Plan 2D" },
                  { id: "3d" as const, label: "Vue 3D" },
                  ...(isMobile
                    ? []
                    : [{ id: "both" as const, label: "Les deux" }]),
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={viewMode === tab.id}
                  onClick={() => setViewMode(tab.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 ${
                    viewMode === tab.id
                      ? "bg-emerald-700 text-white"
                      : "bg-white text-emerald-800 border border-emerald-200 hover:border-emerald-400"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {(viewMode === "2d" || viewMode === "both") && (
              <PlotGrid
                plan={plan}
                config={config}
                varietyDisplay={varietyDisplay}
                widthM={config.widthM}
                lengthM={config.lengthM}
              />
            )}

            {(viewMode === "3d" || viewMode === "both") && (
              <PlotView3D
                plan={plan}
                config={config}
                varietyDisplay={varietyDisplay}
                widthM={config.widthM}
                lengthM={config.lengthM}
              />
            )}

            <ResultsPanel plan={plan} config={config} />
          </div>
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
          <ProductRecommendations
            products={products}
            loading={productsLoading}
            regionName={location?.regionName}
          />
          <IrrigationSolutionsGuide
            config={config}
            onSelect={(irrigationModeId) =>
              updateConfig({ irrigationModeId })
            }
          />
        </div>

        <Footer />
      </main>
    </>
  );
}
