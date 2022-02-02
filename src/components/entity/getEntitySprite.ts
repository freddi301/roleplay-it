import { Entity } from "../game";
import piromancerSprite from "./piromancer.png";
import sabertoothSprite from "./sabertooth.png";

export function getEntitySprite(entity: Entity) {
  return spriteMap[entity.type];
}

const spriteMap: { [K in Entity["type"]]: string } = {
  piromancer: piromancerSprite,
  sabertooth: sabertoothSprite,
};
