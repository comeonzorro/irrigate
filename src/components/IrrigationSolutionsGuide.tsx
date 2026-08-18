"use client";

import type { PlotConfig } from "@/lib/types";
import { IRRIGATION_MODES } from "@/lib/data/irrigation";
import { SolutionDiagram } from "@/components/IrrigationLegend";

interface IrrigationSolutionsGuideProps {
  config: PlotConfig;
  onSelect: (modeId: PlotConfig["irrigationModeId"]) => void;
}

export function IrrigationSolutionsGuide({
  config,
  onSelect,
}: IrrigationSolutionsGuideProps) {
  const availableModes = IRRIGATION_MODES.filter((m) => m.available || m.v2);

  return (
    <section
      aria-labelledby="solutions-guide-heading"
      className="rounded-2xl border border-emerald-200/60 bg-white/80 p-5 shadow-sm backdrop-blur"
    >
      <h2
        id="solutions-guide-heading"
        className="mb-1 text-lg font-semibold text-emerald-900"
      >
        💡 Types d&apos;arrosage — à quoi ça ressemble ?
      </h2>
      <p className="mb-4 text-sm text-emerald-700">
        Chaque solution a un réseau différent. Cliquez pour l&apos;appliquer à
        votre parcelle.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {availableModes.map((mode) => {
          const selected = config.irrigationModeId === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              disabled={!mode.available}
              onClick={() => mode.available && onSelect(mode.id)}
              aria-pressed={selected}
              className={`rounded-xl border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 ${
                !mode.available
                  ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-60"
                  : selected
                    ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-300"
                    : "border-emerald-100 hover:border-emerald-400"
              }`}
            >
              <div className="flex gap-3">
                <div className="h-[72px] w-[120px] shrink-0 overflow-hidden rounded-lg border border-emerald-100 bg-gradient-to-b from-sky-50 to-amber-50">
                  <SolutionDiagram modeId={mode.id} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-sm font-medium text-emerald-900">
                      {mode.name}
                    </span>
                    {mode.v2 && (
                      <span className="shrink-0 rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] text-violet-700">
                        V2
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-emerald-700">
                    {mode.description}
                  </p>
                  <p className="mt-1.5 text-[10px] text-emerald-600">
                    Efficacité {(mode.efficiency * 100).toFixed(0)}% · ~
                    {mode.setupCostPerM2} €/m²
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
