import "server-only";
import type {
  CropVariety,
  LayoutAdvice,
  LayoutZone,
  PlacedPlant,
  SunExposure,
  VarietyLayoutInfo,
} from "../types";
import { getVariety } from "../data/crops";

const TILE_SIZE_M = 0.5;

export function computeGridDimensions(widthM: number, lengthM: number) {
  return {
    gridCols: Math.max(1, Math.round(widthM / TILE_SIZE_M)),
    gridRows: Math.max(1, Math.round(lengthM / TILE_SIZE_M)),
    tileSizeM: TILE_SIZE_M,
  };
}

function sunMultiplier(sun: SunExposure, hasGreenhouse = false): number {
  if (hasGreenhouse) return 1.0;
  const map: Record<SunExposure, number> = { S: 1.0, E: 0.85, O: 0.85, N: 0.6 };
  return map[sun];
}

function roundDim(m: number): number {
  return Math.round(m * 2) / 2;
}

function spacingCells(variety: CropVariety, tileSizeM: number) {
  return {
    cols: Math.max(1, Math.ceil(variety.spacingCm.plant / 100 / tileSizeM)),
    rows: Math.max(1, Math.ceil(variety.spacingCm.row / 100 / tileSizeM)),
  };
}

function minAreaForOnePlant(variety: CropVariety): number {
  return (variety.spacingCm.row / 100) * (variety.spacingCm.plant / 100);
}

function countPlantsInBounds(
  variety: CropVariety,
  colStart: number,
  colEnd: number,
  rowStart: number,
  rowEnd: number,
  tileSizeM: number
): number {
  const { cols: colsPerPlant, rows: rowsPerPlant } = spacingCells(variety, tileSizeM);
  let count = 0;

  for (let gy = rowStart; gy + rowsPerPlant <= rowEnd; gy += rowsPerPlant) {
    for (let gx = colStart; gx + colsPerPlant <= colEnd; gx += colsPerPlant) {
      count++;
    }
  }
  return count;
}

function placePlantsInBounds(
  variety: CropVariety,
  colStart: number,
  colEnd: number,
  rowStart: number,
  rowEnd: number,
  tileSizeM: number,
  occupied: Set<string>,
  plants: PlacedPlant[]
): number {
  const { cols: colsPerPlant, rows: rowsPerPlant } = spacingCells(variety, tileSizeM);
  let placed = 0;

  for (let gy = rowStart; gy + rowsPerPlant <= rowEnd; gy += rowsPerPlant) {
    for (let gx = colStart; gx + colsPerPlant <= colEnd; gx += colsPerPlant) {
      let fits = true;
      for (let dy = 0; dy < rowsPerPlant && fits; dy++) {
        for (let dx = 0; dx < colsPerPlant && fits; dx++) {
          const key = `${gx + dx},${gy + dy}`;
          if (occupied.has(key)) fits = false;
        }
      }
      if (!fits) continue;

      for (let dy = 0; dy < rowsPerPlant; dy++) {
        for (let dx = 0; dx < colsPerPlant; dx++) {
          occupied.add(`${gx + dx},${gy + dy}`);
        }
      }

      plants.push({
        varietyId: variety.id,
        x: gx + colsPerPlant / 2,
        y: gy + rowsPerPlant / 2,
      });
      placed++;
    }
  }
  return placed;
}

function layoutSingleVariety(
  variety: CropVariety,
  gridCols: number,
  gridRows: number,
  tileSizeM: number
): { plants: PlacedPlant[]; zones: LayoutZone[] } {
  const occupied = new Set<string>();
  const plants: PlacedPlant[] = [];
  placePlantsInBounds(variety, 0, gridCols, 0, gridRows, tileSizeM, occupied, plants);
  return {
    plants,
    zones: [
      {
        varietyId: variety.id,
        colStart: 0,
        colEnd: gridCols,
        rowStart: 0,
        rowEnd: gridRows,
      },
    ],
  };
}

function layoutMultiVariety(
  varieties: CropVariety[],
  gridCols: number,
  gridRows: number,
  widthM: number,
  lengthM: number,
  tileSizeM: number
): { plants: PlacedPlant[]; zones: LayoutZone[] } {
  const occupied = new Set<string>();
  const plants: PlacedPlant[] = [];
  const zones: LayoutZone[] = [];
  const n = varieties.length;
  const splitAlongLength = lengthM >= widthM;

  varieties.forEach((variety, i) => {
    let colStart = 0;
    let colEnd = gridCols;
    let rowStart = 0;
    let rowEnd = gridRows;

    if (splitAlongLength) {
      const rowsPerZone = Math.floor(gridRows / n);
      const extra = i === n - 1 ? gridRows - rowsPerZone * (n - 1) : rowsPerZone;
      rowStart = i * rowsPerZone;
      rowEnd = rowStart + (i === n - 1 ? extra : rowsPerZone);
    } else {
      const colsPerZone = Math.floor(gridCols / n);
      const extra = i === n - 1 ? gridCols - colsPerZone * (n - 1) : colsPerZone;
      colStart = i * colsPerZone;
      colEnd = colStart + (i === n - 1 ? extra : colsPerZone);
    }

    zones.push({ varietyId: variety.id, colStart, colEnd, rowStart, rowEnd });
    placePlantsInBounds(
      variety,
      colStart,
      colEnd,
      rowStart,
      rowEnd,
      tileSizeM,
      occupied,
      plants
    );
  });

  return { plants, zones };
}

function computeSuggestedDimensions(
  widthM: number,
  lengthM: number,
  requiredAreaM2: number
): { widthM: number; lengthM: number; areaM2: number } {
  const aspect = widthM / lengthM;
  const area = Math.max(widthM * lengthM, requiredAreaM2);
  const len = roundDim(Math.sqrt(area / aspect));
  const wid = roundDim(len * aspect);
  return {
    widthM: Math.max(1, wid),
    lengthM: Math.max(1, len),
    areaM2: wid * len,
  };
}

export function analyzeLayoutCapacity(
  widthM: number,
  lengthM: number,
  varietyIds: string[]
): Omit<LayoutAdvice, "message"> & { requiredAreaM2: number } {
  const { gridCols, gridRows, tileSizeM } = computeGridDimensions(widthM, lengthM);
  const varieties = varietyIds
    .map((id) => getVariety(id))
    .filter((v): v is CropVariety => v !== undefined);

  const n = varieties.length;
  const splitAlongLength = lengthM >= widthM;
  const varietyInfos: VarietyLayoutInfo[] = [];

  let requiredAreaM2 = 0;

  if (n === 0) {
    return {
      status: "ok",
      varieties: [],
      requiredAreaM2: 0,
    };
  }

  if (n === 1) {
    const v = varieties[0];
    const placed = countPlantsInBounds(v, 0, gridCols, 0, gridRows, tileSizeM);
    const minArea = minAreaForOnePlant(v);
    requiredAreaM2 = minArea;
    varietyInfos.push({
      varietyId: v.id,
      name: v.name,
      emoji: v.emoji,
      placed,
      maxPossible: placed,
      minAreaM2: minArea,
    });
    return {
      status: placed > 0 ? "ok" : "overflow",
      varieties: varietyInfos,
      requiredAreaM2,
    };
  }

  const minZoneAreas = varieties.map((v) => minAreaForOnePlant(v));
  requiredAreaM2 = minZoneAreas.reduce((s, a) => s + a, 0) * 1.15;

  varieties.forEach((variety, i) => {
    let colStart = 0;
    let colEnd = gridCols;
    let rowStart = 0;
    let rowEnd = gridRows;

    if (splitAlongLength) {
      const rowsPerZone = Math.floor(gridRows / n);
      const extra = i === n - 1 ? gridRows - rowsPerZone * (n - 1) : rowsPerZone;
      rowStart = i * rowsPerZone;
      rowEnd = rowStart + (i === n - 1 ? extra : rowsPerZone);
    } else {
      const colsPerZone = Math.floor(gridCols / n);
      const extra = i === n - 1 ? gridCols - colsPerZone * (n - 1) : colsPerZone;
      colStart = i * colsPerZone;
      colEnd = colStart + (i === n - 1 ? extra : colsPerZone);
    }

    const placed = countPlantsInBounds(
      variety,
      colStart,
      colEnd,
      rowStart,
      rowEnd,
      tileSizeM
    );
    const zoneAreaM2 =
      ((colEnd - colStart) * tileSizeM * (rowEnd - rowStart) * tileSizeM);

    varietyInfos.push({
      varietyId: variety.id,
      name: variety.name,
      emoji: variety.emoji,
      placed,
      maxPossible: placed,
      minAreaM2: minAreaForOnePlant(variety),
      zoneAreaM2: Math.round(zoneAreaM2 * 10) / 10,
    });
  });

  const missing = varietyInfos.filter((v) => v.placed === 0);
  const tight = varietyInfos.filter((v) => v.placed > 0 && v.placed < 2);
  const currentArea = widthM * lengthM;

  let status: LayoutAdvice["status"] = "ok";
  if (missing.length > 0 || currentArea < requiredAreaM2 * 0.95) {
    status = "overflow";
  } else if (tight.length > 0 || currentArea < requiredAreaM2 * 1.4) {
    status = "tight";
  }

  if (missing.length > 0) {
    requiredAreaM2 *= 1 + missing.length * 0.35;
  }

  return {
    status,
    varieties: varietyInfos,
    unplacedVarietyIds: missing.map((v) => v.varietyId),
    requiredAreaM2,
  };
}

function buildAdviceMessage(
  analysis: ReturnType<typeof analyzeLayoutCapacity>,
  widthM: number,
  lengthM: number,
  varietyCount: number
): LayoutAdvice {
  const suggested = computeSuggestedDimensions(
    widthM,
    lengthM,
    analysis.requiredAreaM2
  );

  let message: string;

  if (varietyCount <= 1) {
    message =
      analysis.status === "overflow"
        ? "Surface insuffisante pour cette culture. Agrandissez la parcelle."
        : "Parcelle adaptée à la culture sélectionnée.";
  } else if (analysis.status === "ok") {
    message = `${varietyCount} espèces réparties équitablement sur ${(widthM * lengthM).toFixed(1)} m² — chaque bande accueille ses plants.`;
  } else if (analysis.status === "tight") {
    message = `Les ${varietyCount} espèces tiennent, mais c'est juste. Élargir à ${suggested.widthM} × ${suggested.lengthM} m (${suggested.areaM2.toFixed(1)} m²) permettrait une meilleure répartition.`;
  } else {
    const unplaced = analysis.unplacedVarietyIds?.length ?? 0;
    if (unplaced > 0) {
      message = `${unplaced} espèce${unplaced > 1 ? "s n'ont" : " n'a"} pas la place ici. Agrandissez la parcelle, ou retirez des cultures.`;
    } else {
      message = `Surface trop petite pour ${varietyCount} espèces. Agrandissez ou faites un choix.`;
    }
  }

  return {
    status: analysis.status,
    message,
    varieties: analysis.varieties,
    unplacedVarietyIds: analysis.unplacedVarietyIds,
    suggestedWidthM: analysis.status !== "ok" ? suggested.widthM : undefined,
    suggestedLengthM: analysis.status !== "ok" ? suggested.lengthM : undefined,
    suggestedAreaM2: analysis.status !== "ok" ? suggested.areaM2 : undefined,
  };
}

export function layoutPlants(
  widthM: number,
  lengthM: number,
  varietyIds: string[],
  sun: SunExposure,
  hasGreenhouse = false
): {
  plants: PlacedPlant[];
  gridCols: number;
  gridRows: number;
  tileSizeM: number;
  zones: LayoutZone[];
  advice: LayoutAdvice;
} {
  const { gridCols, gridRows, tileSizeM } = computeGridDimensions(widthM, lengthM);
  const varieties = varietyIds
    .map((id) => getVariety(id))
    .filter((v): v is CropVariety => v !== undefined);

  if (varieties.length === 0) {
    return {
      plants: [],
      gridCols,
      gridRows,
      tileSizeM,
      zones: [],
      advice: buildAdviceMessage(
        { status: "ok", varieties: [], requiredAreaM2: 0 },
        widthM,
        lengthM,
        0
      ),
    };
  }

  const analysis = analyzeLayoutCapacity(widthM, lengthM, varietyIds);

  let result: { plants: PlacedPlant[]; zones: LayoutZone[] };
  if (varieties.length === 1) {
    result = layoutSingleVariety(varieties[0], gridCols, gridRows, tileSizeM);
  } else {
    result = layoutMultiVariety(
      varieties,
      gridCols,
      gridRows,
      widthM,
      lengthM,
      tileSizeM
    );
  }

  const placedByVariety = new Map<string, number>();
  for (const p of result.plants) {
    placedByVariety.set(p.varietyId, (placedByVariety.get(p.varietyId) ?? 0) + 1);
  }

  const updatedVarieties = analysis.varieties.map((v) => ({
    ...v,
    placed: placedByVariety.get(v.varietyId) ?? 0,
  }));

  const unplaced = updatedVarieties.filter((v) => v.placed === 0).map((v) => v.varietyId);
  let status = analysis.status;
  if (unplaced.length > 0) status = "overflow";
  else if (
    varieties.length > 1 &&
    updatedVarieties.some((v) => v.placed > 0 && v.placed < 2)
  ) {
    status = status === "overflow" ? "overflow" : "tight";
  }

  const advice = buildAdviceMessage(
    { ...analysis, status, varieties: updatedVarieties, unplacedVarietyIds: unplaced },
    widthM,
    lengthM,
    varieties.length
  );

  void sunMultiplier(sun, hasGreenhouse);
  return {
    ...result,
    gridCols,
    gridRows,
    tileSizeM,
    advice,
  };
}

export { sunMultiplier };
