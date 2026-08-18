"use client";

import type { PublicVariety, PlotConfig } from "@/lib/types";

interface CropSelectorProps {
  config: PlotConfig;
  varieties: PublicVariety[];
  recommended: PublicVariety[];
  loading?: boolean;
  onChange: (varieties: string[]) => void;
}

export function CropSelector({
  config,
  varieties,
  recommended,
  loading,
  onChange,
}: CropSelectorProps) {
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
        {config.postalCode.length === 5
          ? "Variétés adaptées à votre zone climatique. Plusieurs espèces ? Répartition automatique en bandes."
          : "Renseignez votre code postal pour filtrer les variétés régionales."}
      </p>

      {loading && (
        <p className="text-sm text-emerald-600" role="status">
          Chargement des variétés…
        </p>
      )}

      {!loading && recommended.length > 0 && (
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

      {!loading && varieties.length > 0 && (
        <>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600">
            Toutes les variétés disponibles
          </h3>
          <div className="flex flex-wrap gap-2">
            {varieties.map((v) => (
              <VarietyChip
                key={v.id}
                variety={v}
                selected={config.selectedVarieties.includes(v.id)}
                onToggle={() => toggle(v.id)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function VarietyChip({
  variety,
  selected,
  onToggle,
  highlight,
}: {
  variety: PublicVariety;
  selected: boolean;
  onToggle: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-full border px-3 py-1.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 ${
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
