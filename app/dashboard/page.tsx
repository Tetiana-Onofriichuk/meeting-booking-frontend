"use client";

import { useUserStore } from "@/store/userStore";
import BookingList from "@/components/BookingList/BookingList";

export default function DashboardPage() {
  const { activeUser } = useUserStore();

  if (!activeUser) {
    return (
      <main style={{ padding: "24px" }}>
        <h1>Dashboard</h1>
        <p>Please select a user to view bookings.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "24px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 600 }}>Dashboard</h1>

      <p style={{ marginTop: "8px", color: "#555" }}>
        Active user: <strong>{activeUser.name}</strong> ({activeUser.role})
      </p>

      <div style={{ marginTop: "24px" }}>
        {activeUser.role === "client" ? (
          <BookingList clientId={activeUser._id} />
        ) : (
          <BookingList businessId={activeUser._id} />
        )}
      </div>
    </main>
  );
}
