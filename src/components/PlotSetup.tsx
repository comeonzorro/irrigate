"use client";

import type { PlotConfig } from "@/lib/types";

const SUN_OPTIONS = [
  { value: "S" as const, label: "Sud", icon: "☀️", desc: "Ensoleillement maximal" },
  { value: "E" as const, label: "Est", icon: "🌅", desc: "Soleil matinal" },
  { value: "O" as const, label: "Ouest", icon: "🌇", desc: "Soleil après-midi" },
  { value: "N" as const, label: "Nord", icon: "🌥️", desc: "Ombre / mi-ombre" },
];

interface PlotSetupProps {
  config: PlotConfig;
  onChange: (patch: Partial<PlotConfig>) => void;
}

export function PlotSetup({ config, onChange }: PlotSetupProps) {
  return (
    <section
      aria-labelledby="plot-heading"
      className="rounded-2xl border border-emerald-200/60 bg-white/80 p-5 shadow-sm backdrop-blur"
    >
      <h2 id="plot-heading" className="mb-4 text-lg font-semibold text-emerald-900">
        🌱 Dimensions de la parcelle
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-emerald-800">Largeur (m)</span>
          <input
            type="number"
            min={1}
            max={50}
            step={0.5}
            aria-describedby="surface-info"
            value={config.widthM}
            onChange={(e) => onChange({ widthM: Number(e.target.value) })}
            className="rounded-lg border border-emerald-200 px-3 py-2.5 text-base focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-emerald-800">Longueur (m)</span>
          <input
            type="number"
            min={1}
            max={50}
            step={0.5}
            aria-describedby="surface-info"
            value={config.lengthM}
            onChange={(e) => onChange({ lengthM: Number(e.target.value) })}
            className="rounded-lg border border-emerald-200 px-3 py-2.5 text-base focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </label>
      </div>

      <p id="surface-info" className="mt-2 text-sm text-emerald-700" aria-live="polite">
        Surface : <strong>{(config.widthM * config.lengthM).toFixed(1)} m²</strong>
      </p>

      <fieldset className="mt-4">
        <legend className="text-sm font-medium text-emerald-800">
          Exposition au soleil
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SUN_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={config.sunExposure === opt.value}
              onClick={() => onChange({ sunExposure: opt.value })}
              className={`rounded-xl border px-3 py-2.5 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 ${
                config.sunExposure === opt.value
                  ? "border-emerald-600 bg-emerald-100 font-medium text-emerald-900"
                  : "border-emerald-100 bg-emerald-50/50 hover:border-emerald-300"
              }`}
            >
              <span aria-hidden="true">{opt.icon}</span> {opt.label}
              <span className="block text-xs text-emerald-600">{opt.desc}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50/80 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={config.hasGreenhouse}
            onChange={(e) => onChange({ hasGreenhouse: e.target.checked })}
            className="mt-1 h-4 w-4 rounded border-violet-300 text-violet-600 focus:ring-violet-400"
          />
          <span>
            <span className="font-medium text-violet-900">
              🏠 Serre ou tunnel
            </span>
            <span className="mt-1 block text-sm text-violet-800">
              Débloque tomates, poivrons, melons, aubergines… Idéal en Bretagne
              ou climats frais pour étendre la saison.
            </span>
          </span>
        </label>
      </div>
    </section>
  );
}
