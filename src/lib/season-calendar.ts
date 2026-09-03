import type { PublicVariety } from "@/lib/types";

export type MonthIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

const MONTH_LABELS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
] as const;

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

export interface SeasonCalendarEntry {
  variety: PublicVariety;
  action: "semis" | "plantation" | "récolte";
  months: MonthIndex[];
}

export function getMonthLabel(month: MonthIndex): string {
  return MONTH_LABELS[month - 1];
}

export function getCurrentMonth(): MonthIndex {
  return (new Date().getMonth() + 1) as MonthIndex;
}

/** Calendrier mensuel : quoi faire selon les variétés disponibles. */
export function buildSeasonCalendar(
  varieties: PublicVariety[]
): Map<MonthIndex, SeasonCalendarEntry[]> {
  const byMonth = new Map<MonthIndex, SeasonCalendarEntry[]>();

  for (const variety of varieties) {
    const season = variety.season ?? "perenne";
    const months = SEASON_MONTHS[season] ?? SEASON_MONTHS.perenne;
    const harvestStart = Math.min(12, (months[0] ?? 3) + 2) as MonthIndex;

    const entries: SeasonCalendarEntry[] = [
      { variety, action: "semis", months: [months[0] ?? 3] },
      {
        variety,
        action: "plantation",
        months: months.slice(0, 2) as MonthIndex[],
      },
      { variety, action: "récolte", months: [harvestStart] },
    ];

    for (const entry of entries) {
      for (const month of entry.months) {
        const list = byMonth.get(month) ?? [];
        list.push(entry);
        byMonth.set(month, list);
      }
    }
  }

  return byMonth;
}

export function getThisMonthTasks(
  varieties: PublicVariety[]
): SeasonCalendarEntry[] {
  const current = getCurrentMonth();
  const calendar = buildSeasonCalendar(varieties);
  const tasks = calendar.get(current) ?? [];
  const seen = new Set<string>();
  return tasks.filter((t) => {
    const key = `${t.variety.id}-${t.action}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
