import { API_BASE_URL } from "./config";
import type {
  LocationInfo,
  PlanApiResponse,
  PlotConfig,
  PublicVariety,
  RecommendedProduct,
} from "../types";

async function postJson<T>(path: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export async function locatePostalCode(
  postalCode: string
): Promise<LocationInfo | null> {
  return postJson<LocationInfo>("/api/locate", { postalCode });
}

export async function fetchPlan(
  config: PlotConfig
): Promise<PlanApiResponse | null> {
  return postJson<PlanApiResponse>("/api/plan", config);
}

export async function fetchVarieties(
  regionId: string,
  sun: string,
  postalCode?: string,
  hasGreenhouse?: boolean
): Promise<{
  all: PublicVariety[];
  recommended: PublicVariety[];
  regionLabel?: string;
}> {
  try {
    const params = new URLSearchParams({ regionId, sun });
    if (postalCode?.length === 5) params.set("postalCode", postalCode);
    if (hasGreenhouse) params.set("hasGreenhouse", "true");
    const res = await fetch(`${API_BASE_URL}/api/varieties?${params}`);
    if (!res.ok) return { all: [], recommended: [] };
    return res.json();
  } catch {
    return { all: [], recommended: [] };
  }
}

export async function fetchProducts(
  config: PlotConfig
): Promise<RecommendedProduct[]> {
  const data = await postJson<{ products?: RecommendedProduct[] }>(
    "/api/products",
    config
  );
  return data?.products ?? [];
}
