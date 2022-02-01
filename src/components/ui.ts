import React from "react";
import { Action } from "./game";

type UIState =
  | { type: "initial" }
  | { type: "entity"; entityId: string }
  | { type: "action"; entityId: string; actionId: Action["type"] };

export function useUI() {
  const [state, setState] = React.useState<UIState>({ type: "initial" });
  const selectEntity = React.useCallback((entityId: string) => {
    setState({ type: "entity", entityId });
  }, []);
  const cancel = React.useCallback(() => {
    setState((state) => {
      switch (state.type) {
        case "initial":
          return state;
        case "entity":
          return { type: "initial" };
        case "action":
          return { type: "entity", entityId: state.entityId };
      }
    });
  }, []);
  return { state, selectEntity, cancel };
}
