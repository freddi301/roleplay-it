import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Plane } from "@react-three/drei";
import "./index.css";
import { PostProcessing } from "./components/Postprocessing";
import { Action, useGameState } from "./components/logic";
import { TorchLight } from "./components/TorchLight";
import warriorSprite from "./components/warrior.gif";
import { Sprite } from "./components/Sprite";

export default function App() {
  const { state, next, action } = useGameState();
  const [selectedEntityId, setSelectedEntityId] = React.useState<string | null>(
    null
  );
  return (
    <React.Fragment>
      <Suspense fallback={<h1>Loading</h1>}>
        <Canvas
          mode="concurrent"
          shadows
          // @ts-ignore
          colorManagement
          camera={{
            position: [0, -8, 8],
            rotation: [Math.PI / 4, 0, 0],
            fov: 90,
          }}
        >
          <PostProcessing />
          <fogExp2 attach="fog" args={["black", 0.03]} />
          <ambientLight intensity={0.2} />
          <directionalLight
            intensity={0.2}
            castShadow
            position={[-100, 100, 100]}
          />
          <TorchLight position={[1, -1, 4]} />
          <Plane receiveShadow position={[0, 0, -1]} args={[1000, 1000]}>
            <meshStandardMaterial attach="material" color="gray" dithering />
          </Plane>
          <Grid />
          {Object.entries(state.entities).map(([id, entity]) => {
            return (
              <Sprite
                key={id}
                image={warriorSprite}
                position={entity.position.toArray()}
                onSelect={() => setSelectedEntityId(id)}
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
        <div
          style={{ backgroundColor: "gray", padding: "16px" }}
          onClick={next}
        >
          next
        </div>
        {selectedEntityId && (
          <MoveControls onAction={(a) => action(selectedEntityId, a)} />
        )}
      </div>
    </React.Fragment>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

function Grid() {
  const size = 1000;
  const divisions = 1000;
  const gridHelper = React.useMemo(
    () => new THREE.GridHelper(size, divisions, "black", "black"),
    []
  );
  return (
    <primitive
      object={gridHelper}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0.5, 0, -1]}
    />
  );
}

type MoveControlsProps = {
  onAction(action: Action): void;
};
function MoveControls({ onAction }: MoveControlsProps) {
  const size = 32;
  return (
    <div
      style={{
        position: "relative",
        width: `${size}*3px`,
        height: `${size}*3px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: size * 0,
          left: size * 0,
          width: size,
          height: size,
          backgroundColor: "gray",
          border: "1px solid black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() =>
          onAction({ type: "move", velocity: new THREE.Vector3(-1, 1, 0) })
        }
      >
        nw
      </div>
      <div
        style={{
          position: "absolute",
          top: size * 0,
          left: size * 1,
          width: size,
          height: size,
          backgroundColor: "gray",
          border: "1px solid black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() =>
          onAction({ type: "move", velocity: new THREE.Vector3(0, 1, 0) })
        }
      >
        n
      </div>
      <div
        style={{
          position: "absolute",
          top: size * 0,
          left: size * 2,
          width: size,
          height: size,
          backgroundColor: "gray",
          border: "1px solid black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() =>
          onAction({ type: "move", velocity: new THREE.Vector3(1, 1, 0) })
        }
      >
        ne
      </div>
      <div
        style={{
          position: "absolute",
          top: size * 1,
          left: size * 0,
          width: size,
          height: size,
          backgroundColor: "gray",
          border: "1px solid black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() =>
          onAction({ type: "move", velocity: new THREE.Vector3(-1, 0, 0) })
        }
      >
        w
      </div>
      <div
        style={{
          position: "absolute",
          top: size * 1,
          left: size * 1,
          width: size,
          height: size,
          backgroundColor: "gray",
          border: "1px solid black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() =>
          onAction({ type: "move", velocity: new THREE.Vector3(0, 0, 0) })
        }
      ></div>
      <div
        style={{
          position: "absolute",
          top: size * 1,
          left: size * 2,
          width: size,
          height: size,
          backgroundColor: "gray",
          border: "1px solid black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() =>
          onAction({ type: "move", velocity: new THREE.Vector3(1, 0, 0) })
        }
      >
        e
      </div>
      <div
        style={{
          position: "absolute",
          top: size * 2,
          left: size * 0,
          width: size,
          height: size,
          backgroundColor: "gray",
          border: "1px solid black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() =>
          onAction({ type: "move", velocity: new THREE.Vector3(-1, -1, 0) })
        }
      >
        sw
      </div>
      <div
        style={{
          position: "absolute",
          top: size * 2,
          left: size * 1,
          width: size,
          height: size,
          backgroundColor: "gray",
          border: "1px solid black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() =>
          onAction({ type: "move", velocity: new THREE.Vector3(0, -1, 0) })
        }
      >
        s
      </div>
      <div
        style={{
          position: "absolute",
          top: size * 2,
          left: size * 2,
          width: size,
          height: size,
          backgroundColor: "gray",
          border: "1px solid black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() =>
          onAction({ type: "move", velocity: new THREE.Vector3(1, -1, 0) })
        }
      >
        se
      </div>
    </div>
  );
}
