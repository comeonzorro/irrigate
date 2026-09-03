import type { PlanResult, PlotConfig } from "@/lib/types";

export const PRESSURE_LOSS_AREA_THRESHOLD_M2 = 20;

export interface PressureLossAssessment {
  areaM2: number;
  pipeLengthM: number;
  dripperCount: number;
  estimatedLossBar: number;
  severity: "medium" | "high";
  message: string;
  recommendations: string[];
}

/** Estimation simplifiée de perte de charge pour grandes parcelles. */
export function assessPressureLoss(
  config: PlotConfig,
  plan: PlanResult
): PressureLossAssessment | null {
  const areaM2 = config.widthM * config.lengthM;
  if (areaM2 < PRESSURE_LOSS_AREA_THRESHOLD_M2) return null;

  const pipeLengthM = plan.irrigation.totalPipeLengthM;
  const dripperCount = plan.irrigation.dripperCount;
  if (pipeLengthM <= 0) return null;

  const estimatedLossBar =
    (pipeLengthM / 10) * 0.08 + dripperCount * 0.015 + areaM2 * 0.005;

  if (estimatedLossBar < 0.35) return null;

  const severity = estimatedLossBar >= 0.85 ? "high" : "medium";
  const recommendations = [
    "Privilégiez une conduite principale en 25 mm plutôt qu'en 16 mm.",
    "Divisez le réseau en zones avec vannes séparées (max. ~15 m de latérale par zone).",
    "Placez le point d'eau au centre de la parcelle pour réduire la longueur de tuyaux.",
  ];

  if (severity === "high") {
    recommendations.push(
      "Envisagez un régulateur de pression 1,5–2 bar en amont du réseau goutte-à-goutte."
    );
  }

  return {
    areaM2,
    pipeLengthM,
    dripperCount,
    estimatedLossBar: Math.round(estimatedLossBar * 100) / 100,
    severity,
    message:
      severity === "high"
        ? `Perte de pression estimée élevée (~${estimatedLossBar.toFixed(1)} bar) sur ${areaM2} m².`
        : `Perte de pression modérée (~${estimatedLossBar.toFixed(1)} bar) — vérifiez le diamètre des tuyaux.`,
    recommendations,
  };
}
