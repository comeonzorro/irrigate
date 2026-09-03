"use client";

import { useEffect, useState } from "react";
import type { PublicVariety } from "@/lib/types";
import { fetchVarieties } from "@/lib/api/client";
import {
  buildSeasonCalendar,
  getCurrentMonth,
  getMonthLabel,
  getThisMonthTasks,
  type MonthIndex,
} from "@/lib/season-calendar";

interface SeasonCalendarViewProps {
  regionId?: string;
  postalCode?: string;
  hasGreenhouse?: boolean;
}

export function SeasonCalendarView({
  regionId = "france",
  postalCode = "",
  hasGreenhouse = false,
}: SeasonCalendarViewProps) {
  const [varieties, setVarieties] = useState<PublicVariety[]>([]);
  const [loading, setLoading] = useState(true);
  const currentMonth = getCurrentMonth();

  useEffect(() => {
    void fetchVarieties(regionId, "S", postalCode, hasGreenhouse).then((data) => {
      setVarieties(data.all);
      setLoading(false);
    });
  }, [regionId, postalCode, hasGreenhouse]);

  const thisMonth = getThisMonthTasks(varieties);
  const calendar = buildSeasonCalendar(varieties);

  if (loading) {
    return <p className="text-sm text-emerald-700">Chargement du calendrier…</p>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-emerald-300 bg-gradient-to-r from-emerald-700 to-teal-600 p-6 text-white">
        <h2 className="text-xl font-bold">
          Ce mois-ci — {getMonthLabel(currentMonth)}
        </h2>
        {thisMonth.length === 0 ? (
          <p className="mt-2 text-emerald-100">
            Entrez votre code postal dans le planificateur pour des suggestions
            régionales.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {thisMonth.map((task) => (
              <li
                key={`${task.variety.id}-${task.action}`}
                className="rounded-lg bg-white/15 px-3 py-2 text-sm"
              >
                <span className="font-medium capitalize">{task.action}</span> —{" "}
                {task.variety.emoji} {task.variety.name}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-emerald-950">
          Calendrier annuel
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as MonthIndex[]).map(
            (month) => {
              const tasks = calendar.get(month) ?? [];
              const isCurrent = month === currentMonth;
              return (
                <div
                  key={month}
                  className={`rounded-xl border p-4 ${
                    isCurrent
                      ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300"
                      : "border-emerald-100 bg-white"
                  }`}
                >
                  <h3 className="font-semibold text-emerald-900">
                    {getMonthLabel(month)}
                  </h3>
                  {tasks.length === 0 ? (
                    <p className="mt-2 text-xs text-emerald-600">—</p>
                  ) : (
                    <ul className="mt-2 space-y-1 text-xs text-emerald-800">
                      {tasks.slice(0, 5).map((t, i) => (
                        <li key={`${month}-${t.variety.id}-${t.action}-${i}`}>
                          {t.variety.emoji} {t.action}
                        </li>
                      ))}
                      {tasks.length > 5 ? (
                        <li className="text-emerald-600">+{tasks.length - 5}…</li>
                      ) : null}
                    </ul>
                  )}
                </div>
              );
            }
          )}
        </div>
      </section>
    </div>
  );
}
