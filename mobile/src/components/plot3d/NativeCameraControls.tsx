import { useEffect, useMemo, useRef, type RefObject, type ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useFrame, useThree } from "@react-three/fiber/native";
import * as THREE from "three";

export interface CameraControlState {
  azimuth: number;
  polar: number;
  distance: number;
  panX: number;
  panZ: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function initialControlState(
  widthM: number,
  lengthM: number
): CameraControlState {
  const target = new THREE.Vector3(widthM / 2, 0, lengthM / 2);
  const position = new THREE.Vector3(
    widthM * 1.2,
    widthM,
    lengthM * 1.4
  );
  const offset = position.sub(target);
  const spherical = new THREE.Spherical().setFromVector3(offset);
  return {
    azimuth: spherical.theta,
    polar: clamp(spherical.phi, 0.25, Math.PI / 2 - 0.12),
    distance: clamp(spherical.radius, 3, 25),
    panX: 0,
    panZ: 0,
  };
}

export function useCameraControlState(widthM: number, lengthM: number) {
  const controlRef = useRef<CameraControlState>(
    initialControlState(widthM, lengthM)
  );

  useEffect(() => {
    controlRef.current = initialControlState(widthM, lengthM);
  }, [widthM, lengthM]);

  return controlRef;
}

export function NativeCameraRig({
  controlRef,
  target,
  minDistance,
  maxDistance,
}: {
  controlRef: RefObject<CameraControlState>;
  target: [number, number, number];
  minDistance: number;
  maxDistance: number;
}) {
  const { camera } = useThree();
  const targetVec = useMemo(
    () => new THREE.Vector3(...target),
    [target[0], target[1], target[2]]
  );
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const state = controlRef.current;
    if (!state) return;

    state.distance = clamp(state.distance, minDistance, maxDistance);
    state.polar = clamp(state.polar, 0.25, Math.PI / 2 - 0.12);

    const sinPhi = Math.sin(state.polar);
    const x =
      targetVec.x +
      state.panX +
      state.distance * sinPhi * Math.sin(state.azimuth);
    const y = targetVec.y + state.distance * Math.cos(state.polar);
    const z =
      targetVec.z +
      state.panZ +
      state.distance * sinPhi * Math.cos(state.azimuth);

    if (!Number.isFinite(x + y + z)) return;

    camera.position.set(x, y, z);
    lookAt.set(
      targetVec.x + state.panX,
      targetVec.y,
      targetVec.z + state.panZ
    );
    camera.lookAt(lookAt);
  });

  return null;
}

export function NativeCameraGestureView({
  controlRef,
  minDistance,
  maxDistance,
  children,
  style,
}: {
  controlRef: RefObject<CameraControlState>;
  minDistance: number;
  maxDistance: number;
  children: ReactNode;
  style?: object;
}) {
  const pinchStartDistance = useRef(0);
  const rotateLast = useRef({ x: 0, y: 0 });
  const panLast = useRef({ x: 0, y: 0 });

  const rotateGesture = Gesture.Pan()
    .minPointers(1)
    .maxPointers(1)
    .onBegin(() => {
      rotateLast.current = { x: 0, y: 0 };
    })
    .onUpdate((event) => {
      const state = controlRef.current;
      if (!state) return;
      const dx = event.translationX - rotateLast.current.x;
      const dy = event.translationY - rotateLast.current.y;
      rotateLast.current = { x: event.translationX, y: event.translationY };
      state.azimuth -= dx * 0.005;
      state.polar = clamp(
        state.polar + dy * 0.005,
        0.25,
        Math.PI / 2 - 0.12
      );
    })
    .onFinalize(() => {
      rotateLast.current = { x: 0, y: 0 };
    });

  const panGesture = Gesture.Pan()
    .minPointers(2)
    .maxPointers(2)
    .onBegin(() => {
      panLast.current = { x: 0, y: 0 };
    })
    .onUpdate((event) => {
      const state = controlRef.current;
      if (!state) return;
      const dx = event.translationX - panLast.current.x;
      const dy = event.translationY - panLast.current.y;
      panLast.current = { x: event.translationX, y: event.translationY };
      state.panX += dx * 0.008;
      state.panZ += dy * 0.008;
    })
    .onFinalize(() => {
      panLast.current = { x: 0, y: 0 };
    });

  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      pinchStartDistance.current = controlRef.current?.distance ?? 10;
    })
    .onUpdate((event) => {
      const state = controlRef.current;
      if (!state || event.scale <= 0) return;
      state.distance = clamp(
        pinchStartDistance.current / event.scale,
        minDistance,
        maxDistance
      );
    });

  const gesture = Gesture.Simultaneous(
    rotateGesture,
    panGesture,
    pinchGesture
  );

  return (
    <GestureDetector gesture={gesture}>
      <View style={[styles.gestureRoot, style]} collapsable={false}>
        {children}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  gestureRoot: { flex: 1 },
});
