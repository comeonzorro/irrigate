"use client";

import { useEffect, useMemo, useState } from "react";
import type { RecommendedProduct } from "@/lib/types";
import { loadOwnedEquipment } from "@/lib/equipment/storage";
import { ExportShoppingListButton } from "@/components/ExportShoppingListButton";

const CATEGORY_LABELS: Record<RecommendedProduct["category"], string> = {
  irrigation: "💧 Irrigation",
  semence: "🌱 Semences & plants",
  engrais: "🧪 Engrais",
  outil: "🛠️ Outils",
};

interface ProductRecommendationsProps {
  products: RecommendedProduct[];
  loading?: boolean;
  regionName?: string;
  projectName?: string;
}

export function ProductRecommendations({
  products,
  loading,
  regionName,
  projectName = "Mon potager",
}: ProductRecommendationsProps) {
  const [owned, setOwned] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setOwned(loadOwnedEquipment());
  }, []);

  const visibleProducts = useMemo(
    () => products.filter((p) => !owned[p.id]),
    [products, owned]
  );

  const ownedInList = products.length - visibleProducts.length;

  return (
    <section
      aria-labelledby="products-heading"
      className="rounded-2xl border border-emerald-200/60 bg-white/80 p-5 shadow-sm backdrop-blur"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="products-heading" className="text-lg font-semibold text-emerald-900">
            🛒 Produits recommandés
          </h2>
          <p className="mt-1 text-sm text-emerald-700">
            {regionName
              ? `Suggestions adaptées à ${regionName}.`
              : "Entrez votre code postal pour des recommandations localisées."}
            {ownedInList > 0 ? (
              <span className="block text-emerald-600">
                {ownedInList} article{ownedInList > 1 ? "s" : ""} masqué
                {ownedInList > 1 ? "s" : ""} (déjà dans votre inventaire).
              </span>
            ) : null}
          </p>
        </div>
        <ExportShoppingListButton
          projectName={projectName}
          products={products}
          regionName={regionName}
          disabled={loading || products.length === 0}
        />
      </div>

      {loading && (
        <p className="text-sm text-emerald-600" role="status">
          Chargement des suggestions…
        </p>
      )}

      {!loading && visibleProducts.length === 0 && products.length > 0 && (
        <p className="rounded-lg bg-emerald-50 px-3 py-4 text-sm text-emerald-700">
          Vous possédez déjà tout le matériel recommandé pour ce projet.{" "}
          <a href="/compte/materiel" className="underline">
            Gérer mon inventaire
          </a>
        </p>
      )}

      {!loading && products.length === 0 && (
        <p className="rounded-lg bg-emerald-50 px-3 py-4 text-sm text-emerald-700">
          Sélectionnez des cultures et un mode d&apos;irrigation pour voir des
          produits adaptés.
        </p>
      )}

      <ul className="space-y-3">
        {visibleProducts.map((p) => (
          <li
            key={p.id}
            className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <span className="text-xs font-medium text-emerald-600">
                  {CATEGORY_LABELS[p.category]}
                </span>
                <h3 className="font-medium text-emerald-900">{p.name}</h3>
              </div>
              <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-sm font-semibold text-emerald-800">
                ~{p.priceEstimate} €
              </span>
            </div>
            <p className="mt-1 text-sm text-emerald-700">{p.description}</p>
            <p className="mt-2 text-xs text-emerald-600">
              <strong>Pourquoi :</strong> {p.reason}
            </p>
            <p className="mt-1 text-xs text-emerald-500">{p.shopHint}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
