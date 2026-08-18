import type { IrrigationModeId } from "@/lib/types";

export interface LegendItem {
  id: string;
  label: string;
  color: string;
  shape: "line" | "line-dashed" | "dot" | "ring" | "square";
  size?: "sm" | "md" | "lg";
}

export const SCENE_LEGEND_ITEMS: LegendItem[] = [
  { id: "main", label: "Conduite principale", color: "#1d4ed8", shape: "line", size: "lg" },
  { id: "lateral", label: "Latérale", color: "#2563eb", shape: "line", size: "md" },
  { id: "dripper", label: "Goutteur", color: "#06b6d4", shape: "dot" },
  { id: "source", label: "Robinet / point d'eau", color: "#1e40af", shape: "dot", size: "lg" },
  { id: "valve", label: "Vanne / Té", color: "#f59e0b", shape: "dot" },
  { id: "sprinkler", label: "Arroseur", color: "#3b82f6", shape: "ring" },
  { id: "hose", label: "Parcours manuel", color: "#64748b", shape: "line-dashed" },
  { id: "buried", label: "Tronçon enterré", color: "#1d4ed8", shape: "line-dashed" },
  { id: "plant", label: "Culture", color: "#27ae60", shape: "square" },
];

export function LegendSwatch({ item }: { item: LegendItem }) {
  const h = item.size === "lg" ? 4 : item.size === "md" ? 3 : 2;
  return (
    <span className="inline-flex w-6 shrink-0 items-center justify-center" aria-hidden="true">
      {item.shape === "line" && (
        <span
          className="block w-full rounded-full"
          style={{ height: h, backgroundColor: item.color }}
        />
      )}
      {item.shape === "line-dashed" && (
        <span
          className="block w-full rounded-full border-t-2 border-dashed"
          style={{ borderColor: item.color, height: 0 }}
        />
      )}
      {item.shape === "dot" && (
        <span
          className="block rounded-full"
          style={{
            backgroundColor: item.color,
            width: item.size === "lg" ? 12 : 8,
            height: item.size === "lg" ? 12 : 8,
          }}
        />
      )}
      {item.shape === "ring" && (
        <span
          className="block rounded-full border-2"
          style={{ borderColor: item.color, width: 12, height: 12 }}
        />
      )}
      {item.shape === "square" && (
        <span
          className="block rounded-sm"
          style={{ backgroundColor: `${item.color}66`, width: 10, height: 10 }}
        />
      )}
    </span>
  );
}

export function IrrigationSceneLegend({
  buriedDepthCm,
  compact,
  className = "",
}: {
  buriedDepthCm?: number;
  compact?: boolean;
  className?: string;
}) {
  const items = SCENE_LEGEND_ITEMS.filter(
    (i) => i.id !== "buried" || buriedDepthCm !== undefined
  );

  return (
    <aside
      className={`rounded-xl border border-emerald-200 bg-white/95 p-3 ${className}`}
      aria-label="Légende du réseau d'irrigation"
    >
      <h3 className={`font-semibold text-emerald-900 ${compact ? "text-xs" : "text-sm"}`}>
        Légende
      </h3>
      <ul className={`mt-2 space-y-1.5 ${compact ? "text-[11px]" : "text-xs"} text-emerald-800`}>
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            <LegendSwatch item={item} />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      {buriedDepthCm !== undefined && (
        <p className="mt-2 text-[10px] text-emerald-600">
          Enterré ~{buriedDepthCm} cm sous la surface
        </p>
      )}
    </aside>
  );
}

export interface SolutionVisual {
  modeId: IrrigationModeId;
  title: string;
}

export function SolutionDiagram({ modeId }: { modeId: IrrigationModeId }) {
  const w = 120;
  const h = 72;

  switch (modeId) {
    case "drip_buried":
      return (
        <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" aria-hidden="true">
          <rect x="0" y="28" width={w} height="44" fill="#8B6914" opacity="0.3" />
          <line x1="10" y1="50" x2="110" y2="50" stroke="#1d4ed8" strokeWidth="3" strokeDasharray="4 2" />
          <line x1="30" y1="50" x2="30" y2="35" stroke="#2563eb" strokeWidth="2" />
          <line x1="60" y1="50" x2="60" y2="35" stroke="#2563eb" strokeWidth="2" />
          <line x1="90" y1="50" x2="90" y2="35" stroke="#2563eb" strokeWidth="2" />
          <circle cx="30" cy="32" r="4" fill="#06b6d4" />
          <circle cx="60" cy="32" r="4" fill="#06b6d4" />
          <circle cx="90" cy="32" r="4" fill="#06b6d4" />
          <ellipse cx="30" cy="32" rx="6" ry="3" fill="#27ae60" opacity="0.6" />
          <ellipse cx="60" cy="32" rx="6" ry="3" fill="#27ae60" opacity="0.6" />
          <ellipse cx="90" cy="32" rx="6" ry="3" fill="#27ae60" opacity="0.6" />
          <text x="4" y="68" fontSize="8" fill="#64748b">15 cm prof.</text>
        </svg>
      );
    case "drip_surface":
      return (
        <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" aria-hidden="true">
          <rect x="0" y="40" width={w} height="32" fill="#8B6914" opacity="0.4" />
          <line x1="10" y1="48" x2="110" y2="48" stroke="#1d4ed8" strokeWidth="3" />
          <line x1="10" y1="48" x2="10" y2="58" stroke="#2563eb" strokeWidth="2" />
          <line x1="40" y1="48" x2="40" y2="58" stroke="#2563eb" strokeWidth="2" />
          <line x1="70" y1="48" x2="70" y2="58" stroke="#2563eb" strokeWidth="2" />
          <circle cx="10" cy="60" r="3" fill="#06b6d4" />
          <circle cx="40" cy="60" r="3" fill="#06b6d4" />
          <circle cx="70" cy="60" r="3" fill="#06b6d4" />
          <circle cx="105" cy="48" r="5" fill="#1e40af" />
        </svg>
      );
    case "sprinkler_auto":
      return (
        <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" aria-hidden="true">
          <rect x="0" y="45" width={w} height="27" fill="#8B6914" opacity="0.4" />
          <line x1="10" y1="55" x2="60" y2="55" stroke="#1d4ed8" strokeWidth="2" />
          <circle cx="60" cy="55" r="6" fill="#3b82f6" />
          <path d="M 60 55 L 45 30 L 75 30 Z" fill="#3b82f6" opacity="0.2" />
          <circle cx="60" cy="55" r="18" fill="none" stroke="#3b82f6" strokeDasharray="3 2" opacity="0.5" />
          <rect x="8" y="52" width="6" height="8" rx="1" fill="#64748b" />
        </svg>
      );
    case "hose_jet":
      return (
        <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" aria-hidden="true">
          <rect x="0" y="45" width={w} height="27" fill="#8B6914" opacity="0.4" />
          <path d="M 10 58 Q 40 40 55 50 T 100 45" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5 3" />
          <circle cx="10" cy="58" r="5" fill="#1e40af" />
          <circle cx="55" cy="50" r="4" fill="#06b6d4" />
          <circle cx="100" cy="45" r="4" fill="#06b6d4" />
          <path d="M 95 42 L 105 38 L 100 48 Z" fill="#94a3b8" />
        </svg>
      );
    case "watering_can":
      return (
        <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" aria-hidden="true">
          <rect x="0" y="45" width={w} height="27" fill="#8B6914" opacity="0.4" />
          <circle cx="15" cy="58" r="5" fill="#1e40af" />
          <path d="M 15 58 L 45 50 L 75 52 L 100 48" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" />
          <ellipse cx="45" cy="48" rx="5" ry="3" fill="#27ae60" opacity="0.5" />
          <ellipse cx="75" cy="50" rx="5" ry="3" fill="#27ae60" opacity="0.5" />
          <text x="88" y="42" fontSize="14" aria-hidden="true">🪣</text>
        </svg>
      );
    case "arduino_smart":
      return (
        <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" aria-hidden="true">
          <rect x="0" y="40" width={w} height="32" fill="#8B6914" opacity="0.4" />
          <rect x="12" y="46" width="20" height="14" rx="2" fill="#6366f1" />
          <text x="16" y="56" fontSize="7" fill="white">MCU</text>
          <line x1="32" y1="53" x2="50" y2="53" stroke="#f59e0b" strokeWidth="2" />
          <rect x="50" y="49" width="8" height="8" rx="4" fill="#06b6d4" />
          <line x1="58" y1="53" x2="90" y2="53" stroke="#2563eb" strokeWidth="2" />
          <circle cx="95" cy="53" r="4" fill="#06b6d4" />
        </svg>
      );
    default:
      return null;
  }
}
