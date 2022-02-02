import React from "react";
import * as THREE from "three";

export type Entity = {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  ai: boolean;
  type: "piromancer" | "sabertooth";
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
      ai: false,
      type: "piromancer",
    },
    bot1: {
      position: new THREE.Vector3(4, 0, 0),
      velocity: new THREE.Vector3(0, 0, 0),
      ai: true,
      type: "sabertooth",
    },
    bot2: {
      position: new THREE.Vector3(0, 4, 0),
      velocity: new THREE.Vector3(0, 0, 0),
      ai: true,
      type: "sabertooth",
    },
  },
};

export function useGame() {
  const [state, setState] = React.useState(initial);
  const [actions, setActions] = React.useState<Record<string, Action>>({});
  const next = React.useCallback(() => {
    setState((state) => {
      const aiActions = resolveAi(state.entities);
      console.log(aiActions);
      const combinedActions = { ...aiActions, ...actions };
      return {
        entities: resolveMotion(
          applyMotion(
            resolveDamage(state.entities, combinedActions),
            combinedActions
          )
        ),
      };
    });
    setActions({});
  }, [actions]);
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
      const willBeEntityAtTarget = entries.some(
        ([i, entity]) =>
          i !== id &&
          entity.position.clone().add(entity.velocity).equals(target)
      );
      if (isEntityAtTarget || willBeEntityAtTarget) return [id, entity];
      somethingMoved = true;
      return [
        id,
        {
          position: target,
          velocity: new THREE.Vector3(0, 0, 0),
          ai: entity.ai,
          type: entity.type,
        },
      ];
    })
  );
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
              ai: entity.ai,
              type: entity.type,
            },
          ];
        default:
          return [id, entity];
      }
    })
  );
}

function resolveDamage(
  entities: Record<string, Entity>,
  actions: Record<string, Action>
) {
  return Object.fromEntries(
    Object.entries(entities).flatMap(([id, entity]) => {
      const isAttacked = Object.values(actions).some(
        (action) =>
          action.type === "attack" && action.target.equals(entity.position)
      );
      if (isAttacked) return [];
      return [[id, entity]];
    })
  );
}

function resolveAi(entities: Record<string, Entity>): Record<string, Action> {
  const playerEntities = Object.values(entities).filter((entity) => !entity.ai);
  return Object.fromEntries(
    Object.entries(entities).flatMap(
      ([aiId, aiEntity]): Array<[string, Action]> => {
        if (!aiEntity.ai) return [];
        const nearestPlayerEntity = playerEntities.reduce(
          (nearestPlayerEntity: Entity | null, playerEntity) => {
            if (!nearestPlayerEntity) return playerEntity;
            const nearestDistance = nearestPlayerEntity.position.distanceTo(
              aiEntity.position
            );
            const distance = playerEntity.position.distanceTo(
              aiEntity.position
            );
            if (distance < nearestDistance) return playerEntity;
            return nearestPlayerEntity;
          },
          null
        );
        if (!nearestPlayerEntity) return [];
        if (nearestPlayerEntity.position.distanceTo(aiEntity.position) < 1.5) {
          return [
            [aiId, { type: "attack", target: nearestPlayerEntity.position }],
          ];
        }
        return [
          [
            aiId,
            {
              type: "move",
              velocity: clampToGrid(
                nearestPlayerEntity.position
                  .clone()
                  .sub(aiEntity.position)
                  .clampLength(0, 1)
              ),
            },
          ],
        ];
      }
    )
  );
}

function clampToGrid(position: THREE.Vector3) {
  return new THREE.Vector3(
    Math.round(position.x),
    Math.round(position.y),
    Math.round(position.z)
  );
}
