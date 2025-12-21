"use client";

import { ClipLoader } from "react-spinners";

export default function Loading() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      aria-label="Loading"
    >
      <ClipLoader size={48} color="var(--color-deco)" speedMultiplier={1} />
    </div>
  );
}
