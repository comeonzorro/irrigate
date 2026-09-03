"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { PlotConfig, PublicVariety } from "@/lib/types";
import { buildSeasonalRecommendations } from "@/lib/season-recommendations";
import { getMonthLabel } from "@/lib/season-calendar";

interface SeasonalRecommendationsPanelProps {
  varieties: PublicVariety[];
  config: PlotConfig;
  loading?: boolean;
  onAddVariety: (id: string) => void;
  onAddVarieties: (ids: string[]) => void;
}

export function SeasonalRecommendationsPanel({
  varieties,
  config,
  loading,
  onAddVariety,
  onAddVarieties,
}: SeasonalRecommendationsPanelProps) {
  const recommendations = useMemo(
    () => buildSeasonalRecommendations(varieties, config),
    [varieties, config]
  );

  const hasContent =
    recommendations.plantNow.length > 0 ||
    recommendations.planLater.length > 0 ||
    recommendations.harvestNow.length > 0 ||
    recommendations.tips.length > 0;

  if (loading || config.postalCode.length !== 5 || !hasContent) {
    return null;
  }

  return (
    <section
      aria-labelledby="seasonal-rec-heading"
      className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="seasonal-rec-heading"
            className="text-lg font-semibold text-emerald-950"
          >
            📆 Que cultiver en {recommendations.monthLabel.toLowerCase()} ?
          </h2>
          <p className="mt-1 text-sm text-emerald-800">
            Suggestions selon la date, votre région
            {config.hasGreenhouse ? " et votre serre" : ""}.
          </p>
        </div>
        <Link
          href="/calendrier"
          className="text-sm font-medium text-emerald-700 underline"
        >
          Calendrier complet →
        </Link>
      </div>

      {recommendations.plantNow.length > 0 ? (
        <div className="mt-5">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              À cultiver maintenant
            </h3>
            <button
              type="button"
              onClick={() =>
                onAddVarieties(recommendations.plantNow.map((s) => s.variety.id))
              }
              className="text-xs font-semibold text-emerald-700 underline hover:text-emerald-900"
            >
              Tout ajouter au plan
            </button>
          </div>
          <ul className="space-y-2">
            {recommendations.plantNow.map((suggestion) => (
              <li
                key={suggestion.variety.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-white/90 px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-emerald-950">
                    {suggestion.variety.emoji} {suggestion.variety.name}
                    <span className="ml-2 text-xs font-normal capitalize text-emerald-600">
                      {suggestion.action}
                    </span>
                  </p>
                  <p className="text-xs text-emerald-700">{suggestion.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onAddVariety(suggestion.variety.id)}
                  className="shrink-0 rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
                >
                  + Ajouter
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {recommendations.planLater.length > 0 ? (
        <div className="mt-5">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-800">
            Pas encore la saison — planifier
          </h3>
          <ul className="space-y-2">
            {recommendations.planLater.map((suggestion) => (
              <li
                key={suggestion.variety.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-emerald-950">
                    {suggestion.variety.emoji} {suggestion.variety.name}
                    {suggestion.targetMonth ? (
                      <span className="ml-2 text-xs font-normal text-amber-800">
                        → {getMonthLabel(suggestion.targetMonth)}
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-amber-900/80">{suggestion.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onAddVariety(suggestion.variety.id)}
                  className="shrink-0 rounded-full border border-amber-400 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-50"
                >
                  Planifier
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {recommendations.harvestNow.length > 0 ? (
        <div className="mt-5">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-700">
            Récoltes de vos cultures
          </h3>
          <ul className="flex flex-wrap gap-2">
            {recommendations.harvestNow.map((suggestion) => (
              <li
                key={suggestion.variety.id}
                className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm text-teal-900"
              >
                {suggestion.variety.emoji} {suggestion.variety.name}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {recommendations.tips.length > 0 ? (
        <div className="mt-5 border-t border-emerald-100 pt-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Conseils du moment
          </h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {recommendations.tips.map((tip) => (
              <li
                key={tip.id}
                className="rounded-xl border border-emerald-100 bg-white/80 p-3 text-sm"
              >
                <p className="font-medium text-emerald-950">
                  {tip.emoji} {tip.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-emerald-800">
                  {tip.description}
                </p>
                {tip.href ? (
                  <Link
                    href={tip.href}
                    className="mt-2 inline-block text-xs font-semibold text-emerald-700 underline"
                  >
                    En savoir plus →
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
