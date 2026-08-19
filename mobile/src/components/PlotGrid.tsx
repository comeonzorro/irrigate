import { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Svg, { Circle, G, Line, Rect, Text as SvgText } from "react-native-svg";
import { usePlanner } from "../context/PlannerContext";
import { getIrrigationMode } from "../constants/irrigation";
import { Card } from "./ui/Card";
import { colors } from "../theme/colors";

const PIPE_STYLES: Record<
  string,
  { stroke: string; width: number; dash?: string; opacity?: number }
> = {
  main: { stroke: "#1d4ed8", width: 4, opacity: 1 },
  lateral: { stroke: "#2563eb", width: 3, opacity: 0.9 },
  dripper: { stroke: "#06b6d4", width: 1.5, dash: "2 2", opacity: 0.8 },
  hose_path: { stroke: "#64748b", width: 2, dash: "6 4", opacity: 0.7 },
};

const NODE_STYLES: Record<string, { fill: string; stroke: string }> = {
  source: { fill: "#1e40af", stroke: "#1e3a8a" },
  valve: { fill: "#f59e0b", stroke: "#d97706" },
  dripper: { fill: "#06b6d4", stroke: "#0891b2" },
  sprinkler: { fill: "#3b82f6", stroke: "#2563eb" },
};

export function PlotGrid() {
  const { config, plan, varietyDisplay } = usePlanner();
  const { width: screenW } = useWindowDimensions();
  const [showPlants, setShowPlants] = useState(true);
  const [showPipes, setShowPipes] = useState(true);
  const [showZones, setShowZones] = useState(true);

  const { gridCols, gridRows, plants, irrigation, zones, tileSizeM } = plan;
  const mode = getIrrigationMode(config.irrigationModeId);

  const cellSize = useMemo(() => {
    const maxW = screenW - 64;
    const fit = Math.floor(maxW / Math.max(gridCols, 1));
    return Math.min(32, Math.max(18, fit));
  }, [screenW, gridCols]);

  const svgW = gridCols * cellSize;
  const svgH = gridRows * cellSize;

  const cellMap = useMemo(() => {
    const map = new Map<
      string,
      { emoji: string; color: string; name: string }
    >();
    for (const plant of plants) {
      const variety = varietyDisplay[plant.varietyId];
      if (!variety) continue;
      const gx = Math.floor(plant.x);
      const gy = Math.floor(plant.y);
      map.set(`${gx},${gy}`, {
        emoji: variety.emoji,
        color: variety.color,
        name: variety.name,
      });
    }
    return map;
  }, [plants, varietyDisplay]);

  return (
    <Card
      title="🗺️ Plan du potager"
      subtitle={`${config.widthM} × ${config.lengthM} m · ${plan.plantCount} plants · ${mode?.name ?? ""}`}
    >
      <View style={styles.toggles}>
        <Toggle label="Cultures" value={showPlants} onChange={setShowPlants} />
        <Toggle label="Tuyaux" value={showPipes} onChange={setShowPipes} />
        {zones.length > 1 ? (
          <Toggle label="Bandes" value={showZones} onChange={setShowZones} />
        ) : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator>
        <Svg width={svgW + 16} height={svgH + 16}>
          <G x={8} y={8}>
            {showZones &&
              zones.length > 1 &&
              zones.map((zone) => {
                const variety = varietyDisplay[zone.varietyId];
                const x = zone.colStart * cellSize;
                const y = zone.rowStart * cellSize;
                const w = (zone.colEnd - zone.colStart) * cellSize;
                const h = (zone.rowEnd - zone.rowStart) * cellSize;
                return (
                  <G key={`zone-${zone.varietyId}`}>
                    <Rect
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      fill={variety ? `${variety.color}22` : "#00000008"}
                      stroke={variety?.color ?? "#888"}
                      strokeWidth={1.5}
                      strokeDasharray="6 3"
                      rx={4}
                    />
                    {variety ? (
                      <SvgText
                        x={x + 4}
                        y={y + 14}
                        fontSize={10}
                        fill={variety.color}
                        fontWeight="600"
                      >
                        {`${variety.emoji} ${variety.name.split(" «")[0].slice(0, 12)}`}
                      </SvgText>
                    ) : null}
                  </G>
                );
              })}

            {Array.from({ length: gridRows }).flatMap((_, y) =>
              Array.from({ length: gridCols }).map((__, x) => {
                const cell = cellMap.get(`${x},${y}`);
                return (
                  <G key={`${x}-${y}`}>
                    <Rect
                      x={x * cellSize}
                      y={y * cellSize}
                      width={cellSize - 2}
                      height={cellSize - 2}
                      rx={2}
                      fill={
                        showPlants && cell?.color
                          ? `${cell.color}33`
                          : "rgba(139, 90, 43, 0.15)"
                      }
                      stroke={
                        showPlants && cell?.color
                          ? `${cell.color}66`
                          : "rgba(139, 90, 43, 0.2)"
                      }
                    />
                    {showPlants && cell?.emoji ? (
                      <SvgText
                        x={x * cellSize + cellSize / 2}
                        y={y * cellSize + cellSize / 2 + 5}
                        fontSize={14}
                        textAnchor="middle"
                      >
                        {cell.emoji}
                      </SvgText>
                    ) : null}
                  </G>
                );
              })
            )}

            {showPipes
              ? irrigation.segments.map((s) => {
                  const style = PIPE_STYLES[s.kind] ?? PIPE_STYLES.lateral;
                  return (
                    <Line
                      key={s.id}
                      x1={s.x1 * cellSize + cellSize / 2}
                      y1={s.y1 * cellSize + cellSize / 2}
                      x2={s.x2 * cellSize + cellSize / 2}
                      y2={s.y2 * cellSize + cellSize / 2}
                      stroke={style.stroke}
                      strokeWidth={style.width}
                      strokeDasharray={
                        s.dashed || s.buried ? style.dash ?? "4 3" : undefined
                      }
                      strokeLinecap="round"
                      opacity={style.opacity}
                    />
                  );
                })
              : null}

            {showPipes
              ? irrigation.nodes.map((n) => {
                  const cx = n.x * cellSize + cellSize / 2;
                  const cy = n.y * cellSize + cellSize / 2;
                  if (n.kind === "sprinkler" && n.radius) {
                    return (
                      <G key={n.id}>
                        <Circle
                          cx={cx}
                          cy={cy}
                          r={n.radius * cellSize}
                          fill="rgba(59, 130, 246, 0.12)"
                          stroke="#3b82f6"
                          strokeWidth={1.5}
                          strokeDasharray="4 3"
                        />
                        <Circle
                          cx={cx}
                          cy={cy}
                          r={5}
                          fill={NODE_STYLES.sprinkler.fill}
                          stroke={NODE_STYLES.sprinkler.stroke}
                        />
                      </G>
                    );
                  }
                  const ns = NODE_STYLES[n.kind] ?? NODE_STYLES.dripper;
                  const r =
                    n.radius && n.kind !== "sprinkler"
                      ? n.radius * cellSize
                      : n.kind === "source"
                        ? 7
                        : 5;
                  return (
                    <Circle
                      key={n.id}
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill={ns.fill}
                      stroke={ns.stroke}
                      strokeWidth={1.5}
                    />
                  );
                })
              : null}
          </G>
        </Svg>
      </ScrollView>

      <View style={styles.meta}>
        <Text style={styles.metaText}>
          Tuile {tileSizeM} m · {irrigation.totalPipeLengthM} m de tuyaux
          {irrigation.dripperCount > 0
            ? ` · ${irrigation.dripperCount} goutteurs`
            : ""}
          {irrigation.buriedDepthCm
            ? ` · enterrés ${irrigation.buriedDepthCm} cm`
            : ""}
        </Text>
      </View>
    </Card>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#d1d5db", true: "#86efac" }}
        thumbColor={value ? colors.primary : "#f4f4f5"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  toggles: { marginBottom: 12, gap: 4 },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleLabel: { fontSize: 14, color: colors.text },
  meta: {
    marginTop: 12,
    backgroundColor: colors.sky,
    borderRadius: 8,
    padding: 10,
  },
  metaText: { fontSize: 12, color: "#0c4a6e" },
});
