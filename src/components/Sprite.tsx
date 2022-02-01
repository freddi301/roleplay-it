import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";

// TODO https://stackoverflow.com/questions/43848330/three-js-shadows-cast-by-partially-transparent-mesh

type SpriteProps = {
  image: string;
  position: [number, number, number];
  onSelect(): void;
};
export function Sprite({ image, position, onSelect }: SpriteProps) {
  const texture = useLoader(THREE.TextureLoader, image);
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ camera }, delta) => {
    if (group.current) {
      group.current.position.lerp(new THREE.Vector3(...position), delta);
    }
    if (mesh.current) {
      mesh.current.up = new THREE.Vector3(0, 0, 1);
      mesh.current.lookAt(camera.position);
    }
  });
  return (
    <group ref={group} position={position}>
      <mesh position={[0, 0, 0]} ref={mesh} onClick={onSelect}>
        <planeBufferGeometry attach="geometry" args={[1, 1]} />
        <meshStandardMaterial attach="material" map={texture} transparent />
      </mesh>
      <RoundedBox args={[1, 1, 1]} radius={0.1} castShadow>
        <meshBasicMaterial attach="material" transparent opacity={0} />
      </RoundedBox>
    </group>
  );
}
