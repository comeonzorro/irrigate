"use client";

import { useCallback, useState } from "react";
import type { LocationInfo, PlotConfig, SoilType } from "@/lib/types";
import { locatePostalCode } from "@/lib/api/client";
import { SOIL_TYPES } from "@/lib/data/soil";

interface SettingsPanelProps {
  config: PlotConfig;
  location: LocationInfo | null;
  onChange: (patch: Partial<PlotConfig>) => void;
  onLocation: (location: LocationInfo | null) => void;
}

const SOIL_ICONS: Record<SoilType, string> = {
  argileux: "🧱",
  limoneux: "🌾",
  sableux: "🏖️",
  mixte: "🪴",
};

export function SettingsPanel({
  config,
  location,
  onChange,
  onLocation,
}: SettingsPanelProps) {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePostalBlur = useCallback(async () => {
    const cp = config.postalCode.trim();
    if (cp.length === 0) {
      onLocation(null);
      onChange({ regionId: "france" });
      setError(null);
      return;
    }
    if (cp.replace(/\D/g, "").length !== 5) {
      setError("Le code postal doit contenir 5 chiffres.");
      return;
    }
    setLocating(true);
    setError(null);
    const result = await locatePostalCode(cp);
    setLocating(false);
    if (!result) {
      setError("Code postal non reconnu.");
      onLocation(null);
      return;
    }
    onLocation(result);
    onChange({ regionId: result.regionId, postalCode: result.postalCode });
  }, [config.postalCode, onChange, onLocation]);

  return (
    <section
      aria-labelledby="settings-heading"
      className="rounded-2xl border border-emerald-200/60 bg-white/80 p-5 shadow-sm backdrop-blur"
    >
      <h2 id="settings-heading" className="mb-1 text-lg font-semibold text-emerald-900">
        ⚙️ Réglages
      </h2>
      <p className="mb-4 text-sm text-emerald-700" id="settings-desc">
        Votre code postal adapte le climat, les variétés et les produits
        recommandés.
      </p>

      <div className="space-y-5">
        <div>
          <label htmlFor="postal-code" className="block text-sm font-medium text-emerald-800">
            Code postal
          </label>
          <p id="postal-hint" className="mb-2 text-xs text-emerald-600">
            France métropolitaine — 5 chiffres (ex. 94450)
          </p>
          <input
            id="postal-code"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            placeholder="94450"
            aria-describedby="postal-hint location-summary postal-error"
            value={config.postalCode}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 5);
              onChange({ postalCode: v });
              setError(null);
            }}
            onBlur={handlePostalBlur}
            className="w-full rounded-lg border border-emerald-200 px-3 py-2.5 text-base tracking-widest focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
          {error && (
            <p id="postal-error" className="mt-1 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          {locating && (
            <p className="mt-2 text-sm text-emerald-600" role="status">
              Localisation…
            </p>
          )}
          <p
            id="location-summary"
            className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
            role="status"
            aria-live="polite"
          >
            {location ? (
              <>
                <strong>
                  {location.cityHint} ({location.postalCode})
                </strong>
                <span className="block text-emerald-700">
                  {location.regionName} · {location.climateZone} ·{" "}
                  {location.avgRainfallMm} mm/an · {location.frostFreeDays} j
                  sans gel
                </span>
              </>
            ) : (
              <span className="text-emerald-600">
                Saisissez votre code postal pour personnaliser les
                recommandations.
              </span>
            )}
          </p>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-emerald-800">
            Type de terre
          </legend>
          <p id="soil-hint" className="mb-3 text-xs text-emerald-600">
            Sol dominant de votre parcelle.
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
            {SOIL_TYPES.find((s) => s.type === config.soilType)?.drainage}
          </p>
        </fieldset>
      </div>
    </section>
  );
}
