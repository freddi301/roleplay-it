import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import React from "react";

type TorchLightProps = {
  position: [number, number, number];
};
export function TorchLight({ position }: TorchLightProps) {
  const mesh = React.useRef<THREE.Mesh | null>(null);
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.position.x += Math.random() * 0.1;
      mesh.current.position.y += Math.random() * 0.1;
      mesh.current.position.z += Math.random() * 0.01;
      if (Math.abs(mesh.current.position.x - position[0]) > 0.5)
        mesh.current.position.x = position[0];
      if (Math.abs(mesh.current.position.y - position[1]) > 0.5)
        mesh.current.position.y = position[1];
      if (Math.abs(mesh.current.position.z - position[2]) > 0.2)
        mesh.current.position.z = position[2];
    }
  });
  return (
    <pointLight
      ref={mesh}
      castShadow
      intensity={1}
      args={[0xe3b549, 1, 10]}
      position={position}
    />
  );
}
