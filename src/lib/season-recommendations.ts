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

export function getPlantingMonthsForVariety(
  variety: PublicVariety,
  hasGreenhouse: boolean
): MonthIndex[] {
  return getPlantingMonths(variety, hasGreenhouse);
}

export function isVarietyInSeasonNow(
  variety: PublicVariety,
  hasGreenhouse: boolean,
  month: MonthIndex = getCurrentMonth()
): boolean {
  return getPlantingMonths(variety, hasGreenhouse).includes(month);
}

export type EnvironmentSolutionType =
  | "greenhouse"
  | "cold_frame"
  | "row_cover"
  | "mulch"
  | "wait";

export interface EnvironmentSolution {
  type: EnvironmentSolutionType;
  emoji: string;
  title: string;
  description: string;
  action?: "enable_greenhouse";
}

export interface OffSeasonAdvice {
  variety: PublicVariety;
  nextPlantingMonth: MonthIndex | null;
  solutions: EnvironmentSolution[];
}

export interface TimelineMonth {
  month: MonthIndex;
  label: string;
  shortLabel: string;
  seasonKey: "printemps" | "ete" | "automne" | "hiver";
  isCurrent: boolean;
  varieties: PublicVariety[];
}

export interface SeasonTimeline {
  currentMonth: MonthIndex;
  currentMonthLabel: string;
  currentSeasonLabel: string;
  months: TimelineMonth[];
  currentVarieties: PublicVariety[];
}

const MONTH_SHORT = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Jun",
  "Jul",
  "Aoû",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
] as const;

function getSeasonKeyForMonth(month: MonthIndex): TimelineMonth["seasonKey"] {
  if (month >= 3 && month <= 5) return "printemps";
  if (month >= 6 && month <= 8) return "ete";
  if (month >= 9 && month <= 11) return "automne";
  return "hiver";
}

const CURRENT_SEASON_LABELS: Record<TimelineMonth["seasonKey"], string> = {
  printemps: "Printemps",
  ete: "Été",
  automne: "Automne",
  hiver: "Hiver",
};

function buildEnvironmentSolutions(
  variety: PublicVariety,
  hasGreenhouse: boolean,
  month: MonthIndex
): EnvironmentSolution[] {
  const season = variety.season ?? "perenne";
  const nextMonth = getNextPlantingMonth(variety, month, hasGreenhouse);
  const solutions: EnvironmentSolution[] = [];

  if (variety.requiresGreenhouse && !hasGreenhouse) {
    solutions.push({
      type: "greenhouse",
      emoji: "🏠",
      title: "Serre ou tunnel",
      description:
        "Cette variété est conçue pour un abri. Activez le mode serre pour ajuster le plan et débloquer les calculs adaptés.",
      action: "enable_greenhouse",
    });
  }

  if (!hasGreenhouse && (season === "ete" || season === "printemps")) {
    if (month >= 9 || month <= 2) {
      solutions.push({
        type: "greenhouse",
        emoji: "🏠",
        title: "Serre / tunnel",
        description:
          "Permet de avancer les semis de 4 à 8 semaines et de cultiver hors saison en climat frais.",
        action: "enable_greenhouse",
      });
      solutions.push({
        type: "cold_frame",
        emoji: "🪟",
        title: "Châssis ou mini-serre",
        description:
          "Alternative légère : protège des gelées et accélère le démarrage au printemps.",
      });
    }
  }

  if (season === "ete" && month >= 6 && month <= 8 && !hasGreenhouse) {
    solutions.push({
      type: "mulch",
      emoji: "🌾",
      title: "Paillage épais",
      description:
        "Si vous insistez sur cette culture en pleine terre, le paillage limite le stress hydrique et thermique.",
    });
  }

  if ((season === "hiver" || season === "automne") && month >= 3 && month <= 8) {
    solutions.push({
      type: "wait",
      emoji: "📅",
      title: "Attendre la bonne fenêtre",
      description: nextMonth
        ? `Semis/plantation conseillés en ${getMonthLabel(nextMonth).toLowerCase()}. Gardez-la dans le plan pour préparer.`
        : "Reportez la plantation à la prochaine saison favorable.",
    });
  }

  if (season === "ete" && (month === 12 || month <= 2)) {
    solutions.push({
      type: "row_cover",
      emoji: "🧣",
      title: "Voile d'hivernage",
      description:
        "Pour un essai très anticipé : voile P17 sous tunnel bas, avec chauffage du sol si possible.",
    });
  }

  if (hasGreenhouse && !isVarietyInSeasonNow(variety, true, month)) {
    solutions.push({
      type: "cold_frame",
      emoji: "🌡️",
      title: "Réguler la serre",
      description:
        "Même en serre, cette culture sort de sa fenêtre idéale : aérez, surveillez l'humidité et attendez-vous à une croissance plus lente.",
    });
  }

  if (nextMonth && !solutions.some((s) => s.type === "wait")) {
    solutions.push({
      type: "wait",
      emoji: "⏳",
      title: `Plutôt en ${getMonthLabel(nextMonth).toLowerCase()}`,
      description:
        "C'est la fenêtre naturelle pour cette espèce dans votre région.",
    });
  }

  const seen = new Set<EnvironmentSolutionType>();
  return solutions.filter((s) => {
    if (seen.has(s.type)) return false;
    seen.add(s.type);
    return true;
  });
}

export function assessOffSeasonSelections(
  varieties: PublicVariety[],
  selectedIds: string[],
  hasGreenhouse: boolean
): OffSeasonAdvice[] {
  const month = getCurrentMonth();
  const byId = new Map(varieties.map((v) => [v.id, v]));

  return selectedIds
    .map((id) => byId.get(id))
    .filter((v): v is PublicVariety => Boolean(v))
    .filter((v) => !isVarietyInSeasonNow(v, hasGreenhouse, month))
    .map((variety) => ({
      variety,
      nextPlantingMonth: getNextPlantingMonth(variety, month, hasGreenhouse),
      solutions: buildEnvironmentSolutions(variety, hasGreenhouse, month),
    }));
}

export function buildSeasonTimeline(
  varieties: PublicVariety[],
  hasGreenhouse: boolean
): SeasonTimeline {
  const currentMonth = getCurrentMonth();
  const months: TimelineMonth[] = [];

  for (let m = 1; m <= 12; m++) {
    const month = m as MonthIndex;
    const monthVarieties = varieties.filter((v) =>
      getPlantingMonths(v, hasGreenhouse).includes(month)
    );
    months.push({
      month,
      label: getMonthLabel(month),
      shortLabel: MONTH_SHORT[m - 1]!,
      seasonKey: getSeasonKeyForMonth(month),
      isCurrent: month === currentMonth,
      varieties: monthVarieties.slice(0, 6),
    });
  }

  const currentVarieties = varieties.filter((v) =>
    isVarietyInSeasonNow(v, hasGreenhouse, currentMonth)
  );

  const seasonKey = getSeasonKeyForMonth(currentMonth);

  return {
    currentMonth,
    currentMonthLabel: getMonthLabel(currentMonth),
    currentSeasonLabel: CURRENT_SEASON_LABELS[seasonKey],
    months,
    currentVarieties: currentVarieties.slice(0, 10),
  };
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
