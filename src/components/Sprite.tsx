import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";

// TODO https://stackoverflow.com/questions/43848330/three-js-shadows-cast-by-partially-transparent-mesh

type SpriteProps = {
  image: string;
  position: [number, number, number];
  onSelect(): void;
};
export function Sprite({ image, position, onSelect }: SpriteProps) {
  const texture = useLoader(THREE.TextureLoader, image);
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (mesh.current) {
      mesh.current.position.lerp(new THREE.Vector3(...position), 0.1);
    }
  });
  return (
    <mesh
      ref={mesh}
      castShadow
      onClick={onSelect}
      rotation={[Math.PI / 4, 0, 0]}
    >
      <planeBufferGeometry attach="geometry" args={[2, 2]} />
      <meshBasicMaterial attach="material" map={texture} transparent />
    </mesh>
  );
}
