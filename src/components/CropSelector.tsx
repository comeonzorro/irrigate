"use client";

import type { PlotConfig } from "@/lib/types";
import {
  getRecommendedVarieties,
  getVarietiesForRegion,
  getVariety,
} from "@/lib/data/crops";

interface CropSelectorProps {
  config: PlotConfig;
  onChange: (varieties: string[]) => void;
}

export function CropSelector({ config, onChange }: CropSelectorProps) {
  const recommended = getRecommendedVarieties(
    config.regionId,
    config.sunExposure
  );
  const allForRegion = getVarietiesForRegion(config.regionId);

  const toggle = (id: string) => {
    const next = config.selectedVarieties.includes(id)
      ? config.selectedVarieties.filter((v) => v !== id)
      : [...config.selectedVarieties, id];
    onChange(next);
  };

  return (
    <section className="rounded-2xl border border-emerald-200/60 bg-white/80 p-5 shadow-sm backdrop-blur">
      <h2 className="mb-1 text-lg font-semibold text-emerald-900">
        🥕 Cultures & variétés
      </h2>
      <p className="mb-4 text-sm text-emerald-700">
        Adaptées à votre région et exposition. Les tomates sont recommandées en
        plein sud !
      </p>

      {recommended.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600">
            Recommandées pour vous
          </h3>
          <div className="flex flex-wrap gap-2">
            {recommended.map((v) => (
              <VarietyChip
                key={v.id}
                variety={v}
                selected={config.selectedVarieties.includes(v.id)}
                onToggle={() => toggle(v.id)}
                highlight
              />
            ))}
          </div>
        </div>
      )}

      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600">
        Toutes les variétés disponibles
      </h3>
      <div className="flex flex-wrap gap-2">
        {allForRegion.map((v) => (
          <VarietyChip
            key={v.id}
            variety={v}
            selected={config.selectedVarieties.includes(v.id)}
            onToggle={() => toggle(v.id)}
          />
        ))}
      </div>
    </section>
  );
}

function VarietyChip({
  variety,
  selected,
  onToggle,
  highlight,
}: {
  variety: ReturnType<typeof getVariety> & object;
  selected: boolean;
  onToggle: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        selected
          ? "border-emerald-700 bg-emerald-600 text-white shadow-md"
          : highlight
            ? "border-amber-300 bg-amber-50 hover:border-emerald-400"
            : "border-emerald-200 bg-white hover:border-emerald-400"
      }`}
      style={selected ? {} : { borderLeftColor: variety.color, borderLeftWidth: 3 }}
    >
      {variety.emoji} {variety.name}
    </button>
  );
}
