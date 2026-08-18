import type {
  LocationInfo,
  PlanApiResponse,
  PlotConfig,
  PublicVariety,
  RecommendedProduct,
} from "@/lib/types";

export async function locatePostalCode(
  postalCode: string
): Promise<LocationInfo | null> {
  const res = await fetch("/api/locate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postalCode }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchPlan(config: PlotConfig): Promise<PlanApiResponse | null> {
  const res = await fetch("/api/plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchVarieties(
  regionId: string,
  sun: string,
  postalCode?: string
): Promise<{
  all: PublicVariety[];
  recommended: PublicVariety[];
  regionLabel?: string;
}> {
  const params = new URLSearchParams({ regionId, sun });
  if (postalCode?.length === 5) params.set("postalCode", postalCode);
  const res = await fetch(`/api/varieties?${params}`);
  if (!res.ok) return { all: [], recommended: [] };
  return res.json();
}

export async function fetchProducts(
  config: PlotConfig
): Promise<RecommendedProduct[]> {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.products ?? [];
}
