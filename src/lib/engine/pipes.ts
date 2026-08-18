import "server-only";
import type {
  IrrigationLayout,
  IrrigationModeId,
  PipeNode,
  PipeSegment,
  PlacedPlant,
} from "../types";

function seg(
  id: string,
  kind: PipeSegment["kind"],
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  opts?: { buried?: boolean; dashed?: boolean }
): PipeSegment {
  return { id, kind, x1, y1, x2, y2, ...opts };
}

function node(
  id: string,
  kind: PipeNode["kind"],
  x: number,
  y: number,
  opts?: { label?: string; radius?: number }
): PipeNode {
  return { id, kind, x, y, ...opts };
}

function segmentLength(
  s: PipeSegment,
  tileSizeM: number
): number {
  const dx = (s.x2 - s.x1) * tileSizeM;
  const dy = (s.y2 - s.y1) * tileSizeM;
  return Math.sqrt(dx * dx + dy * dy);
}

function groupPlantsByRow(
  plants: PlacedPlant[],
  tileSizeM: number
): Map<number, PlacedPlant[]> {
  const rows = new Map<number, PlacedPlant[]>();
  for (const p of plants) {
    const rowKey = Math.round(p.y * 2) / 2;
    const list = rows.get(rowKey) ?? [];
    list.push(p);
    rows.set(rowKey, list);
  }
  void tileSizeM;
  return rows;
}

function layoutDrip(
  plants: PlacedPlant[],
  gridCols: number,
  gridRows: number,
  buried: boolean
): { segments: PipeSegment[]; nodes: PipeNode[] } {
  const segments: PipeSegment[] = [];
  const nodes: PipeNode[] = [];
  const mainX = 0.25;

  nodes.push(
    node("source", "source", mainX, gridRows - 0.25, {
      label: "Robinet",
    })
  );
  nodes.push(node("valve-main", "valve", mainX, gridRows - 0.75, { label: "Vanne" }));

  segments.push(
    seg("main-vertical", "main", mainX, gridRows - 0.75, mainX, 0.25, { buried })
  );

  const rows = groupPlantsByRow(plants, 0.5);
  const sortedRows = Array.from(rows.keys()).sort((a, b) => b - a);

  sortedRows.forEach((rowY, i) => {
    const rowPlants = rows.get(rowY)!;
    const lateralY = rowY;
    segments.push(
      seg(`lateral-${i}`, "lateral", mainX, lateralY, gridCols - 0.25, lateralY, {
        buried,
      })
    );
    nodes.push(
      node(`tee-${i}`, "valve", mainX, lateralY, { label: "Té" })
    );

    for (const [j, plant] of rowPlants.entries()) {
      nodes.push(
        node(`dripper-${i}-${j}`, "dripper", plant.x, plant.y, {
          label: "Goutteur",
          radius: 0.12,
        })
      );
      if (Math.abs(plant.y - lateralY) > 0.15) {
        segments.push(
          seg(`stub-${i}-${j}`, "dripper", plant.x, lateralY, plant.x, plant.y, {
            buried,
            dashed: !buried,
          })
        );
      }
    }
  });

  return { segments, nodes };
}

function layoutSprinkler(
  gridCols: number,
  gridRows: number
): { segments: PipeSegment[]; nodes: PipeNode[] } {
  const segments: PipeSegment[] = [];
  const nodes: PipeNode[] = [];
  const cx = gridCols / 2;
  const cy = gridRows / 2;
  const area = gridCols * gridRows;

  nodes.push(node("source", "source", 0.25, gridRows - 0.25, { label: "Robinet" }));
  segments.push(
    seg("main-to-center", "main", 0.25, gridRows - 0.25, 0.25, cy, {})
  );
  segments.push(seg("main-horizontal", "main", 0.25, cy, cx, cy, {}));

  const count = area > 48 ? 4 : area > 20 ? 2 : 1;
  const positions =
    count === 1
      ? [{ x: cx, y: cy }]
      : count === 2
        ? [
            { x: gridCols * 0.33, y: cy },
            { x: gridCols * 0.67, y: cy },
          ]
        : [
            { x: gridCols * 0.33, y: gridRows * 0.33 },
            { x: gridCols * 0.67, y: gridRows * 0.33 },
            { x: gridCols * 0.33, y: gridRows * 0.67 },
            { x: gridCols * 0.67, y: gridRows * 0.67 },
          ];

  positions.forEach((pos, i) => {
    if (i > 0 || count > 1) {
      segments.push(
        seg(`branch-${i}`, "lateral", cx, cy, pos.x, pos.y, {})
      );
    }
    nodes.push(
      node(`sprinkler-${i}`, "sprinkler", pos.x, pos.y, {
        label: "Arroseur",
        radius: Math.min(gridCols, gridRows) * 0.22,
      })
    );
  });

  return { segments, nodes };
}

function layoutHosePath(
  plants: PlacedPlant[],
  gridCols: number,
  gridRows: number
): { segments: PipeSegment[]; nodes: PipeNode[] } {
  const segments: PipeSegment[] = [];
  const nodes: PipeNode[] = [];

  nodes.push(
    node("source", "source", 0.25, gridRows - 0.25, { label: "Robinet + tuyau" })
  );

  const sorted = [...plants].sort((a, b) => b.y - a.y || a.x - b.x);
  let px = 0.25;
  let py = gridRows - 0.25;

  sorted.forEach((plant, i) => {
    segments.push(
      seg(`hose-${i}`, "hose_path", px, py, plant.x, plant.y, { dashed: true })
    );
    nodes.push(
      node(`target-${i}`, "dripper", plant.x, plant.y, {
        label: "Arrosage manuel",
        radius: 0.15,
      })
    );
    px = plant.x;
    py = plant.y;
  });

  if (sorted.length > 0) {
    segments.push(
      seg("hose-return", "hose_path", px, py, 0.25, gridRows - 0.25, {
        dashed: true,
      })
    );
  }

  void gridCols;
  return { segments, nodes };
}

function layoutWateringCan(
  plants: PlacedPlant[],
  gridCols: number,
  gridRows: number
): { segments: PipeSegment[]; nodes: PipeNode[] } {
  const nodes: PipeNode[] = [
    node("source", "source", 0.5, gridRows - 0.5, { label: "Point d'eau" }),
  ];
  const segments: PipeSegment[] = [];

  plants.forEach((plant, i) => {
    segments.push(
      seg(`walk-${i}`, "hose_path", 0.5, gridRows - 0.5, plant.x, plant.y, {
        dashed: true,
      })
    );
    nodes.push(
      node(`can-${i}`, "dripper", plant.x, plant.y, {
        label: "Arrosoir 6 L",
        radius: 0.14,
      })
    );
  });

  void gridCols;
  void gridRows;
  return { segments, nodes };
}

export function layoutIrrigationPipes(
  plants: PlacedPlant[],
  gridCols: number,
  gridRows: number,
  tileSizeM: number,
  modeId: IrrigationModeId
): IrrigationLayout {
  let layout: { segments: PipeSegment[]; nodes: PipeNode[] };

  switch (modeId) {
    case "drip_buried":
      layout = layoutDrip(plants, gridCols, gridRows, true);
      break;
    case "drip_surface":
      layout = layoutDrip(plants, gridCols, gridRows, false);
      break;
    case "sprinkler_auto":
      layout = layoutSprinkler(gridCols, gridRows);
      break;
    case "hose_jet":
      layout = layoutHosePath(plants, gridCols, gridRows);
      break;
    case "watering_can":
      layout = layoutWateringCan(plants, gridCols, gridRows);
      break;
    case "arduino_smart":
      layout = layoutDrip(plants, gridCols, gridRows, false);
      layout.nodes.push(
        node("arduino", "valve", 0.25, gridRows - 1.25, {
          label: "Capteur + Arduino",
        })
      );
      break;
    default:
      layout = { segments: [], nodes: [] };
  }

  const totalPipeLengthM =
    Math.round(
      layout.segments.reduce((sum, s) => sum + segmentLength(s, tileSizeM), 0) * 10
    ) / 10;
  const dripperCount = layout.nodes.filter((n) => n.kind === "dripper").length;

  return {
    segments: layout.segments,
    nodes: layout.nodes,
    totalPipeLengthM,
    dripperCount,
    buriedDepthCm: modeId === "drip_buried" ? 15 : undefined,
  };
}
