import "server-only";
import type { IrrigationModeId, PlotConfig } from "@/lib/types";
import { getRegion } from "@/lib/data/regions";

export interface RecommendedProduct {
  id: string;
  name: string;
  category: "irrigation" | "semence" | "engrais" | "outil";
  description: string;
  priceEstimate: number;
  reason: string;
  shopHint: string;
}

interface ProductDef extends RecommendedProduct {
  regionIds: string[];
  irrigationModeIds?: IrrigationModeId[];
  varietyIds?: string[];
}

const CATALOG: ProductDef[] = [
  {
    id: "kit-goutte-enterre-idf",
    name: "Kit goutte-à-goutte enterré 25 m",
    category: "irrigation",
    description: "Tuyau poreux + raccords + vanne — parcelle potager 15–30 m²",
    priceEstimate: 45,
    reason: "Adapté au réseau enterré en climat francilien",
    shopHint: "Jardinerie / brico",
    regionIds: ["ile-de-france", "france"],
    irrigationModeIds: ["drip_buried"],
  },
  {
    id: "kit-goutte-surface",
    name: "Kit goutte-à-goutte surface 20 m",
    category: "irrigation",
    description: "Goutteurs autorégulants + programmateur mécanique",
    priceEstimate: 32,
    reason: "Installation rapide, idéal première saison",
    shopHint: "Leroy Merlin, Jardiland…",
    regionIds: ["france", "ile-de-france", "auvergne-rhone-alpes", "nouvelle-aquitaine"],
    irrigationModeIds: ["drip_surface", "drip_buried"],
  },
  {
    id: "sem-tomate-cerise",
    name: "Graines tomate cerise bio",
    category: "semence",
    description: "Variété productive, bonne en zone tempérée",
    priceEstimate: 4,
    reason: "Recommandée pour votre région et exposition",
    shopHint: "Kokopelli, grainetiers locaux",
    regionIds: ["france", "ile-de-france", "auvergne-rhone-alpes", "nouvelle-aquitaine"],
    varietyIds: ["tomate-cerise-idf", "tomate-saint-pierre-ara", "tomate-rose-naq", "tomate-national"],
  },
  {
    id: "engrais-tomates",
    name: "Engrais organique tomates & légumes 5 kg",
    category: "engrais",
    description: "NPK 7-5-10 — apport printemps et mi-saison",
    priceEstimate: 13,
    reason: "Correspond au plan engrais de votre sol",
    shopHint: "Grandes surfaces jardin",
    regionIds: ["france", "ile-de-france", "auvergne-rhone-alpes", "nouvelle-aquitaine"],
  },
  {
    id: "aspersion-auto",
    name: "Kit aspersion programmé 3 arroseurs",
    category: "irrigation",
    description: "Électrovanne + programmateur + arroseurs escamotables",
    priceEstimate: 89,
    reason: "Pour grandes parcelles en climat océanique",
    shopHint: "Spécialiste arrosage",
    regionIds: ["nouvelle-aquitaine", "ile-de-france", "france"],
    irrigationModeIds: ["sprinkler_auto"],
  },
  {
    id: "arrosoir-6l",
    name: "Arrosoir gradué 6 L avec rose amovible",
    category: "outil",
    description: "Précision au pied des plants — mode manuel",
    priceEstimate: 18,
    reason: "Calibré pour le mode arrosoir de votre plan",
    shopHint: "Bricolage / jardin",
    regionIds: ["france", "ile-de-france", "auvergne-rhone-alpes", "nouvelle-aquitaine"],
    irrigationModeIds: ["watering_can"],
  },
  {
    id: "tuyau-renforce",
    name: "Tuyau d'arrosage renforcé 25 m + lance",
    category: "irrigation",
    description: "Arrosage manuel par zones",
    priceEstimate: 35,
    reason: "Pour le parcours jet d'eau calculé",
    shopHint: "Bricolage",
    regionIds: ["france", "ile-de-france", "auvergne-rhone-alpes", "nouvelle-aquitaine"],
    irrigationModeIds: ["hose_jet"],
  },
  {
    id: "compost-local",
    name: "Compost mûr local 40 L",
    category: "engrais",
    description: "Amendement universel sol argileux ou mixte",
    priceEstimate: 8,
    reason: "Base du plan fertilisation régional",
    shopHint: "Déchetterie compostée / jardinerie",
    regionIds: ["france", "ile-de-france", "auvergne-rhone-alpes", "nouvelle-aquitaine"],
  },
  {
    id: "fraisier-gariguette",
    name: "Plants fraisier Gariguette (x6)",
    category: "semence",
    description: "Variété référence Île-de-France",
    priceEstimate: 12,
    reason: "Adaptée au climat francilien",
    shopHint: "Pépinière locale",
    regionIds: ["ile-de-france"],
    varietyIds: ["fraisier-idf"],
  },
  {
    id: "melon-charentais-kit",
    name: "Plants melon Charentais (x3)",
    category: "semence",
    description: "Spécialité océanique — plein soleil indispensable",
    priceEstimate: 9,
    reason: "Variété phare de Nouvelle-Aquitaine",
    shopHint: "Grainetier / pépinière",
    regionIds: ["nouvelle-aquitaine"],
    varietyIds: ["melon-charentais-naq"],
  },
  {
    id: "poivron-ara-kit",
    name: "Plants poivron (x6)",
    category: "semence",
    description: "Californian Wonder — bon ensoleillement estival",
    priceEstimate: 8,
    reason: "Idéal en Auvergne-Rhône-Alpes",
    shopHint: "Jardinerie",
    regionIds: ["auvergne-rhone-alpes"],
    varietyIds: ["poivron-ara"],
  },
];

function regionMatches(productRegions: string[], regionId: string): boolean {
  if (productRegions.includes(regionId)) return true;
  if (regionId !== "france" && productRegions.includes("france")) return true;
  const hierarchy = [regionId];
  return productRegions.some((r) => hierarchy.includes(r));
}

export function getRecommendedProducts(config: PlotConfig): RecommendedProduct[] {
  const scored = CATALOG.filter((p) => regionMatches(p.regionIds, config.regionId))
    .map((p) => {
      let score = 1;
      if (
        p.irrigationModeIds?.includes(config.irrigationModeId)
      ) {
        score += 3;
      }
      if (
        p.varietyIds?.some((id) => config.selectedVarieties.includes(id))
      ) {
        score += 2;
      }
      if (p.category === "engrais") score += 1;
      return { product: p, score };
    })
    .sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  const result: RecommendedProduct[] = [];

  for (const { product } of scored) {
    if (seen.has(product.id)) continue;
    seen.add(product.id);
    const { regionIds: _r, irrigationModeIds: _i, varietyIds: _v, ...pub } =
      product;
    void _r;
    void _i;
    void _v;
    result.push(pub);
    if (result.length >= 6) break;
  }

  return result;
}
