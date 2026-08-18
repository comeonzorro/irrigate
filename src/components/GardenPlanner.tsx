"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type { PlotConfig } from "@/lib/types";
import { generatePlan } from "@/lib/engine/plan";
import { getRegion } from "@/lib/data/regions";
import { Header } from "@/components/Header";
import { SettingsPanel } from "@/components/SettingsPanel";
import { PlotSetup } from "@/components/PlotSetup";
import { CropSelector } from "@/components/CropSelector";
import { IrrigationPanel } from "@/components/IrrigationPanel";
import { LayoutAdviceBanner } from "@/components/LayoutAdviceBanner";
import { PlotGrid } from "@/components/PlotGrid";
import { ResultsPanel } from "@/components/ResultsPanel";
import { IrrigationSolutionsGuide } from "@/components/IrrigationSolutionsGuide";

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

const DEFAULT_CONFIG: PlotConfig = {
  widthM: 4,
  lengthM: 6,
  regionId: "limeil-brevannes",
  sunExposure: "S",
  soilType: "mixte",
  selectedVarieties: ["tomate-cerise-idf"],
  irrigationModeId: "drip_buried",
};

type ViewMode = "2d" | "3d" | "both";

export function GardenPlanner() {
  const [config, setConfig] = useState<PlotConfig>(DEFAULT_CONFIG);
  const [viewMode, setViewMode] = useState<ViewMode>("both");

  const plan = useMemo(() => generatePlan(config), [config]);
  const region = getRegion(config.regionId);

  const updateConfig = (patch: Partial<PlotConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

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
            {region
              ? `Potager optimisé pour ${region.name}`
              : "Planifiez votre potager"}
          </h2>
          <p className="mt-2 max-w-2xl text-emerald-100">
            Définissez parcelle, localité et sol dans les réglages. Visualisez
            l&apos;implantation des tuyaux sur le plan 2D ou en 3D pour
            préparer votre installation.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <SettingsPanel config={config} onChange={updateConfig} />
            <PlotSetup config={config} onChange={updateConfig} />
            <CropSelector
              config={config}
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
                  { id: "both" as const, label: "Les deux" },
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
                widthM={config.widthM}
                lengthM={config.lengthM}
              />
            )}

            {(viewMode === "3d" || viewMode === "both") && (
              <PlotView3D
                plan={plan}
                config={config}
                widthM={config.widthM}
                lengthM={config.lengthM}
              />
            )}

            <ResultsPanel plan={plan} config={config} />

            <IrrigationSolutionsGuide
              config={config}
              onSelect={(irrigationModeId) =>
                updateConfig({ irrigationModeId })
              }
            />
          </div>
        </div>

        <footer className="mt-12 border-t border-emerald-200 pt-6 text-center text-sm text-emerald-700">
          <p>
            La vue 3D aide à visualiser la profondeur des tuyaux enterrés avant
            de creuser. Builder Arduino et catalogue matériel en V2.
          </p>
          <p className="mt-1 text-xs text-emerald-500">
            Estimations indicatives — consultez un jardinier local pour affiner.
          </p>
        </footer>
      </main>
    </>
  );
}
