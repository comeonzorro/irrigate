"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import type { PlanResult, PlotConfig, PipeNode, VarietyDisplay } from "@/lib/types";
import { getIrrigationMode } from "@/lib/data/irrigation";
import { IrrigationSceneLegend } from "@/components/IrrigationLegend";
import { useMediaQuery } from "@/lib/useMediaQuery";

interface PlotView3DProps {
  plan: PlanResult;
  config: PlotConfig;
  varietyDisplay: Record<string, VarietyDisplay>;
  widthM: number;
  lengthM: number;
}

const PIPE_COLORS: Record<string, string> = {
  main: "#1d4ed8",
  lateral: "#2563eb",
  dripper: "#06b6d4",
  hose_path: "#64748b",
};

type SceneLabels = "off" | "key" | "all";

function View3DControls({
  sceneLabels,
  onSceneLabels,
  showLegend,
  onShowLegend,
  showPlantEmojis,
  onShowPlantEmojis,
  compact,
}: {
  sceneLabels: SceneLabels;
  onSceneLabels: (v: SceneLabels) => void;
  showLegend: boolean;
  onShowLegend: (v: boolean) => void;
  showPlantEmojis: boolean;
  onShowPlantEmojis: (v: boolean) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-wrap items-end gap-x-4 gap-y-3 ${compact ? "gap-y-2" : ""}`}
      role="group"
      aria-label="Affichage de la vue 3D"
    >
      <fieldset className="flex flex-wrap gap-2 border-0 p-0 sm:gap-3">
        <legend className="mb-1 w-full text-xs font-medium text-emerald-700">
          Étiquettes
        </legend>
        {(
          [
            { value: "off" as const, label: compact ? "Aucune" : "Aucune (légende)" },
            { value: "key" as const, label: "Clés" },
            { value: "all" as const, label: "Toutes" },
          ] as const
        ).map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-1.5 text-sm text-emerald-800"
          >
            <input
              type="radio"
              name="scene-labels"
              checked={sceneLabels === opt.value}
              onChange={() => onSceneLabels(opt.value)}
              className="h-4 w-4 border-emerald-300 text-emerald-600 focus:ring-emerald-400"
            />
            {opt.label}
          </label>
        ))}
      </fieldset>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-emerald-800">
        <input
          type="checkbox"
          checked={showLegend}
          onChange={(e) => onShowLegend(e.target.checked)}
          className="h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-400"
        />
        Légende
      </label>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-emerald-800">
        <input
          type="checkbox"
          checked={showPlantEmojis}
          onChange={(e) => onShowPlantEmojis(e.target.checked)}
          className="h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-400"
        />
        Emojis
      </label>
    </div>
  );
}

function PlotScene({
  plan,
  varietyDisplay,
  widthM,
  lengthM,
  showPlantEmojis,
  shouldShowNodeLabel,
  irrigation,
  plants,
}: {
  plan: PlanResult;
  varietyDisplay: Record<string, VarietyDisplay>;
  widthM: number;
  lengthM: number;
  showPlantEmojis: boolean;
  shouldShowNodeLabel: (node: PipeNode) => boolean;
  irrigation: PlanResult["irrigation"];
  plants: PlanResult["plants"];
}) {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[widthM * 1.2, widthM, lengthM * 1.4]}
        fov={45}
      />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 5]} intensity={1.2} castShadow />
      <OrbitControls
        enablePan
        enableDamping
        dampingFactor={0.08}
        minDistance={3}
        maxDistance={25}
        target={[widthM / 2, 0, lengthM / 2]}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN,
        }}
      />

      <Ground width={widthM} length={lengthM} />

      {plants.map((plant, i) => {
        const variety = varietyDisplay[plant.varietyId];
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
            showEmoji={showPlantEmojis}
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
        const label = shouldShowNodeLabel(n) ? n.label : undefined;

        if (n.kind === "sprinkler" && n.radius) {
          const r = (n.radius / plan.gridCols) * widthM;
          return (
            <SprinklerMesh key={n.id} x={px} z={pz} radius={r} label={label} />
          );
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
            label={label}
            size={n.kind === "source" ? 0.12 : 0.06}
          />
        );
      })}
    </>
  );
}

function PlotCanvasFrame({
  plan,
  varietyDisplay,
  widthM,
  lengthM,
  showPlantEmojis,
  shouldShowNodeLabel,
  className,
  hint,
}: {
  plan: PlanResult;
  varietyDisplay: Record<string, VarietyDisplay>;
  widthM: number;
  lengthM: number;
  showPlantEmojis: boolean;
  shouldShowNodeLabel: (node: PipeNode) => boolean;
  className?: string;
  hint?: boolean;
}) {
  const { plants, irrigation } = plan;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-emerald-200 bg-gradient-to-b from-sky-100 to-emerald-50 touch-none ${className ?? ""}`}
      role="img"
      aria-label={`Vue 3D du potager ${widthM} par ${lengthM} mètres`}
    >
      {hint && (
        <p className="pointer-events-none absolute bottom-2 left-0 right-0 z-10 text-center text-xs text-emerald-800/80">
          1 doigt : rotation · 2 doigts : zoom & déplacement
        </p>
      )}
      <Canvas shadows className="!h-full !w-full" style={{ width: "100%", height: "100%" }}>
        <PlotScene
          plan={plan}
          varietyDisplay={varietyDisplay}
          widthM={widthM}
          lengthM={lengthM}
          showPlantEmojis={showPlantEmojis}
          shouldShowNodeLabel={shouldShowNodeLabel}
          irrigation={irrigation}
          plants={plants}
        />
      </Canvas>
    </div>
  );
}

export function PlotView3D({ plan, config, varietyDisplay, widthM, lengthM }: PlotView3DProps) {
  const mode = getIrrigationMode(config.irrigationModeId);
  const { irrigation } = plan;
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [showPlantEmojis, setShowPlantEmojis] = useState(false);
  const [sceneLabels, setSceneLabels] = useState<SceneLabels>("off");
  const [showLegend, setShowLegend] = useState(!isMobile);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);

  useEffect(() => {
    setShowLegend(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (!isFullscreen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isFullscreen]);

  const shouldShowNodeLabel = (node: PipeNode) => {
    if (sceneLabels === "off") return false;
    if (sceneLabels === "key") {
      return node.kind === "source" || node.kind === "valve" || node.kind === "sprinkler";
    }
    return true;
  };

  const canvasProps = {
    plan,
    varietyDisplay,
    widthM,
    lengthM,
    showPlantEmojis,
    shouldShowNodeLabel,
  };

  const fullscreenOverlay = isFullscreen && (
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-emerald-950"
      role="dialog"
      aria-modal="true"
      aria-label="Vue 3D plein écran"
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-emerald-800 bg-emerald-900 px-4 py-3 text-white">
        <div>
          <p className="font-semibold">Vue 3D</p>
          <p className="text-xs text-emerald-200">
            {mode?.name} · {irrigation.totalPipeLengthM} m
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsFullscreen(false)}
          className="rounded-lg bg-white/15 px-3 py-2 text-sm font-medium hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        >
          Fermer
        </button>
      </header>

      <div className="min-h-0 flex-1 p-3">
        <PlotCanvasFrame
          {...canvasProps}
          className="h-full min-h-0"
          hint
        />
      </div>

      <div className="shrink-0 border-t border-emerald-800 bg-emerald-900/95 p-3">
        <View3DControls
          sceneLabels={sceneLabels}
          onSceneLabels={setSceneLabels}
          showLegend={showLegend}
          onShowLegend={setShowLegend}
          showPlantEmojis={showPlantEmojis}
          onShowPlantEmojis={setShowPlantEmojis}
          compact
        />
        {showLegend && (
          <IrrigationSceneLegend
            buriedDepthCm={irrigation.buriedDepthCm}
            className="mt-3 w-full"
          />
        )}
      </div>
    </div>
  );

  return (
    <>
      {fullscreenOverlay}

      <section
        aria-labelledby="view3d-heading"
        className="rounded-2xl border border-emerald-200/60 bg-white/80 p-3 shadow-sm backdrop-blur sm:p-5"
      >
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="view3d-heading" className="text-lg font-semibold text-emerald-900">
            🏗️ Vue 3D — installation
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-emerald-600">
              {mode?.name} · {irrigation.totalPipeLengthM} m de tuyaux
            </span>
            {isMobile && (
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                ⛶ Plein écran
              </button>
            )}
          </div>
        </div>

        {isMobile ? (
          <button
            type="button"
            onClick={() => setControlsOpen((o) => !o)}
            className="mb-3 w-full rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-left text-sm text-emerald-800"
            aria-expanded={controlsOpen}
          >
            {controlsOpen ? "▾ Masquer les options" : "▸ Options d'affichage"}
          </button>
        ) : (
          <p className="mb-3 text-sm text-emerald-700">
            Les tuyaux restent visibles. Utilisez la légende pour identifier les
            éléments sans surcharger la vue.
          </p>
        )}

        {(!isMobile || controlsOpen) && (
          <div className="mb-3">
            <View3DControls
              sceneLabels={sceneLabels}
              onSceneLabels={setSceneLabels}
              showLegend={showLegend}
              onShowLegend={setShowLegend}
              showPlantEmojis={showPlantEmojis}
              onShowPlantEmojis={setShowPlantEmojis}
              compact={isMobile}
            />
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <PlotCanvasFrame
            {...canvasProps}
            className={
              isMobile
                ? "h-[min(58vh,520px)] min-h-[280px] w-full flex-1"
                : "h-[420px] min-h-[420px] flex-1"
            }
            hint={isMobile}
          />

          {showLegend && (
            <IrrigationSceneLegend
              buriedDepthCm={irrigation.buriedDepthCm}
              className="sm:w-44 sm:shrink-0"
            />
          )}
        </div>

        <p className="mt-2 text-xs text-emerald-600">
          Tuyaux toujours affichés · profondeur enterrée :{" "}
          {irrigation.buriedDepthCm ?? "surface"} cm
          {isMobile && " · Touchez « Plein écran » pour une manipulation plus confortable."}
        </p>
      </section>
    </>
  );
}

function Ground({ width, length }: { width: number; length: number }) {
  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[width / 2, 0, length / 2]}
        receiveShadow
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
        args={[Math.max(width, length), Math.max(width, length), "#5c4a1a", "#5c4a1a"]}
        position={[width / 2, 0.01, length / 2]}
      />
    </group>
  );
}

function PlantMesh({
  x,
  z,
  color,
  emoji,
  name,
  showEmoji,
}: {
  x: number;
  z: number;
  color: string;
  emoji: string;
  name: string;
  showEmoji: boolean;
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
      {showEmoji && (
        <Html distanceFactor={8} position={[0, 0.6, 0]} center>
          <span className="text-lg drop-shadow" title={name} aria-hidden="true">
            {emoji}
          </span>
        </Html>
      )}
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
    <mesh position={[mx, my, mz]} rotation={[rotX, rotY, 0]} castShadow={!buried}>
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
