"use client";

import type { PlanResult, PlotConfig } from "@/lib/types";
import { assessPressureLoss } from "@/lib/pressure-loss";

interface PressureLossAlertProps {
  config: PlotConfig;
  plan: PlanResult;
}

export function PressureLossAlert({ config, plan }: PressureLossAlertProps) {
  const assessment = assessPressureLoss(config, plan);
  if (!assessment) return null;

  const isHigh = assessment.severity === "high";

  return (
    <div
      className={`rounded-xl border p-4 ${
        isHigh
          ? "border-amber-400 bg-amber-50 text-amber-950"
          : "border-sky-300 bg-sky-50 text-sky-950"
      }`}
      role="alert"
    >
      <p className="font-semibold">
        {isHigh ? "⚠️" : "💧"} Perte de pression — parcelle {assessment.areaM2} m²
      </p>
      <p className="mt-1 text-sm">{assessment.message}</p>
      <ul className="mt-3 list-inside list-disc space-y-1 text-sm">
        {assessment.recommendations.map((rec) => (
          <li key={rec}>{rec}</li>
        ))}
      </ul>
    </div>
  );
}
