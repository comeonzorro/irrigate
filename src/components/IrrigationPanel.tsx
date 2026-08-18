"use client";

import type { PlotConfig } from "@/lib/types";
import { IRRIGATION_MODES } from "@/lib/data/irrigation";

interface IrrigationPanelProps {
  config: PlotConfig;
  onChange: (modeId: PlotConfig["irrigationModeId"]) => void;
}

export function IrrigationPanel({ config, onChange }: IrrigationPanelProps) {
  return (
    <section className="rounded-2xl border border-emerald-200/60 bg-white/80 p-5 shadow-sm backdrop-blur">
      <h2 className="mb-1 text-lg font-semibold text-emerald-900">
        💧 Mode d&apos;irrigation
      </h2>
      <p className="mb-4 text-sm text-emerald-700">
        Comparez les méthodes : coût d&apos;installation, eau consommée et temps
        passé.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {IRRIGATION_MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            disabled={!mode.available}
            onClick={() => onChange(mode.id)}
            className={`rounded-xl border p-4 text-left transition ${
              !mode.available
                ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-60"
                : config.irrigationModeId === mode.id
                  ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-300"
                  : "border-emerald-100 hover:border-emerald-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-emerald-900">{mode.name}</span>
              {mode.v2 && (
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700">
                  V2
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-emerald-700">{mode.description}</p>
            <div className="mt-2 flex gap-3 text-xs text-emerald-600">
              <span>Efficacité {(mode.efficiency * 100).toFixed(0)}%</span>
              <span>~{mode.setupCostPerM2} €/m²</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
