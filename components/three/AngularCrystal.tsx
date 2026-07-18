"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * The hero centerpiece: a sharp, faceted crimson-metal crystal that echoes
 * the angular "A" of the DKayLabs mark.
 *
 * Reactions:
 *  - idle spin (always)
 *  - scroll  -> extra rotation + scale (drives the "ascend" feeling)
 *  - mouse   -> subtle parallax tilt toward the cursor
 *
 * Heavy lifting (lights/reflections) is supplied by the parent scene.
 */
export default function AngularCrystal({
  reducedMotion = false,
}: {
  reducedMotion?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!group.current) return;

    // Normalized scroll progress (0 at top, ~1 after one viewport).
    const scroll =
      typeof window !== "undefined"
        ? Math.min(window.scrollY / window.innerHeight, 1.2)
        : 0;

    // Pointer position, -1..1 on each axis (drei normalizes for us).
    const { x: px, y: py } = state.pointer;

    if (reducedMotion) {
      // Static, just face the camera squarely.
      group.current.rotation.set(0, scroll * 0.6, 0);
      group.current.scale.setScalar(1 - scroll * 0.12);
      return;
    }

    const t = state.clock.elapsedTime;

    // Idle drift + scroll-driven spin.
    group.current.rotation.y = t * 0.18 + scroll * Math.PI * 0.9;
    group.current.rotation.x = Math.sin(t * 0.4) * 0.12 + scroll * 0.4;

    // Mouse parallax tilt (eased toward target each frame).
    group.current.rotation.x += (py * 0.25 - group.current.rotation.x * 0) * 0;
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      px * 0.6,
      0.05
    );
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      py * 0.4,
      0.05
    );

    // Shrinks & recedes slightly as you scroll past the hero.
    const s = 1 - scroll * 0.18;
    group.current.scale.setScalar(s);

    // Inner core counter-rotates for depth.
    if (inner.current) {
      inner.current.rotation.y = -t * 0.5;
      inner.current.rotation.z = t * 0.2;
    }
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 1.5}
      rotationIntensity={reducedMotion ? 0 : 0.4}
      floatIntensity={reducedMotion ? 0 : 0.8}
    >
      <group ref={group} dispose={null}>
        {/* Outer faceted shell - sharp metallic crimson. */}
        <mesh castShadow receiveShadow>
          <icosahedronGeometry args={[1.6, 0]} />
          <meshStandardMaterial
            color="#C1121F"
            metalness={0.95}
            roughness={0.22}
            flatShading
            emissive="#8C0E14"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Warm ivory wireframe overlay for the "metallic edge" read. */}
        <mesh scale={1.005}>
          <icosahedronGeometry args={[1.6, 0]} />
          <meshBasicMaterial
            color="#C4B2B0"
            wireframe
            transparent
            opacity={0.25}
          />
        </mesh>

        {/* Glowing inner core seen through the facets. */}
        <mesh ref={inner} scale={0.55}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#FF2E3F"
            emissive="#FF2E3F"
            emissiveIntensity={2.2}
            metalness={0.4}
            roughness={0.3}
            toneMapped={false}
          />
        </mesh>
      </group>
    </Float>
  );
}
