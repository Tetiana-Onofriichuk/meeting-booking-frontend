"use client";

import Button from "@/components/Button/Button";
import { useAppStore } from "@/store/appStore";

export default function HomePage() {
  const isLoading = useAppStore((state) => state.isLoading);
  const setLoading = useAppStore((state) => state.setLoading);

  return (
    <main className="container" style={{ paddingTop: 24 }}>
      <h1>Meeting Booking</h1>

      <p>
        Global loading state: <strong>{isLoading ? "TRUE" : "FALSE"}</strong>
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <Button variant="primary" onClick={() => setLoading(!isLoading)}>
          Toggle loading
        </Button>

        <Button variant="secondary" disabled={isLoading}>
          Secondary
        </Button>

        <Button variant="icon" aria-label="Icon button">
          ⚙️
        </Button>
      </div>
    </main>
  );
}
