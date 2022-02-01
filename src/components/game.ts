import React from "react";
import * as THREE from "three";

// TODO fix overlap when one square is between entities and they move towards each other

export type Entity = {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
};

type State = {
  entities: Record<string, Entity>;
};

export type Action =
  | {
      type: "move";
      velocity: THREE.Vector3;
    }
  | {
      type: "attack";
      target: THREE.Vector3;
    };

const initial: State = {
  entities: {
    player: {
      position: new THREE.Vector3(0, 0, 0),
      velocity: new THREE.Vector3(0, 0, 0),
    },
    bot: {
      position: new THREE.Vector3(4, 0, 0),
      velocity: new THREE.Vector3(0, 0, 0),
    },
  },
};

export function useGame() {
  const [state, setState] = React.useState(initial);
  const [actions, setActions] = React.useState<Record<string, Action>>({});
  const next = React.useCallback(() => {
    setState({
      entities: resolveMotion(applyMotion(state.entities, actions)),
    });
    setActions({});
  }, [state, actions]);
  const action = React.useCallback(
    (id: string, action: Action) => {
      setActions({ ...actions, [id]: action });
    },
    [actions]
  );
  return { state, next, action };
}

function resolveMotion(
  entities: Record<string, Entity>
): Record<string, Entity> {
  let somethingMoved = false;
  const entries = Object.entries(entities);
  const step = Object.fromEntries(
    entries.map(([id, entity]) => {
      const target = entity.position.clone().add(entity.velocity);
      const isEntityAtTarget = entries.some(([_, entity]) =>
        entity.position.equals(target)
      );
      if (isEntityAtTarget) return [id, entity];
      somethingMoved = true;
      return [id, { position: target, velocity: new THREE.Vector3(0, 0, 0) }];
    })
  );
  // const isEverythinStill = Object.values(step).every((entity) =>
  //   entity.velocity.equals(new THREE.Vector3(0, 0, 0))
  // );
  if (somethingMoved) return resolveMotion(step);
  return step;
}

function applyMotion(
  entities: Record<string, Entity>,
  actions: Record<string, Action>
): Record<string, Entity> {
  return Object.fromEntries(
    Object.entries(entities).map(([id, entity]) => {
      const action = actions[id];
      if (!action) return [id, entity];
      switch (action.type) {
        case "move":
          return [
            id,
            {
              position: entity.position,
              velocity: entity.velocity.clone().add(action.velocity),
            },
          ];
      }
      throw new Error();
    })
  );
}
