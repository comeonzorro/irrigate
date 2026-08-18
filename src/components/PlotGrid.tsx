"use client";

import type { PlanResult } from "@/lib/types";
import { getVariety } from "@/lib/data/crops";

interface PlotGridProps {
  plan: PlanResult;
  widthM: number;
  lengthM: number;
}

export function PlotGrid({ plan, widthM, lengthM }: PlotGridProps) {
  const { gridCols, gridRows, plants, tileSizeM } = plan;

  const cellMap = new Map<string, { emoji: string; color: string }>();
  for (const plant of plants) {
    const variety = getVariety(plant.varietyId);
    if (!variety) continue;
    const gx = Math.floor(plant.x);
    const gy = Math.floor(plant.y);
    cellMap.set(`${gx},${gy}`, { emoji: variety.emoji, color: variety.color });
  }

  const cells: { key: string; emoji?: string; color?: string }[] = [];
  for (let y = 0; y < gridRows; y++) {
    for (let x = 0; x < gridCols; x++) {
      const key = `${x},${y}`;
      cells.push({ key, ...cellMap.get(key) });
    }
  }

  return (
    <section className="rounded-2xl border border-emerald-200/60 bg-white/80 p-5 shadow-sm backdrop-blur">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-emerald-900">
          🗺️ Plan du potager
        </h2>
        <span className="text-sm text-emerald-600">
          {widthM} × {lengthM} m · {plan.plantCount} plants
        </span>
      </div>

      <div className="overflow-x-auto">
        <div
          className="mx-auto inline-grid gap-0.5 rounded-xl border-2 border-amber-800/40 bg-amber-900/10 p-2"
          style={{
            gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
            maxWidth: "100%",
            width: Math.min(gridCols * 28, 560),
          }}
        >
          {cells.map((cell) => (
            <div
              key={cell.key}
              className="flex aspect-square items-center justify-center rounded-sm text-sm transition"
              style={{
                backgroundColor: cell.color
                  ? `${cell.color}33`
                  : "rgba(139, 90, 43, 0.15)",
                border: cell.color
                  ? `1px solid ${cell.color}66`
                  : "1px solid rgba(139, 90, 43, 0.2)",
                minWidth: 20,
                minHeight: 20,
              }}
              title={cell.emoji ? "Plant" : `Tuile ${tileSizeM}m`}
            >
              {cell.emoji ?? ""}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-xs text-emerald-700">
        {Array.from(
          new Set(plants.map((p) => p.varietyId))
        ).map((id) => {
          const v = getVariety(id);
          if (!v) return null;
          return (
            <span key={id} className="flex items-center gap-1">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: v.color }}
              />
              {v.emoji} {v.name}
            </span>
          );
        })}
      </div>
    </section>
  );
}
