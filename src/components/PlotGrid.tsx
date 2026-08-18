"use client";

import { useId, useState } from "react";
import type { PlanResult } from "@/lib/types";
import { getVariety } from "@/lib/data/crops";
import { getIrrigationMode } from "@/lib/data/irrigation";
import { IrrigationSceneLegend } from "@/components/IrrigationLegend";
import type { PlotConfig } from "@/lib/types";

interface PlotGridProps {
  plan: PlanResult;
  config: PlotConfig;
  widthM: number;
  lengthM: number;
}

const PIPE_STYLES: Record<
  string,
  { stroke: string; width: number; dash?: string; opacity?: number }
> = {
  main: { stroke: "#1d4ed8", width: 4, opacity: 1 },
  lateral: { stroke: "#2563eb", width: 3, opacity: 0.9 },
  dripper: { stroke: "#06b6d4", width: 1.5, dash: "2 2", opacity: 0.8 },
  hose_path: { stroke: "#64748b", width: 2, dash: "6 4", opacity: 0.7 },
};

const NODE_STYLES: Record<string, { fill: string; stroke: string }> = {
  source: { fill: "#1e40af", stroke: "#1e3a8a" },
  valve: { fill: "#f59e0b", stroke: "#d97706" },
  dripper: { fill: "#06b6d4", stroke: "#0891b2" },
  sprinkler: { fill: "#3b82f6", stroke: "#2563eb" },
};

export function PlotGrid({ plan, config, widthM, lengthM }: PlotGridProps) {
  const { gridCols, gridRows, plants, tileSizeM, irrigation, zones } = plan;
  const [showPlants, setShowPlants] = useState(true);
  const [showPipes, setShowPipes] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const gridLabelId = useId();
  const mode = getIrrigationMode(config.irrigationModeId);

  const cellMap = new Map<string, { emoji: string; color: string; name: string }>();
  for (const plant of plants) {
    const variety = getVariety(plant.varietyId);
    if (!variety) continue;
    const gx = Math.floor(plant.x);
    const gy = Math.floor(plant.y);
    cellMap.set(`${gx},${gy}`, {
      emoji: variety.emoji,
      color: variety.color,
      name: variety.name,
    });
  }

  const cellSize = 28;
  const svgW = gridCols * cellSize;
  const svgH = gridRows * cellSize;

  const cells: {
    key: string;
    x: number;
    y: number;
    emoji?: string;
    color?: string;
    name?: string;
  }[] = [];
  for (let y = 0; y < gridRows; y++) {
    for (let x = 0; x < gridCols; x++) {
      const key = `${x},${y}`;
      cells.push({ key, x, y, ...cellMap.get(key) });
    }
  }

  return (
    <section
      aria-labelledby="plan-heading"
      className="rounded-2xl border border-emerald-200/60 bg-white/80 p-5 shadow-sm backdrop-blur"
    >
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="plan-heading" className="text-lg font-semibold text-emerald-900">
          🗺️ Plan du potager
        </h2>
        <span className="text-sm text-emerald-600">
          {widthM} × {lengthM} m · {plan.plantCount} plants
        </span>
      </div>

      <div
        className="mb-3 flex flex-wrap gap-3"
        role="group"
        aria-label="Calques du plan"
      >
        <label className="flex cursor-pointer items-center gap-2 text-sm text-emerald-800">
          <input
            type="checkbox"
            checked={showPlants}
            onChange={(e) => setShowPlants(e.target.checked)}
            className="h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-400"
          />
          Cultures
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-emerald-800">
          <input
            type="checkbox"
            checked={showPipes}
            onChange={(e) => setShowPipes(e.target.checked)}
            className="h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-400"
          />
          Tuyaux & irrigation
        </label>
        {zones.length > 1 && (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-emerald-800">
            <input
              type="checkbox"
              checked={showZones}
              onChange={(e) => setShowZones(e.target.checked)}
              className="h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-400"
            />
            Bandes par espèce
          </label>
        )}
      </div>

      <div className="overflow-x-auto">
        <svg
          role="img"
          aria-labelledby={gridLabelId}
          width={svgW + 16}
          height={svgH + 16}
          className="mx-auto rounded-xl border-2 border-amber-800/40 bg-amber-900/10"
          viewBox={`0 0 ${svgW + 16} ${svgH + 16}`}
        >
          <title id={gridLabelId}>
            Plan du potager {widthM} par {lengthM} mètres avec{" "}
            {plan.plantCount} plants et réseau d&apos;irrigation {mode?.name}
          </title>

          <g transform="translate(8, 8)">
            {showZones &&
              zones.length > 1 &&
              zones.map((zone) => {
                const variety = getVariety(zone.varietyId);
                const x = zone.colStart * cellSize;
                const y = zone.rowStart * cellSize;
                const w = (zone.colEnd - zone.colStart) * cellSize;
                const h = (zone.rowEnd - zone.rowStart) * cellSize;
                return (
                  <g key={`zone-${zone.varietyId}`}>
                    <rect
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      fill={variety ? `${variety.color}18` : "rgba(0,0,0,0.04)"}
                      stroke={variety?.color ?? "#888"}
                      strokeWidth={1.5}
                      strokeDasharray="6 3"
                      rx={4}
                    />
                    {variety && (
                      <text
                        x={x + 4}
                        y={y + 14}
                        fontSize={10}
                        fill={variety.color}
                        fontWeight="600"
                      >
                        {variety.emoji}{" "}
                        {variety.name.split(" «")[0].slice(0, 14)}
                      </text>
                    )}
                  </g>
                );
              })}

            {cells.map((cell) => (
              <g key={cell.key}>
                <rect
                  x={cell.x * cellSize}
                  y={cell.y * cellSize}
                  width={cellSize - 2}
                  height={cellSize - 2}
                  rx={2}
                  fill={
                    showPlants && cell.color
                      ? `${cell.color}33`
                      : "rgba(139, 90, 43, 0.15)"
                  }
                  stroke={
                    showPlants && cell.color
                      ? `${cell.color}66`
                      : "rgba(139, 90, 43, 0.2)"
                  }
                  aria-label={
                    cell.name
                      ? `Plant : ${cell.name}`
                      : `Sol, tuile ${tileSizeM} m`
                  }
                />
                {showPlants && cell.emoji && (
                  <text
                    x={cell.x * cellSize + cellSize / 2}
                    y={cell.y * cellSize + cellSize / 2 + 5}
                    textAnchor="middle"
                    fontSize={14}
                    aria-hidden="true"
                  >
                    {cell.emoji}
                  </text>
                )}
              </g>
            ))}

            {showPipes && (
              <g aria-label="Réseau de tuyaux">
                {irrigation.segments.map((s) => {
                  const style = PIPE_STYLES[s.kind] ?? PIPE_STYLES.lateral;
                  return (
                    <line
                      key={s.id}
                      x1={s.x1 * cellSize + cellSize / 2}
                      y1={s.y1 * cellSize + cellSize / 2}
                      x2={s.x2 * cellSize + cellSize / 2}
                      y2={s.y2 * cellSize + cellSize / 2}
                      stroke={style.stroke}
                      strokeWidth={style.width}
                      strokeDasharray={
                        s.dashed || s.buried ? style.dash ?? "4 3" : undefined
                      }
                      strokeLinecap="round"
                      opacity={style.opacity}
                    />
                  );
                })}

                {irrigation.nodes.map((n) => {
                  if (n.kind === "sprinkler" && n.radius) {
                    return (
                      <g key={n.id}>
                        <circle
                          cx={n.x * cellSize + cellSize / 2}
                          cy={n.y * cellSize + cellSize / 2}
                          r={n.radius * cellSize}
                          fill="rgba(59, 130, 246, 0.12)"
                          stroke="#3b82f6"
                          strokeWidth={1.5}
                          strokeDasharray="4 3"
                        />
                        <circle
                          cx={n.x * cellSize + cellSize / 2}
                          cy={n.y * cellSize + cellSize / 2}
                          r={5}
                          fill={NODE_STYLES.sprinkler.fill}
                          stroke={NODE_STYLES.sprinkler.stroke}
                        />
                      </g>
                    );
                  }
                  const ns = NODE_STYLES[n.kind] ?? NODE_STYLES.dripper;
                  const r = n.radius ? n.radius * cellSize : n.kind === "source" ? 7 : 5;
                  return (
                    <circle
                      key={n.id}
                      cx={n.x * cellSize + cellSize / 2}
                      cy={n.y * cellSize + cellSize / 2}
                      r={r}
                      fill={ns.fill}
                      stroke={ns.stroke}
                      strokeWidth={1.5}
                    >
                      <title>{n.label ?? n.kind}</title>
                    </circle>
                  );
                })}
              </g>
            )}

            <text
              x={4}
              y={svgH - 4}
              fontSize={9}
              fill="#92400e"
              aria-hidden="true"
            >
              S
            </text>
            <text
              x={svgW - 8}
              y={12}
              fontSize={9}
              fill="#92400e"
              aria-hidden="true"
            >
              N
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg bg-sky-50 px-3 py-2 text-xs text-sky-900">
          <strong>Réseau :</strong> {irrigation.totalPipeLengthM} m de tuyaux
          {irrigation.dripperCount > 0 && (
            <> · {irrigation.dripperCount} goutteurs</>
          )}
          {irrigation.buriedDepthCm && (
            <> · enterrés à {irrigation.buriedDepthCm} cm</>
          )}
        </div>
        <IrrigationSceneLegend
          buriedDepthCm={irrigation.buriedDepthCm}
          compact
          className="border-0 bg-sky-50 p-2"
        />
      </div>

      {showPlants && (
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-emerald-700">
          {Array.from(new Set(plants.map((p) => p.varietyId))).map((id) => {
            const v = getVariety(id);
            if (!v) return null;
            return (
              <span key={id} className="flex items-center gap-1">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: v.color }}
                  aria-hidden="true"
                />
                {v.emoji} {v.name}
              </span>
            );
          })}
        </div>
      )}
    </section>
  );
}
