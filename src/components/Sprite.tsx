import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { Box } from "@react-three/drei";

// TODO https://stackoverflow.com/questions/43848330/three-js-shadows-cast-by-partially-transparent-mesh

type SpriteProps = {
  image: string;
  position: [number, number, number];
};
export function Sprite({ image, position }: SpriteProps) {
  const texture = useLoader(THREE.TextureLoader, image);
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ camera }, delta) => {
    if (group.current) {
      group.current.position.add(
        new THREE.Vector3(...position)
          .sub(group.current.position)
          .multiplyScalar(100)
          .clampLength(0, 5)
          .multiplyScalar(delta)
      );
    }
    if (mesh.current) {
      mesh.current.up = new THREE.Vector3(0, 0, 1);
      mesh.current.lookAt(camera.position);
    }
  });
  return (
    <group ref={group}>
      <mesh position={[0, 0, 0.5]} ref={mesh}>
        <planeBufferGeometry attach="geometry" args={[1, 1]} />
        <meshStandardMaterial attach="material" map={texture} transparent />
      </mesh>
      <Box args={[1, 1, 1]} castShadow position={[0, 0, 0.5]}>
        <meshBasicMaterial attach="material" transparent opacity={0} />
      </Box>
    </group>
  );
}
