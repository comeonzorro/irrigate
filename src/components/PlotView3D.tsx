"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, PerspectiveCamera } from "@react-three/drei";
import type { PlanResult, PlotConfig } from "@/lib/types";
import { getVariety } from "@/lib/data/crops";
import { getIrrigationMode } from "@/lib/data/irrigation";

interface PlotView3DProps {
  plan: PlanResult;
  config: PlotConfig;
  widthM: number;
  lengthM: number;
}

const PIPE_COLORS: Record<string, string> = {
  main: "#1d4ed8",
  lateral: "#2563eb",
  dripper: "#06b6d4",
  hose_path: "#64748b",
};

export function PlotView3D({ plan, config, widthM, lengthM }: PlotView3DProps) {
  const mode = getIrrigationMode(config.irrigationModeId);
  const { plants, irrigation } = plan;

  return (
    <section
      aria-labelledby="view3d-heading"
      className="rounded-2xl border border-emerald-200/60 bg-white/80 p-5 shadow-sm backdrop-blur"
    >
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="view3d-heading" className="text-lg font-semibold text-emerald-900">
          🏗️ Vue 3D — installation
        </h2>
        <span className="text-sm text-emerald-600">
          {mode?.name} · {irrigation.totalPipeLengthM} m de tuyaux
        </span>
      </div>

      <p className="mb-3 text-sm text-emerald-700">
        Faites pivoter la vue pour visualiser la profondeur des tuyaux enterrés
        et la disposition des goutteurs. Molette = zoom, clic = rotation.
      </p>

      <div
        className="relative h-[420px] w-full overflow-hidden rounded-xl border border-emerald-200 bg-gradient-to-b from-sky-100 to-emerald-50"
        role="img"
        aria-label={`Vue 3D du potager ${widthM} par ${lengthM} mètres avec réseau d irrigation`}
      >
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[widthM * 1.2, widthM, lengthM * 1.4]} fov={45} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 15, 5]} intensity={1.2} castShadow />
          <OrbitControls
            enablePan
            minDistance={3}
            maxDistance={25}
            target={[widthM / 2, 0, lengthM / 2]}
          />

          <Ground width={widthM} length={lengthM} />

          {plants.map((plant, i) => {
            const variety = getVariety(plant.varietyId);
            if (!variety) return null;
            const px = (plant.x / plan.gridCols) * widthM;
            const pz = (plant.y / plan.gridRows) * lengthM;
            return (
              <PlantMesh
                key={`plant-${i}`}
                x={px}
                z={pz}
                color={variety.color}
                emoji={variety.emoji}
                name={variety.name}
              />
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
            const radius = seg.kind === "main" ? 0.04 : seg.kind === "lateral" ? 0.025 : 0.015;

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
              return (
                <SprinklerMesh key={n.id} x={px} z={pz} radius={r} label={n.label} />
              );
            }
            const y = n.kind === "source" ? 0.15 : n.kind === "valve" ? 0.12 : 0.08;
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
                label={n.label}
                size={n.kind === "source" ? 0.12 : 0.06}
              />
            );
          })}
        </Canvas>
      </div>

      <p className="mt-2 text-xs text-emerald-600">
        Tuyaux enterrés affichés sous la surface du sol (coupe transversale).
        Profondeur : {irrigation.buriedDepthCm ?? "—"} cm.
      </p>
    </section>
  );
}

function Ground({ width, length }: { width: number; length: number }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[width / 2, 0, length / 2]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#8B6914" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[width / 2, -0.001, length / 2]}>
        <planeGeometry args={[width + 0.4, length + 0.4]} />
        <meshStandardMaterial color="#6B8E23" transparent opacity={0.35} />
      </mesh>
      <gridHelper args={[Math.max(width, length), Math.max(width, length), "#5c4a1a", "#5c4a1a"]} position={[width / 2, 0.01, length / 2]} />
    </group>
  );
}

function PlantMesh({
  x,
  z,
  color,
  emoji,
  name,
}: {
  x: number;
  z: number;
  color: string;
  emoji: string;
  name: string;
}) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.3, 8]} />
        <meshStandardMaterial color="#4a6741" />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Html distanceFactor={8} position={[0, 0.6, 0]} center>
        <span className="text-lg drop-shadow" title={name} aria-hidden="true">
          {emoji}
        </span>
      </Html>
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
  const rotX = Math.asin(dy / length);

  return (
    <mesh
      position={[mx, my, mz]}
      rotation={[rotX, rotY, 0]}
      castShadow={!buried}
    >
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
  label,
  size,
}: {
  x: number;
  y: number;
  z: number;
  color: string;
  label?: string;
  size: number;
}) {
  return (
    <group position={[x, y, z]}>
      <mesh castShadow>
        <sphereGeometry args={[size, 12, 12]} />
        <meshStandardMaterial color={color} metalness={0.4} />
      </mesh>
      {label && (
        <Html distanceFactor={10} position={[0, size + 0.1, 0]} center>
          <span className="whitespace-nowrap rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-emerald-900 shadow">
            {label}
          </span>
        </Html>
      )}
    </group>
  );
}

function SprinklerMesh({
  x,
  z,
  radius,
  label,
}: {
  x: number;
  z: number;
  radius: number;
  label?: string;
}) {
  return (
    <group position={[x, 0.05, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.8, radius, 32]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.35} side={2} />
      </mesh>
      <NodeMesh x={0} y={0.08} z={0} color="#3b82f6" label={label} size={0.07} />
    </group>
  );
}
