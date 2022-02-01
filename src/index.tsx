import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  Box,
  Cone,
  PerspectiveCamera,
  Plane,
} from "@react-three/drei";
import "./index.css";
import { PostProcessing } from "./components/Postprocessing";
import { useGame } from "./components/game";
import { TorchLight } from "./components/TorchLight";
import { Sprite } from "./components/Sprite";
import piromancerSprite from "./components/piromancer.png";
import terrainSprite from "./components/terrain.png";
import { useUI } from "./components/ui";

export default function App() {
  const game = useGame();
  const ui = useUI();
  const grid = React.useMemo(
    () => new THREE.GridHelper(1000, 1000, "black", "black"),
    []
  );
  const camera = React.useRef<THREE.Camera>();
  const selectedEntity = Object.entries(game.state.entities).find(
    ([id]) => ui.state.type === "entity" && id === ui.state.entityId
  )?.[1];
  return (
    <React.Fragment>
      <Suspense fallback={<h1>Loading</h1>}>
        <Canvas
          mode="concurrent"
          shadows
          // @ts-ignore
          colorManagement
        >
          <AdaptiveDpr pixelated />
          <PerspectiveCamera makeDefault ref={camera} position={[-8, -8, 8]} />
          <CameraLookAt />
          <PostProcessing />
          <fogExp2 attach="fog" args={["black", 0.03]} />
          <ambientLight intensity={0.2} />
          <directionalLight
            intensity={0.2}
            castShadow
            position={[50, 50, 50]}
          />
          {selectedEntity && (
            <Cone
              args={[0.25, 1, 16]}
              position={new THREE.Vector3(0, 0, 1).add(selectedEntity.position)}
              rotation={[-Math.PI / 2, 0, 0]}
              castShadow
            >
              <meshStandardMaterial attach="material" color="white" />
            </Cone>
          )}
          <TorchLight position={[0, 0, 4]} />
          <Plane
            receiveShadow
            position={[0, 0, -0.51]}
            args={[1000, 1000]}
            onClick={(event) => {
              console.log(event.point);
            }}
          >
            <meshStandardMaterial attach="material" color="gray" dithering />
          </Plane>
          <primitive
            object={grid}
            rotation={[Math.PI / 2, 0, 0]}
            position={[-0.5, -0.5, -0.5]}
          />
          {Object.entries(game.state.entities).map(([id, entity]) => {
            return (
              <Sprite
                key={id}
                image={piromancerSprite}
                position={entity.position.toArray()}
                onSelect={() => ui.selectEntity(id)}
              />
            );
          })}
        </Canvas>
      </Suspense>
      <div
        style={{
          position: "fixed",
          top: "32px",
          left: "32px",
          userSelect: "none",
        }}
      >
        <div>
          <input
            type="range"
            min={2}
            max={32}
            step={0.01}
            onChange={(event) => {
              if (camera.current) {
                camera.current.position.z = Number(event.currentTarget.value);
              }
            }}
          />
        </div>
        <button onClick={game.next}>next turn</button>
        <button onClick={ui.cancel} disabled={ui.state.type === "initial"}>
          X
        </button>
        <select
          value={ui.state.type === "action" ? ui.state.actionId : ""}
          disabled={ui.state.type !== "entity"}
        >
          <option value="">action</option>
          <option value={"move"}>move</option>
          <option value={"attack"}>attack</option>
        </select>
      </div>
    </React.Fragment>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

function CameraLookAt() {
  useFrame(({ camera }) => {
    camera.up = new THREE.Vector3(0, 0, 1);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  });
  return null;
}
