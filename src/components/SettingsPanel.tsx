"use client";

import type { PlotConfig, SoilType } from "@/lib/types";
import { COMMUNES, getRegion, getRegionHierarchy } from "@/lib/data/regions";
import { SOIL_TYPES } from "@/lib/data/soil";

interface SettingsPanelProps {
  config: PlotConfig;
  onChange: (patch: Partial<PlotConfig>) => void;
}

const SOIL_ICONS: Record<SoilType, string> = {
  argileux: "🧱",
  limoneux: "🌾",
  sableux: "🏖️",
  mixte: "🪴",
};

export function SettingsPanel({ config, onChange }: SettingsPanelProps) {
  const region = getRegion(config.regionId);
  const hierarchy = getRegionHierarchy(config.regionId);

  return (
    <section
      aria-labelledby="settings-heading"
      className="rounded-2xl border border-emerald-200/60 bg-white/80 p-5 shadow-sm backdrop-blur"
    >
      <h2 id="settings-heading" className="mb-1 text-lg font-semibold text-emerald-900">
        ⚙️ Réglages
      </h2>
      <p className="mb-4 text-sm text-emerald-700" id="settings-desc">
        Localité et type de terre influencent les recommandations de cultures,
        l&apos;arrosage et les engrais.
      </p>

      <div className="space-y-5">
        <div>
          <label htmlFor="locality-select" className="block text-sm font-medium text-emerald-800">
            Localité
          </label>
          <p id="locality-hint" className="mb-2 text-xs text-emerald-600">
            Choisissez votre commune pour adapter le climat et les variétés.
          </p>
          <select
            id="locality-select"
            aria-describedby="locality-hint locality-summary"
            value={config.regionId}
            onChange={(e) => onChange({ regionId: e.target.value })}
            className="w-full rounded-lg border border-emerald-200 px-3 py-2.5 text-base focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            <optgroup label="Communes">
              {COMMUNES.map((c) => {
                const parent = c.parentId ? getRegion(c.parentId) : undefined;
                return (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {parent ? ` (${parent.name})` : ""}
                  </option>
                );
              })}
            </optgroup>
            <optgroup label="Région ou pays (vue élargie)">
              <option value="ile-de-france">Île-de-France</option>
              <option value="auvergne-rhone-alpes">Auvergne-Rhône-Alpes</option>
              <option value="nouvelle-aquitaine">Nouvelle-Aquitaine</option>
              <option value="france">France (national)</option>
            </optgroup>
          </select>
          <p
            id="locality-summary"
            className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
            role="status"
            aria-live="polite"
          >
            {region && (
              <>
                <strong>{region.name}</strong> — {region.climateZone},{" "}
                {region.avgRainfallMm} mm/an, {region.frostFreeDays} jours sans
                gel
                {hierarchy.length > 1 && (
                  <span className="block text-xs text-emerald-600 mt-0.5">
                    Hiérarchie : {hierarchy.map((r) => r.name).join(" → ")}
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-emerald-800">
            Type de terre
          </legend>
          <p id="soil-hint" className="mb-3 text-xs text-emerald-600">
            Sélectionnez le sol dominant de votre parcelle. Chaque option est
            sélectionnable au clavier.
          </p>
          <div
            role="radiogroup"
            aria-describedby="soil-hint soil-selected-desc"
            className="grid gap-2 sm:grid-cols-2"
          >
            {SOIL_TYPES.map((s) => {
              const selected = config.soilType === s.type;
              return (
                <button
                  key={s.type}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onChange({ soilType: s.type })}
                  className={`rounded-xl border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 ${
                    selected
                      ? "border-emerald-600 bg-emerald-100 ring-1 ring-emerald-400"
                      : "border-emerald-100 bg-white hover:border-emerald-300"
                  }`}
                >
                  <span className="text-lg" aria-hidden="true">
                    {SOIL_ICONS[s.type]}
                  </span>
                  <span className="ml-1 font-medium text-emerald-900">{s.name}</span>
                  <span className="mt-1 block text-xs text-emerald-700">
                    {s.description}
                  </span>
                </button>
              );
            })}
          </div>
          <p
            id="soil-selected-desc"
            className="mt-2 text-xs text-emerald-600"
            aria-live="polite"
          >
            Drainage :{" "}
            {SOIL_TYPES.find((s) => s.type === config.soilType)?.drainage} ·
            Rétention eau :{" "}
            {(
              (SOIL_TYPES.find((s) => s.type === config.soilType)?.waterRetention ??
                1) * 100
            ).toFixed(0)}
            %
          </p>
        </fieldset>
      </div>
    </section>
  );
}
