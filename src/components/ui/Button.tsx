import React from "react";

type ButtonProps = {
  enabled: boolean;
  onClick(): void;
  sprite: string;
};
export function Button({ onClick, enabled, sprite }: ButtonProps) {
  const [hasMouse, setHasMouse] = React.useState(false);
  return (
    <button
      onClick={onClick}
      disabled={!enabled}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0)",
        border: "none",
      }}
      onMouseEnter={() => setHasMouse(true)}
      onMouseLeave={() => setHasMouse(false)}
    >
      <img
        src={sprite}
        style={{
          width: "64px",
          height: "64px",
          filter:
            "drop-shadow(2px 4px 6px black)" +
            (enabled ? "" : " brightness(0.5)"),
          transform: hasMouse ? "scale(1.5)" : "scale(1)",
          transition: "0.1s",
        }}
      />
    </button>
  );
}
