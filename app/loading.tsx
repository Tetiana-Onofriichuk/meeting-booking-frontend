"use client";

import { ClipLoader } from "react-spinners";

type Props = {
  minHeight?: string | number;
  size?: number;
  label?: string;
};

export default function Loading({
  minHeight = "60vh",
  size = 48,
  label = "Loading",
}: Props) {
  return (
    <div
      style={{
        minHeight,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      aria-label={label}
    >
      <ClipLoader size={size} color="var(--color-deco)" speedMultiplier={1} />
    </div>
  );
}
