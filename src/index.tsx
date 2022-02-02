import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  AdaptiveDpr,
  PerspectiveCamera,
  Plane,
  RoundedBox,
} from "@react-three/drei";
import "./index.css";
import { PostProcessing } from "./components/Postprocessing";
import { Action, useGame } from "./components/game";
import { TorchLight } from "./components/TorchLight";
import { Sprite } from "./components/Sprite";
import { Ui } from "./components/ui/Ui";
import { getEntitySprite } from "./components/entity/getEntitySprite";

export default function App() {
  const game = useGame();
  const grid = React.useMemo(
    () => new THREE.GridHelper(1000, 1000, "black", "black"),
    []
  );
  const camera = React.useRef<THREE.Camera>();
  const [sourceLocation, setSourceLocation] =
    React.useState<THREE.Vector3 | null>(null);
  const [actionId, setActionId] = React.useState<Action["type"] | null>(null);
  const [targetLocation, setTargetLocation] = React.useState(
    new THREE.Vector3(0, 0, 0)
  );
  const [sourceEntityId, sourceEntity] = (sourceLocation &&
    Object.entries(game.state.entities).find(([id, entity]) =>
      entity.position.equals(sourceLocation)
    )) ?? [null, null];
  React.useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (camera.current) {
        camera.current.position.z += event.deltaY > 1 ? 2 : -2;
      }
    };
    document.addEventListener("wheel", onWheel);
    return () => document.removeEventListener("wheel", onWheel);
  }, []);
  return (
    <React.Fragment>
      <Suspense fallback={<h1>Loading</h1>}>
        <Canvas
          mode="concurrent"
          shadows
          // @ts-ignore
          colorManagement
          antialias
        >
          <AdaptiveDpr pixelated />
          <PerspectiveCamera makeDefault ref={camera} position={[-8, -8, 8]} />
          <CameraLookAt />
          <PostProcessing />
          <fogExp2 attach="fog" args={["black", 0.025]} />
          <ambientLight intensity={0.2} />
          <pointLight
            castShadow
            args={[0xffffff, 0.2, 20]}
            position={[-0.5 * 10, 0.5 * 10, 1 * 10]}
          />
          {sourceEntity && (
            <group position={sourceEntity.position}>
              <RoundedBox args={[1, 1, 0.1]} position={[0, 0, 0.05]}>
                <meshStandardMaterial attach="material" color="#2583ff" />
              </RoundedBox>
              <pointLight
                position={[-0.1, -0.1, 0.5]}
                args={[0xffffff, 1, 1.1]}
              />
            </group>
          )}
          {actionId && (
            <group position={targetLocation}>
              <RoundedBox args={[1, 1, 0.1]} position={[0, 0, 0.05]}>
                <meshStandardMaterial attach="material" color="#ff4625" />
              </RoundedBox>
              <pointLight
                position={[-0.1, -0.1, 0.5]}
                args={[0xffffff, 1, 1.1]}
              />
            </group>
          )}
          <TorchLight position={[-2, -2, 2]} />
          <Plane
            position={[0, 0, -0.015]}
            receiveShadow
            args={[1000, 1000]}
            onPointerMove={(event) => {
              const location = new THREE.Vector3(
                Math.round(event.point.x),
                Math.round(event.point.y),
                0
              );
              if (!location.equals(targetLocation)) {
                setTargetLocation(location);
              }
            }}
            onClick={(event) => {
              const location = new THREE.Vector3(
                Math.round(event.point.x),
                Math.round(event.point.y),
                0
              );
              if (actionId && sourceEntityId && sourceEntity) {
                switch (actionId) {
                  case "move": {
                    game.action(sourceEntityId, {
                      type: "move",
                      velocity: targetLocation
                        .clone()
                        .sub(sourceEntity.position),
                    });
                    break;
                  }
                  case "attack": {
                    game.action(sourceEntityId, {
                      type: "attack",
                      target: targetLocation,
                    });
                    break;
                  }
                }
                setSourceLocation(null);
                setActionId(null);
              } else {
                setSourceLocation(location);
              }
            }}
          >
            <meshStandardMaterial attach="material" color="gray" dithering />
          </Plane>
          <primitive
            object={grid}
            rotation={[Math.PI / 2, 0, 0]}
            position={[-0.5, -0.5, 0]}
          />
          {Object.entries(game.state.entities).map(([id, entity]) => {
            return (
              <Sprite
                key={id}
                image={getEntitySprite(entity)}
                position={entity.position.toArray()}
              />
            );
          })}
        </Canvas>
      </Suspense>
      <Ui
        onEndTurn={game.next}
        onAction={setActionId}
        sourceEntity={sourceEntity}
      />
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
