"use client";

import { useCallback, useEffect, useState } from "react";
import { EQUIPMENT_CATALOG } from "@/lib/equipment/items";
import {
  loadOwnedEquipment,
  toggleEquipment,
  type OwnedEquipment,
} from "@/lib/equipment/storage";

const CATEGORY_LABELS = {
  irrigation: "💧 Irrigation",
  semence: "🌱 Semences",
  engrais: "🧪 Engrais & amendements",
  outil: "🛠️ Outils",
} as const;

export function EquipmentChecklist() {
  const [owned, setOwned] = useState<OwnedEquipment>({});

  useEffect(() => {
    setOwned(loadOwnedEquipment());
  }, []);

  const handleToggle = useCallback((id: string, checked: boolean) => {
    setOwned(toggleEquipment(id, checked));
  }, []);

  const grouped = EQUIPMENT_CATALOG.reduce(
    (acc, item) => {
      const list = acc[item.category] ?? [];
      list.push(item);
      acc[item.category] = list;
      return acc;
    },
    {} as Record<string, typeof EQUIPMENT_CATALOG>
  );

  const ownedCount = Object.values(owned).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <p className="text-sm text-emerald-700">
        Cochez le matériel que vous possédez déjà — les listes d&apos;achats
        n&apos;afficheront que le reste ({ownedCount}/{EQUIPMENT_CATALOG.length}{" "}
        cochés).
      </p>

      {(Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).map(
        (category) => {
          const items = grouped[category];
          if (!items?.length) return null;
          return (
            <section key={category}>
              <h3 className="mb-3 font-semibold text-emerald-900">
                {CATEGORY_LABELS[category]}
              </h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-3"
                  >
                    <input
                      type="checkbox"
                      id={`eq-${item.id}`}
                      checked={Boolean(owned[item.id])}
                      onChange={(e) => handleToggle(item.id, e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-emerald-300 text-emerald-700 focus:ring-emerald-500"
                    />
                    <label htmlFor={`eq-${item.id}`} className="min-w-0 flex-1 cursor-pointer">
                      <span className="font-medium text-emerald-900">{item.name}</span>
                      <span className="ml-2 text-sm text-emerald-600">
                        ~{item.priceEstimate} €
                      </span>
                      <p className="mt-0.5 text-sm text-emerald-700">{item.description}</p>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          );
        }
      )}
    </div>
  );
}
