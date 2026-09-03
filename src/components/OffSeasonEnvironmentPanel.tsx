"use client";

import { useMemo } from "react";
import type { PlotConfig, PublicVariety } from "@/lib/types";
import { assessOffSeasonSelections } from "@/lib/season-recommendations";
import { getMonthLabel } from "@/lib/season-calendar";

interface OffSeasonEnvironmentPanelProps {
  varieties: PublicVariety[];
  config: PlotConfig;
  onEnableGreenhouse?: () => void;
}

export function OffSeasonEnvironmentPanel({
  varieties,
  config,
  onEnableGreenhouse,
}: OffSeasonEnvironmentPanelProps) {
  const offSeason = useMemo(
    () =>
      assessOffSeasonSelections(
        varieties,
        config.selectedVarieties,
        config.hasGreenhouse
      ),
    [varieties, config.selectedVarieties, config.hasGreenhouse]
  );

  if (offSeason.length === 0) return null;

  return (
    <section
      aria-labelledby="off-season-heading"
      className="rounded-2xl border border-violet-300 bg-violet-50/80 p-5 shadow-sm"
      role="alert"
    >
      <h2
        id="off-season-heading"
        className="text-lg font-semibold text-violet-950"
      >
        🌡️ Environnement adapté pour vos choix
      </h2>
      <p className="mt-1 text-sm text-violet-900">
        {offSeason.length} culture{offSeason.length > 1 ? "s" : ""} hors de la
        fenêtre idéale ce mois-ci — voici comment les accompagner.
      </p>

      <ul className="mt-4 space-y-4">
        {offSeason.map((advice) => (
          <li
            key={advice.variety.id}
            className="rounded-xl border border-violet-200 bg-white/90 p-4"
          >
            <p className="font-medium text-emerald-950">
              {advice.variety.emoji} {advice.variety.name}
              {advice.nextPlantingMonth ? (
                <span className="ml-2 text-sm font-normal text-violet-800">
                  · fenêtre naturelle :{" "}
                  {getMonthLabel(advice.nextPlantingMonth).toLowerCase()}
                </span>
              ) : null}
            </p>
            <ul className="mt-3 space-y-2">
              {advice.solutions.map((solution) => (
                <li
                  key={`${advice.variety.id}-${solution.type}`}
                  className="flex flex-wrap items-start justify-between gap-2 rounded-lg bg-violet-50/80 px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-violet-950">
                      {solution.emoji} {solution.title}
                    </p>
                    <p className="text-xs leading-relaxed text-violet-900">
                      {solution.description}
                    </p>
                  </div>
                  {solution.action === "enable_greenhouse" &&
                  !config.hasGreenhouse &&
                  onEnableGreenhouse ? (
                    <button
                      type="button"
                      onClick={onEnableGreenhouse}
                      className="shrink-0 rounded-full bg-violet-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-800"
                    >
                      Activer serre
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
