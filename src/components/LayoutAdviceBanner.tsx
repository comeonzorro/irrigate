"use client";

import type { LayoutAdvice, PlotConfig } from "@/lib/types";

interface LayoutAdviceBannerProps {
  advice: LayoutAdvice;
  config: PlotConfig;
  onExpand: (widthM: number, lengthM: number) => void;
  onRemoveVarieties: (ids: string[]) => void;
}

const STATUS_STYLES = {
  ok: {
    bg: "bg-emerald-50 border-emerald-300",
    icon: "✅",
    title: "Répartition OK",
  },
  tight: {
    bg: "bg-amber-50 border-amber-300",
    icon: "⚠️",
    title: "Parcelle un peu juste",
  },
  overflow: {
    bg: "bg-red-50 border-red-300",
    icon: "🚫",
    title: "Surface insuffisante",
  },
};

export function LayoutAdviceBanner({
  advice,
  config,
  onExpand,
  onRemoveVarieties,
}: LayoutAdviceBannerProps) {
  if (config.selectedVarieties.length === 0) return null;

  const style = STATUS_STYLES[advice.status];
  const hasSuggestion =
    advice.suggestedWidthM !== undefined &&
    advice.suggestedLengthM !== undefined;

  return (
    <section
      role="alert"
      aria-live="polite"
      className={`rounded-2xl border p-4 ${style.bg}`}
    >
      <div className="flex items-start gap-2">
        <span className="text-xl" aria-hidden="true">
          {style.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-emerald-900">{style.title}</h3>
          <p className="mt-1 text-sm text-emerald-800">{advice.message}</p>

          {advice.varieties.length > 1 && (
            <ul className="mt-3 space-y-1 text-sm text-emerald-800">
              {advice.varieties.map((v) => (
                <li key={v.varietyId} className="flex items-center gap-2">
                  <span aria-hidden="true">{v.emoji}</span>
                  <span>
                    <strong>{v.name.split(" «")[0]}</strong>
                    {" — "}
                    {v.placed === 0 ? (
                      <span className="text-red-700 font-medium">0 plant (pas de place)</span>
                    ) : (
                      <>
                        {v.placed} plant{v.placed > 1 ? "s" : ""}
                        {v.zoneAreaM2 !== undefined && (
                          <span className="text-emerald-600">
                            {" "}
                            · bande ~{v.zoneAreaM2} m²
                          </span>
                        )}
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {hasSuggestion && advice.status !== "ok" && (
              <button
                type="button"
                onClick={() =>
                  onExpand(advice.suggestedWidthM!, advice.suggestedLengthM!)
                }
                className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Agrandir à {advice.suggestedWidthM} × {advice.suggestedLengthM} m
                {advice.suggestedAreaM2 !== undefined && (
                  <span className="ml-1 opacity-90">
                    ({advice.suggestedAreaM2.toFixed(1)} m²)
                  </span>
                )}
              </button>
            )}

            {advice.unplacedVarietyIds && advice.unplacedVarietyIds.length > 0 && (
              <button
                type="button"
                onClick={() => onRemoveVarieties(advice.unplacedVarietyIds!)}
                className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-800 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
              >
                Retirer les espèces sans place (
                {advice.unplacedVarietyIds.length})
              </button>
            )}

            {advice.status === "overflow" &&
              config.selectedVarieties.length > 2 &&
              (!advice.unplacedVarietyIds ||
                advice.unplacedVarietyIds.length === 0) && (
                <button
                  type="button"
                  onClick={() =>
                    onRemoveVarieties(config.selectedVarieties.slice(1))
                  }
                  className="rounded-lg border border-emerald-400 bg-white px-4 py-2 text-sm font-medium text-emerald-800 transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                >
                  Ne garder que la 1ère culture sélectionnée
                </button>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}
