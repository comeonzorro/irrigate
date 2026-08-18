"use client";

import type { PlotConfig } from "@/lib/types";
import { REGIONS } from "@/lib/data/regions";
import { SOIL_TYPES } from "@/lib/data/soil";

const SUN_OPTIONS = [
  { value: "S" as const, label: "Sud ☀️", desc: "Ensoleillement maximal" },
  { value: "E" as const, label: "Est 🌅", desc: "Soleil matinal" },
  { value: "O" as const, label: "Ouest 🌇", desc: "Soleil après-midi" },
  { value: "N" as const, label: "Nord 🌥️", desc: "Ombre / mi-ombre" },
];

interface PlotSetupProps {
  config: PlotConfig;
  onChange: (patch: Partial<PlotConfig>) => void;
}

export function PlotSetup({ config, onChange }: PlotSetupProps) {
  return (
    <section className="rounded-2xl border border-emerald-200/60 bg-white/80 p-5 shadow-sm backdrop-blur">
      <h2 className="mb-4 text-lg font-semibold text-emerald-900">
        🌱 Votre parcelle
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-emerald-800">Largeur (m)</span>
          <input
            type="number"
            min={1}
            max={50}
            step={0.5}
            value={config.widthM}
            onChange={(e) => onChange({ widthM: Number(e.target.value) })}
            className="rounded-lg border border-emerald-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-emerald-800">Longueur (m)</span>
          <input
            type="number"
            min={1}
            max={50}
            step={0.5}
            value={config.lengthM}
            onChange={(e) => onChange({ lengthM: Number(e.target.value) })}
            className="rounded-lg border border-emerald-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </label>
      </div>

      <p className="mt-2 text-sm text-emerald-700">
        Surface : {(config.widthM * config.lengthM).toFixed(1)} m²
      </p>

      <label className="mt-4 flex flex-col gap-1">
        <span className="text-sm font-medium text-emerald-800">Région</span>
        <select
          value={config.regionId}
          onChange={(e) => onChange({ regionId: e.target.value })}
          className="rounded-lg border border-emerald-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        >
          {REGIONS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
              {r.level === "commune" ? " (commune)" : r.level === "region" ? " (région)" : ""}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="mt-4">
        <legend className="text-sm font-medium text-emerald-800">
          Exposition au soleil
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SUN_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ sunExposure: opt.value })}
              className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                config.sunExposure === opt.value
                  ? "border-emerald-600 bg-emerald-100 font-medium text-emerald-900"
                  : "border-emerald-100 bg-emerald-50/50 hover:border-emerald-300"
              }`}
            >
              <div>{opt.label}</div>
              <div className="text-xs text-emerald-600">{opt.desc}</div>
            </button>
          ))}
        </div>
      </fieldset>

      <label className="mt-4 flex flex-col gap-1">
        <span className="text-sm font-medium text-emerald-800">Type de sol</span>
        <select
          value={config.soilType}
          onChange={(e) =>
            onChange({ soilType: e.target.value as PlotConfig["soilType"] })
          }
          className="rounded-lg border border-emerald-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        >
          {SOIL_TYPES.map((s) => (
            <option key={s.type} value={s.type}>
              {s.name}
            </option>
          ))}
        </select>
        <span className="text-xs text-emerald-600">
          {SOIL_TYPES.find((s) => s.type === config.soilType)?.description}
        </span>
      </label>
    </section>
  );
}
