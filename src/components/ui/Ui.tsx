import React from "react";
import endTurnSprite from "./end-turn.png";
import attackSprite from "./attack.png";
import moveSprite from "./move.png";
import { Button } from "./Button";
import { Action, Entity } from "../game";

type UiProps = {
  onEndTurn: () => void;
  onAction: (id: Action["type"]) => void;
  sourceEntity: Entity | null;
};
export function Ui({ onEndTurn, onAction, sourceEntity }: UiProps) {
  return (
    <div
      style={{
        position: "fixed",
        width: "100vw",
        boxSizing: "border-box",
        bottom: "64px",
        padding: "0 64px",
        display: "grid",
        columnGap: "32px",
        gridAutoFlow: "column",
        gridAutoColumns: "min-content",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        onClick={() => onAction("move")}
        enabled={sourceEntity !== null}
        sprite={moveSprite}
      />
      <Button
        onClick={() => onAction("attack")}
        enabled={sourceEntity !== null}
        sprite={attackSprite}
      />
      <Button onClick={onEndTurn} enabled={true} sprite={endTurnSprite} />
    </div>
  );
}
