import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import { Plane } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import "./index.css";
import { PostProcessing } from "./components/Postprocessing";
import { Entity } from "./components/logic";
import { TorchLight } from "./components/TorchLight";
import femaleWarriorSprite from "./components/female-warrior-sprite.gif";

export default function App() {
  const entities: Record<string, Entity> = {
    player: {
      position: new THREE.Vector3(0, 0, 0),
      velocity: new THREE.Vector3(0, 0, 0),
    },
    bot: {
      position: new THREE.Vector3(2, 0, 0),
      velocity: new THREE.Vector3(0, 0, 0),
    },
  };
  return (
    <Suspense fallback={<h1>Loading</h1>}>
      <Canvas
        mode="concurrent"
        shadows
        // @ts-ignore
        colorManagement
        camera={{ position: [0, -8, 8], rotation: [1, 0, 0], fov: 90 }}
      >
        <PostProcessing />
        <fogExp2 attach="fog" args={["black", 0.02]} />
        <ambientLight intensity={0.1} />
        {/* <directionalLight intensity={0.1} castShadow position={[0, 0, 100]} /> */}
        <TorchLight position={[1, -1, 4]} />
        <Plane receiveShadow position={[0, 0, -1]} args={[1000, 1000]}>
          <meshStandardMaterial attach="material" color="gray" dithering />
        </Plane>
        {Object.entries(entities).map(([id, entity]) => {
          return (
            <Sprite
              key={id}
              image={femaleWarriorSprite}
              position={entity.position.toArray()}
            />
          );
        })}
      </Canvas>
    </Suspense>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

type SpriteProps = {
  image: string;
  position: [number, number, number];
};
function Sprite({ image, position }: SpriteProps) {
  const texture = useLoader(THREE.TextureLoader, image);
  return (
    <mesh position={position} rotation={[1, 0, 0]} castShadow>
      <planeBufferGeometry attach="geometry" args={[2, 2]} />
      <meshBasicMaterial attach="material" map={texture} transparent />
    </mesh>
  );
}
