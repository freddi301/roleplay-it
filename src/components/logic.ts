import THREE from "three";

export type Entity = {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
};

function resolveMotion(
  entities: Record<string, Entity>
): Record<string, Entity> {
  const entries = Object.entries(entities);
  const step = Object.fromEntries(
    entries.map(([id, entity]) => {
      const target = entity.position.clone().add(entity.velocity);
      const isEntityAtTarget = entries.some(([_, entity]) =>
        entity.position.equals(target)
      );
      if (isEntityAtTarget) return [id, entity];
      return [id, { position: target, velocity: new THREE.Vector3(0, 0, 0) }];
    })
  );
  const isEverythinStill = Object.values(step).every((entity) =>
    entity.velocity.equals(new THREE.Vector3(0, 0, 0))
  );
  if (isEverythinStill) return step;
  return resolveMotion(step);
}
