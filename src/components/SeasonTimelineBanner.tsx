"use client";

import { useMemo } from "react";
import type { PlotConfig, PublicVariety } from "@/lib/types";
import { buildSeasonTimeline } from "@/lib/season-recommendations";

const SEASON_BAR: Record<
  "printemps" | "ete" | "automne" | "hiver",
  string
> = {
  printemps: "bg-emerald-400",
  ete: "bg-amber-400",
  automne: "bg-orange-500",
  hiver: "bg-sky-400",
};

interface SeasonTimelineBannerProps {
  varieties: PublicVariety[];
  config: Pick<PlotConfig, "hasGreenhouse">;
  loading?: boolean;
  onSelectVariety?: (id: string) => void;
}

export function SeasonTimelineBanner({
  varieties,
  config,
  loading,
  onSelectVariety,
}: SeasonTimelineBannerProps) {
  const timeline = useMemo(
    () => buildSeasonTimeline(varieties, config.hasGreenhouse),
    [varieties, config.hasGreenhouse]
  );

  if (loading || varieties.length === 0) return null;

  return (
    <section
      aria-labelledby="season-timeline-heading"
      className="mb-6 overflow-hidden rounded-2xl border border-emerald-200/80 bg-white shadow-sm"
    >
      <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3">
        <h2
          id="season-timeline-heading"
          className="text-sm font-semibold text-emerald-950"
        >
          Timeline saisonnière — {timeline.currentMonthLabel}{" "}
          <span className="font-normal text-emerald-700">
            · {timeline.currentSeasonLabel}
          </span>
        </h2>
      </div>

      <div className="overflow-x-auto px-4 py-4">
        <div className="flex min-w-[640px] gap-1">
          {timeline.months.map((month) => (
            <div
              key={month.month}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <div
                className={`h-1.5 w-full rounded-full ${SEASON_BAR[month.seasonKey]} ${
                  month.isCurrent ? "ring-2 ring-emerald-600 ring-offset-1" : "opacity-60"
                }`}
                title={month.label}
              />
              <span
                className={`text-[10px] font-medium sm:text-xs ${
                  month.isCurrent
                    ? "font-bold text-emerald-800"
                    : "text-emerald-600"
                }`}
              >
                {month.shortLabel}
                {month.isCurrent ? " ▼" : ""}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-emerald-100 bg-emerald-50/40 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Espèces du moment
        </p>
        {timeline.currentVarieties.length === 0 ? (
          <p className="mt-2 text-sm text-emerald-700">
            Peu de plantations directes ce mois-ci — consultez les conseils ci-dessous
            ou activez la serre pour élargir la fenêtre.
          </p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-2">
            {timeline.currentVarieties.map((variety) => (
              <li key={variety.id}>
                {onSelectVariety ? (
                  <button
                    type="button"
                    onClick={() => onSelectVariety(variety.id)}
                    className="rounded-full border border-emerald-300 bg-white px-3 py-1 text-sm text-emerald-900 transition hover:border-emerald-500 hover:bg-emerald-50"
                  >
                    {variety.emoji} {variety.name}
                  </button>
                ) : (
                  <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-sm text-emerald-900">
                    {variety.emoji} {variety.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
