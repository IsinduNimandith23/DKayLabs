"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, AdaptiveDpr } from "@react-three/drei";
import AngularCrystal from "./AngularCrystal";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

/**
 * R3F canvas for the hero. Renders the crystal with crimson rim-lighting and
 * procedural metallic reflections (no external HDR - fully local & offline-safe).
 *
 * Performance:
 *  - capped DPR + AdaptiveDpr to keep frames cheap
 *  - lighter geometry/effects path on mobile & reduced-motion
 *  - a static fallback is shown by the parent on very low-power devices
 */
export default function HeroScene() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, isMobile ? 1.5 : 2]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        {/* Base ambient so the charcoal side faces aren't pure black. */}
        <ambientLight intensity={0.35} />

        {/* Warm ivory key light from upper-left. */}
        <directionalLight position={[-5, 6, 4]} intensity={1.1} color="#F6EFEC" />

        {/* Crimson RIM light from behind for the signature red edge-glow. */}
        <pointLight position={[3, -2, -4]} intensity={120} color="#C1121F" distance={20} />
        <pointLight position={[-3, 2, -3]} intensity={60} color="#FF2E3F" distance={18} />

        <AngularCrystal reducedMotion={reduced} />

        {/* Procedural studio reflections for the metallic sheen. */}
        <Environment resolution={isMobile ? 128 : 256}>
          <Lightformer
            intensity={2}
            position={[0, 2, 4]}
            scale={[6, 6, 1]}
            color="#ffffff"
          />
          <Lightformer
            intensity={3}
            position={[3, 0, 2]}
            scale={[3, 6, 1]}
            color="#C1121F"
          />
          <Lightformer
            intensity={1.5}
            position={[-4, -1, 2]}
            scale={[4, 4, 1]}
            color="#E4B7B3"
          />
        </Environment>

        <AdaptiveDpr pixelated />
      </Suspense>
    </Canvas>
  );
}
