import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { Canvas } from "@react-three/fiber/native";
import { PerspectiveCamera } from "@react-three/drei/native";
import { usePlanner } from "../context/PlannerContext";
import { getIrrigationMode } from "../constants/irrigation";
import { colors } from "../theme/colors";
import type { PipeNode, PlanResult, VarietyDisplay } from "../types";
import {
  NativeCameraGestureView,
  NativeCameraRig,
  useCameraControlState,
} from "./plot3d/NativeCameraControls";

const PIPE_COLORS: Record<string, string> = {
  main: "#1d4ed8",
  lateral: "#2563eb",
  dripper: "#06b6d4",
  hose_path: "#64748b",
};

export function PlotView3D() {
  const { config, plan, varietyDisplay } = usePlanner();
  const { widthM, lengthM } = config;
  const { height } = useWindowDimensions();
  const mode = getIrrigationMode(config.irrigationModeId);
  const canvasHeight = Math.min(height * 0.55, 480);
  const controlRef = useCameraControlState(widthM, lengthM);
  const target = [widthM / 2, 0, lengthM / 2] as [number, number, number];
  const minDistance = Math.max(3, Math.max(widthM, lengthM) * 0.6);
  const maxDistance = Math.max(25, Math.max(widthM, lengthM) * 4);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>🏗️ Vue 3D — installation</Text>
      <Text style={styles.subtitle}>
        {mode?.name} · {plan.irrigation.totalPipeLengthM} m de tuyaux
      </Text>
      <Text style={styles.hint}>
        1 doigt : rotation · 2 doigts : zoom & déplacement
      </Text>

      <View style={[styles.canvas, { height: canvasHeight }]}>
        <NativeCameraGestureView
          controlRef={controlRef}
          minDistance={minDistance}
          maxDistance={maxDistance}
          style={styles.gestureFill}
        >
          <Canvas>
            <NativeCameraRig
              controlRef={controlRef}
              target={target}
              minDistance={minDistance}
              maxDistance={maxDistance}
            />
            <Scene
              plan={plan}
              varietyDisplay={varietyDisplay}
              widthM={widthM}
              lengthM={lengthM}
            />
          </Canvas>
        </NativeCameraGestureView>
      </View>

      <Text style={styles.footer}>
        Profondeur enterrée : {plan.irrigation.buriedDepthCm ?? "surface"} cm
      </Text>
    </View>
  );
}

function Scene({
  plan,
  varietyDisplay,
  widthM,
  lengthM,
}: {
  plan: PlanResult;
  varietyDisplay: Record<string, VarietyDisplay>;
  widthM: number;
  lengthM: number;
}) {
  const { plants, irrigation } = plan;

  return (
    <>
      <PerspectiveCamera makeDefault position={[widthM * 1.2, widthM, lengthM * 1.4]} fov={45} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 5]} intensity={1.2} />

      <Ground width={widthM} length={lengthM} />

      {plants.map((plant, i) => {
        const variety = varietyDisplay[plant.varietyId];
        if (!variety) return null;
        const px = (plant.x / plan.gridCols) * widthM;
        const pz = (plant.y / plan.gridRows) * lengthM;
        return (
          <PlantMesh key={`plant-${i}`} x={px} z={pz} color={variety.color} />
        );
      })}

      {irrigation.segments.map((seg) => {
        const x1 = (seg.x1 / plan.gridCols) * widthM;
        const z1 = (seg.y1 / plan.gridRows) * lengthM;
        const x2 = (seg.x2 / plan.gridCols) * widthM;
        const z2 = (seg.y2 / plan.gridRows) * lengthM;
        const y =
          seg.buried && irrigation.buriedDepthCm
            ? -(irrigation.buriedDepthCm / 100) / 2
            : 0.02;
        const depth =
          seg.buried && irrigation.buriedDepthCm
            ? irrigation.buriedDepthCm / 100
            : 0.04;
        const radius =
          seg.kind === "main" ? 0.04 : seg.kind === "lateral" ? 0.025 : 0.015;
        return (
          <PipeSegmentMesh
            key={seg.id}
            x1={x1}
            y1={y}
            z1={z1}
            x2={x2}
            y2={y}
            z2={z2}
            radius={radius}
            depth={depth}
            color={PIPE_COLORS[seg.kind] ?? "#2563eb"}
            buried={!!seg.buried}
          />
        );
      })}

      {irrigation.nodes.map((n) => {
        const px = (n.x / plan.gridCols) * widthM;
        const pz = (n.y / plan.gridRows) * lengthM;
        if (n.kind === "sprinkler" && n.radius) {
          const r = (n.radius / plan.gridCols) * widthM;
          return <SprinklerMesh key={n.id} x={px} z={pz} radius={r} />;
        }
        const y =
          n.kind === "source" ? 0.15 : n.kind === "valve" ? 0.12 : 0.08;
        const color =
          n.kind === "source"
            ? "#1e40af"
            : n.kind === "valve"
              ? "#f59e0b"
              : "#06b6d4";
        return (
          <NodeMesh
            key={n.id}
            x={px}
            y={y}
            z={pz}
            color={color}
            size={n.kind === "source" ? 0.12 : 0.06}
          />
        );
      })}
    </>
  );
}

function Ground({ width, length }: { width: number; length: number }) {
  const gridSize = Math.max(width, length);
  const divisions = Math.min(20, Math.max(4, Math.round(gridSize)));

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[width / 2, 0, length / 2]}
      >
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#8B6914" roughness={0.9} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[width / 2, -0.001, length / 2]}
      >
        <planeGeometry args={[width + 0.4, length + 0.4]} />
        <meshStandardMaterial color="#6B8E23" transparent opacity={0.35} />
      </mesh>
      <gridHelper
        args={[gridSize, divisions, "#5c4a1a", "#5c4a1a"]}
        position={[width / 2, 0.01, length / 2]}
      />
    </group>
  );
}

function PlantMesh({ x, z, color }: { x: number; z: number; color: string }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.3, 8]} />
        <meshStandardMaterial color="#4a6741" />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function PipeSegmentMesh({
  x1,
  y1,
  z1,
  x2,
  y2,
  z2,
  radius,
  depth,
  color,
  buried,
}: {
  x1: number;
  y1: number;
  z1: number;
  x2: number;
  y2: number;
  z2: number;
  radius: number;
  depth: number;
  color: string;
  buried: boolean;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dz = z2 - z1;
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (length < 0.001) return null;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const mz = (z1 + z2) / 2;
  const rotY = Math.atan2(dx, dz);
  const rotX = Math.asin(Math.max(-1, Math.min(1, dy / length)));
  return (
    <mesh position={[mx, my, mz]} rotation={[rotX, rotY, 0]}>
      <boxGeometry args={[radius * 2, depth, length]} />
      <meshStandardMaterial
        color={color}
        transparent={buried}
        opacity={buried ? 0.75 : 1}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
}

function NodeMesh({
  x,
  y,
  z,
  color,
  size,
}: {
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
}) {
  return (
    <mesh position={[x, y, z]}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshStandardMaterial color={color} metalness={0.4} />
    </mesh>
  );
}

function SprinklerMesh({
  x,
  z,
  radius,
}: {
  x: number;
  z: number;
  radius: number;
}) {
  if (radius <= 0) return null;
  const inner = Math.max(0.01, radius * 0.8);
  return (
    <group position={[x, 0.05, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[inner, radius, 32]} />
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.35}
          side={2}
        />
      </mesh>
      <NodeMesh x={0} y={0.08} z={0} color="#3b82f6" size={0.07} />
    </group>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16, paddingBottom: 8 },
  title: { fontSize: 18, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  hint: { fontSize: 12, color: colors.textMuted, marginTop: 8, marginBottom: 12 },
  canvas: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#dbeafe",
  },
  gestureFill: { flex: 1 },
  footer: { fontSize: 12, color: colors.textMuted, marginTop: 10 },
});
