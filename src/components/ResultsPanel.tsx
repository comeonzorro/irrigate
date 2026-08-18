"use client";

import type { PlanResult, PlotConfig } from "@/lib/types";
import { getIrrigationMode } from "@/lib/data/irrigation";

interface ResultsPanelProps {
  plan: PlanResult;
  config: PlotConfig;
}

function Stat({
  label,
  value,
  unit,
  highlight,
}: {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-3 ${
        highlight ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-900"
      }`}
    >
      <div className={`text-xs ${highlight ? "text-emerald-100" : "text-emerald-600"}`}>
        {label}
      </div>
      <div className="text-xl font-bold">
        {value}
        {unit && (
          <span className="ml-1 text-sm font-normal opacity-80">{unit}</span>
        )}
      </div>
    </div>
  );
}

export function ResultsPanel({ plan, config }: ResultsPanelProps) {
  const mode = getIrrigationMode(config.irrigationModeId);

  return (
    <section className="rounded-2xl border border-emerald-200/60 bg-white/80 p-5 shadow-sm backdrop-blur">
      <h2 className="mb-4 text-lg font-semibold text-emerald-900">
        📊 Plan d&apos;arrosage & rentabilité
      </h2>

      <h3 className="mb-2 text-sm font-semibold text-emerald-800">Eau</h3>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Par jour" value={plan.water.litersPerDay} unit="L" />
        <Stat label="Par semaine" value={plan.water.litersPerWeek} unit="L" />
        <Stat label="Par mois" value={plan.water.litersPerMonth} unit="L" />
        <Stat
          label="Coût eau/mois"
          value={plan.water.estimatedWaterCostMonthly}
          unit="€"
        />
      </div>

      <div className="mb-4 rounded-xl bg-sky-50 p-4 text-sm text-sky-900">
        <strong>{mode?.name}</strong> — {plan.water.sessionsPerWeek} sessions/semaine
        · ~{plan.water.minutesPerSession} min/session
        {plan.water.wateringCanTrips !== undefined && (
          <>
            {" "}
            · {plan.water.wateringCanTrips} remplissages d&apos;arrosoir 6 L/semaine
            (~{plan.water.wateringCanTrips * 2} min)
          </>
        )}
      </div>

      <h3 className="mb-2 text-sm font-semibold text-emerald-800">
        Réseau de tuyaux
      </h3>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Stat
          label="Longueur totale"
          value={plan.irrigation.totalPipeLengthM}
          unit="m"
        />
        <Stat
          label="Goutteurs"
          value={plan.irrigation.dripperCount || "—"}
        />
        <Stat
          label="Profondeur"
          value={
            plan.irrigation.buriedDepthCm
              ? plan.irrigation.buriedDepthCm
              : "Surface"
          }
          unit={plan.irrigation.buriedDepthCm ? "cm" : ""}
        />
      </div>

      <h3 className="mb-2 text-sm font-semibold text-emerald-800">
        Rendement estimé (saison)
      </h3>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Stat label="Récolte/jour" value={plan.yield.kgPerDay} unit="kg" />
        <Stat label="Récolte/semaine" value={plan.yield.kgPerWeek} unit="kg" />
        <Stat
          label="Récolte/mois"
          value={plan.yield.kgPerMonth}
          unit="kg"
          highlight
        />
      </div>

      <h3 className="mb-2 text-sm font-semibold text-emerald-800">
        Valeur marchande estimée
      </h3>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Stat label="Par jour" value={plan.yield.revenuePerDay} unit="€" />
        <Stat label="Par semaine" value={plan.yield.revenuePerWeek} unit="€" />
        <Stat
          label="Par mois"
          value={plan.yield.revenuePerMonth}
          unit="€"
          highlight
        />
      </div>

      <h3 className="mb-2 text-sm font-semibold text-emerald-800">Engrais</h3>
      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
        <p>
          <strong>{plan.fertilizer.type}</strong> — NPK {plan.fertilizer.npk}
        </p>
        <p className="mt-1 text-amber-900">
          {plan.fertilizer.amountKg} kg · {plan.fertilizer.frequency} · ~
          {plan.fertilizer.costEstimate} €/saison
        </p>
        <p className="mt-2 text-xs text-amber-800">{plan.fertilizer.notes}</p>
      </div>

      <h3 className="mb-2 text-sm font-semibold text-emerald-800">Budget</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Stat label="Installation" value={plan.setupCost} unit="€" />
        <Stat
          label="Coût mensuel"
          value={plan.monthlyOperatingCost}
          unit="€"
        />
        <Stat
          label="Rentabilité"
          value={
            plan.breakEvenMonths === Infinity
              ? "—"
              : plan.breakEvenMonths
          }
          unit={
            plan.breakEvenMonths === Infinity ? "" : "mois pour ROI"
          }
        />
      </div>
    </section>
  );
}
