import type { PlotConfig, PublicVariety } from "@/lib/types";
import {
  getCurrentMonth,
  getMonthLabel,
  type MonthIndex,
} from "@/lib/season-calendar";

export type SeasonAction = "semis" | "plantation" | "récolte";

const SEASON_MONTHS: Record<
  NonNullable<PublicVariety["season"]>,
  MonthIndex[]
> = {
  printemps: [3, 4, 5],
  ete: [6, 7, 8],
  automne: [9, 10, 11],
  hiver: [12, 1, 2],
  perenne: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
};

const SEASON_LABELS: Record<NonNullable<PublicVariety["season"]>, string> = {
  printemps: "printemps",
  ete: "été",
  automne: "automne",
  hiver: "hiver",
  perenne: "toute l'année",
};

export interface VarietySeasonSuggestion {
  variety: PublicVariety;
  action: SeasonAction;
  message: string;
  targetMonth?: MonthIndex;
}

export interface SeasonalTip {
  id: string;
  emoji: string;
  title: string;
  description: string;
  href?: string;
}

export interface SeasonalRecommendations {
  month: MonthIndex;
  monthLabel: string;
  plantNow: VarietySeasonSuggestion[];
  planLater: VarietySeasonSuggestion[];
  harvestNow: VarietySeasonSuggestion[];
  tips: SeasonalTip[];
}

function monthsUntil(from: MonthIndex, to: MonthIndex): number {
  if (to >= from) return to - from;
  return 12 - from + to;
}

function getPlantingMonths(
  variety: PublicVariety,
  hasGreenhouse: boolean
): MonthIndex[] {
  const season = variety.season ?? "perenne";
  const base = SEASON_MONTHS[season];

  if (season === "perenne") {
    return [3, 4, 9, 10];
  }

  const sowMonth = base[0]!;
  const plantMonths = base.slice(0, 2) as MonthIndex[];

  if (!hasGreenhouse) {
    return [sowMonth, ...plantMonths].filter(
      (m, i, arr) => arr.indexOf(m) === i
    );
  }

  const earlyMonth = (((sowMonth - 2 - 1 + 12) % 12) + 1) as MonthIndex;
  const months = variety.requiresGreenhouse
    ? [earlyMonth, sowMonth, ...plantMonths]
    : [(((sowMonth - 1 - 1 + 12) % 12) + 1) as MonthIndex, sowMonth, ...plantMonths];

  return months.filter((m, i, arr) => arr.indexOf(m) === i);
}

function getNextPlantingMonth(
  variety: PublicVariety,
  fromMonth: MonthIndex,
  hasGreenhouse: boolean
): MonthIndex | null {
  const plantingMonths = getPlantingMonths(variety, hasGreenhouse);
  let best: MonthIndex | null = null;
  let bestDist = Infinity;

  for (const month of plantingMonths) {
    const dist = monthsUntil(fromMonth, month);
    if (dist > 0 && dist < bestDist) {
      bestDist = dist;
      best = month;
    }
  }

  return best;
}

function getHarvestMonth(variety: PublicVariety): MonthIndex {
  const season = variety.season ?? "perenne";
  const months = SEASON_MONTHS[season];
  const first = months[0] ?? 3;
  return Math.min(12, first + 2) as MonthIndex;
}

function buildVarietyMessage(
  variety: PublicVariety,
  action: SeasonAction,
  hasGreenhouse: boolean
): string {
  const season = variety.season ?? "perenne";
  const seasonLabel = SEASON_LABELS[season];

  if (action === "récolte") {
    return "Récolte possible ce mois-ci.";
  }

  if (hasGreenhouse && variety.requiresGreenhouse) {
    return `Idéal en serre — ${action} avancé possible.`;
  }

  if (hasGreenhouse) {
    return `${
      action === "semis" ? "Semis" : "Plantation"
    } possible en serre, un peu plus tôt qu'en pleine terre.`;
  }

  return `Saison ${seasonLabel} — bon moment pour ${
    action === "semis" ? "semer" : "planter"
  }.`;
}

function buildLaterMessage(
  variety: PublicVariety,
  targetMonth: MonthIndex,
  hasGreenhouse: boolean
): string {
  const season = variety.season ?? "perenne";
  if (hasGreenhouse) {
    return `Pas encore le moment — en serre, prévoyez plutôt ${getMonthLabel(targetMonth).toLowerCase()}. Vous pouvez déjà l'ajouter à votre plan.`;
  }
  return `Hors saison (${SEASON_LABELS[season]}) — semis/plantation en ${getMonthLabel(targetMonth).toLowerCase()}. Ajoutez-la au plan pour préparer.`;
}

function getSeasonalTips(
  month: MonthIndex,
  config: PlotConfig
): SeasonalTip[] {
  const tips: SeasonalTip[] = [];
  const isSummer = month >= 6 && month <= 8;
  const isWinter = month === 12 || month <= 2;
  const isSpring = month >= 3 && month <= 5;
  const isAutumn = month >= 9 && month <= 11;

  if (config.hasGreenhouse) {
    tips.push({
      id: "serre-actif",
      emoji: "🏠",
      title: "Serre / tunnel actif",
      description:
        "Les variétés 🏠 et les cultures sensibles au froid peuvent être semées plus tôt. Surveillez la ventilation par temps chaud.",
    });
  }

  if (isSummer || (config.hasGreenhouse && month >= 5 && month <= 9)) {
    tips.push({
      id: "paillage",
      emoji: "🌾",
      title: "Paillage recommandé",
      description: config.hasGreenhouse
        ? "Paille ou BRF sous les plants en serre : limite l'évaporation et stabilise l'humidité du sol."
        : "Paillage paille ou BRF en été : moins d'arrosage, sol plus frais et moins de mauvaises herbes.",
      href: "/compte/materiel",
    });
  }

  if (config.hasGreenhouse && isSummer) {
    tips.push({
      id: "aeration-serre",
      emoji: "💨",
      title: "Aérer la serre",
      description:
        "Ouvrez portes et fenêtres aux heures les plus fraîches pour éviter la surchauffe (> 30 °C).",
    });
  }

  if (config.hasGreenhouse && isWinter) {
    tips.push({
      id: "protection-hiver",
      emoji: "❄️",
      title: "Protection hivernale",
      description:
        "Voile d'hivernage ou double bâche les nuits froides. Réduisez l'arrosage, le sol doit rester humide sans être détrempé.",
    });
  }

  if (isSpring) {
    tips.push({
      id: "prep-sol",
      emoji: "🪴",
      title: "Préparer le sol",
      description:
        "Apport de compost, désherbage et binage avant les plantations de printemps.",
      href: "/compost",
    });
  }

  if (isAutumn) {
    tips.push({
      id: "paillage-automne",
      emoji: "🍂",
      title: "Paillage d'automne",
      description:
        "Protégez les cultures pérennes et enrichissez le sol avec un paillage organique avant l'hiver.",
      href: "/compte/materiel",
    });
  }

  return tips;
}

export function buildSeasonalRecommendations(
  varieties: PublicVariety[],
  config: Pick<PlotConfig, "hasGreenhouse" | "selectedVarieties">
): SeasonalRecommendations {
  const month = getCurrentMonth();
  const selected = new Set(config.selectedVarieties);
  const plantNow: VarietySeasonSuggestion[] = [];
  const planLater: VarietySeasonSuggestion[] = [];
  const harvestNow: VarietySeasonSuggestion[] = [];
  const seen = new Set<string>();

  for (const variety of varieties) {
    if (selected.has(variety.id)) {
      const harvestMonth = getHarvestMonth(variety);
      if (harvestMonth === month) {
        harvestNow.push({
          variety,
          action: "récolte",
          message: buildVarietyMessage(variety, "récolte", config.hasGreenhouse),
        });
      }
      continue;
    }

    const plantingMonths = getPlantingMonths(variety, config.hasGreenhouse);
    const key = variety.id;

    if (plantingMonths.includes(month)) {
      if (seen.has(key)) continue;
      seen.add(key);
      const action: SeasonAction =
        month === plantingMonths[0] ? "semis" : "plantation";
      plantNow.push({
        variety,
        action,
        message: buildVarietyMessage(variety, action, config.hasGreenhouse),
      });
      continue;
    }

    const nextMonth = getNextPlantingMonth(
      variety,
      month,
      config.hasGreenhouse
    );
    if (nextMonth && monthsUntil(month, nextMonth) <= 4) {
      if (seen.has(key)) continue;
      seen.add(key);
      planLater.push({
        variety,
        action: "semis",
        targetMonth: nextMonth,
        message: buildLaterMessage(variety, nextMonth, config.hasGreenhouse),
      });
    }
  }

  plantNow.sort((a, b) => a.variety.name.localeCompare(b.variety.name));
  planLater.sort(
    (a, b) => (a.targetMonth ?? 0) - (b.targetMonth ?? 0)
  );

  return {
    month,
    monthLabel: getMonthLabel(month),
    plantNow: plantNow.slice(0, 8),
    planLater: planLater.slice(0, 6),
    harvestNow,
    tips: getSeasonalTips(month, config as PlotConfig),
  };
}
