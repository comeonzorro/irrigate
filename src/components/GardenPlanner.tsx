"use client";

import { useMemo, useState } from "react";
import type { PlotConfig } from "@/lib/types";
import { generatePlan } from "@/lib/engine/plan";
import { Header } from "@/components/Header";
import { PlotSetup } from "@/components/PlotSetup";
import { CropSelector } from "@/components/CropSelector";
import { IrrigationPanel } from "@/components/IrrigationPanel";
import { PlotGrid } from "@/components/PlotGrid";
import { ResultsPanel } from "@/components/ResultsPanel";

const DEFAULT_CONFIG: PlotConfig = {
  widthM: 4,
  lengthM: 6,
  regionId: "limeil-brevannes",
  sunExposure: "S",
  soilType: "mixte",
  selectedVarieties: ["tomate-cerise-idf"],
  irrigationModeId: "drip_buried",
};

export function GardenPlanner() {
  const [config, setConfig] = useState<PlotConfig>(DEFAULT_CONFIG);

  const plan = useMemo(() => generatePlan(config), [config]);

  const updateConfig = (patch: Partial<PlotConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-600 p-6 text-white shadow-lg">
          <h2 className="text-xl font-semibold">
            Cultivez intelligemment à Limeil-Brévannes et partout en France
          </h2>
          <p className="mt-2 max-w-2xl text-emerald-100">
            Définissez votre parcelle, choisissez vos variétés adaptées à
            l&apos;exposition (N/S/E/O), et obtenez un plan d&apos;arrosage
            sur-mesure avec estimation de rendement et budget.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <PlotSetup config={config} onChange={updateConfig} />
            <CropSelector
              config={config}
              onChange={(selectedVarieties) =>
                updateConfig({ selectedVarieties })
              }
            />
            <IrrigationPanel
              config={config}
              onChange={(irrigationModeId) =>
                updateConfig({ irrigationModeId })
              }
            />
          </div>

          <div className="space-y-6">
            <PlotGrid
              plan={plan}
              widthM={config.widthM}
              lengthM={config.lengthM}
            />
            <ResultsPanel plan={plan} config={config} />
          </div>
        </div>

        <footer className="mt-12 border-t border-emerald-200 pt-6 text-center text-sm text-emerald-700">
          <p>
            <strong>Roadmap V2 :</strong> vue 3D (Three.js), builder Arduino,
            catalogue matériel partenaire (Jardiland, Leroy Merlin…)
          </p>
          <p className="mt-1 text-xs text-emerald-500">
            Estimations indicatives — consultez un jardinier local pour affiner.
          </p>
        </footer>
      </main>
    </>
  );
}
