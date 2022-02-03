import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import {
  AdaptiveDpr,
  MapControls,
  PerspectiveCamera,
  Plane,
  RoundedBox,
  Stars,
} from "@react-three/drei";
import "./index.css";
import { Action, useGame } from "./components/game";
import { TorchLight } from "./components/TorchLight";
import { Sprite } from "./components/Sprite";
import { Ui } from "./components/ui/Ui";
import { getEntitySprite } from "./components/entity/getEntitySprite";
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
  SSAO,
  ToneMapping,
  LUT,
  DepthOfField,
} from "@react-three/postprocessing";
// @ts-ignore
import { LUTCubeLoader } from "postprocessing";

export default function App() {
  const game = useGame();
  const grid = React.useMemo(
    () => new THREE.GridHelper(1000, 1000, "black", "black"),
    []
  );
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
    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      if (actionId) {
        setActionId(null);
      } else if (sourceLocation) {
        setSourceLocation(null);
      }
    };
    document.addEventListener("contextmenu", onContextMenu);
    return () => document.removeEventListener("contextmenu", onContextMenu);
  }, [actionId, sourceLocation]);
  const lut: THREE.Texture = useLoader(LUTCubeLoader, "/django-25.cube");
  return (
    <React.Fragment>
      <Canvas
        mode="concurrent"
        shadows
        // @ts-ignore
        colorManagement
        antialias
        gl={{ powerPreference: "high-performance" }}
      >
        <AdaptiveDpr pixelated />
        <EffectComposer>
          {/* <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} /> */}
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
          <Noise opacity={0.015} />
          <Vignette eskil={false} offset={0.35} darkness={0.5} />
          {/* <SSAO /> */}
          <ToneMapping />
          <LUT lut={lut} />
        </EffectComposer>
        <PerspectiveCamera makeDefault position={[0, -8, 8]} up={[0, 0, 1]} />
        <MapControls />
        <fogExp2 attach="fog" args={["black", 0.025]} />
        <Stars factor={4} saturation={1} fade />
        <ambientLight intensity={0.2} />
        <directionalLight
          castShadow
          args={[0x55eeff, 0.2]}
          position={[-0.5, 0.5, 1]}
        />
        {sourceEntity && (
          <group position={sourceEntity.position}>
            <RoundedBox args={[1, 1, 0.1]} position={[0, 0, 0.05]}>
              <meshStandardMaterial attach="material" color="blue" />
            </RoundedBox>
            <pointLight position={[0, 0, 0.5]} args={[0xffffff, 1, 1.1]} />
          </group>
        )}
        {actionId && (
          <group position={targetLocation}>
            <RoundedBox args={[1, 1, 0.1]} position={[0, 0, 0.05]}>
              <meshStandardMaterial attach="material" color="#ff4625" />
            </RoundedBox>
            <pointLight position={[0, 0, 0.5]} args={[0xffffff, 1, 1.1]} />
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
                    velocity: targetLocation.clone().sub(sourceEntity.position),
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
      <Ui
        onEndTurn={game.next}
        onAction={setActionId}
        sourceEntity={sourceEntity}
      />
    </React.Fragment>
  );
}

ReactDOM.render(
  <Suspense fallback={<h1>Loading</h1>}>
    <App />
  </Suspense>,
  document.getElementById("root")
);
