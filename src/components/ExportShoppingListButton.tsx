"use client";

import type { RecommendedProduct } from "@/lib/types";
import { exportShoppingListPdf } from "@/lib/pdf/export-shopping-list";
import { loadOwnedEquipment } from "@/lib/equipment/storage";

interface ExportShoppingListButtonProps {
  projectName: string;
  products: RecommendedProduct[];
  regionName?: string;
  disabled?: boolean;
}

export function ExportShoppingListButton({
  projectName,
  products,
  regionName,
  disabled,
}: ExportShoppingListButtonProps) {
  if (products.length === 0) return null;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        const owned = loadOwnedEquipment();
        const ownedIds = new Set(
          Object.entries(owned)
            .filter(([, v]) => v)
            .map(([id]) => id)
        );
        exportShoppingListPdf({ projectName, products, ownedIds, regionName });
      }}
      className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:opacity-50"
    >
      📄 Exporter la liste d&apos;achats (PDF)
    </button>
  );
}
