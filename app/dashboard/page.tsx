"use client";

import { useEffect } from "react";
import Link from "next/link";

import { useUserStore } from "@/store/userStore";
import { useBookingStore } from "@/store/bookingStore";

export default function DashboardPage() {
  const activeUser = useUserStore((s) => s.activeUser);

  const bookings = useBookingStore((s) => s.bookings);
  const isLoading = useBookingStore((s) => s.isLoading);
  const error = useBookingStore((s) => s.error);
  const fetchBookings = useBookingStore((s) => s.fetchBookings);
  const cancelBooking = useBookingStore((s) => s.cancelBooking);

  useEffect(() => {
    if (!activeUser) return;

    if (activeUser.role === "client") {
      fetchBookings({ clientId: activeUser._id });
    }

    if (activeUser.role === "business") {
      fetchBookings({ businessId: activeUser._id });
    }
  }, [activeUser, fetchBookings]);

  // 1) EmptyState якщо юзер не вибраний
  if (!activeUser) {
    return (
      <main className="container" style={{ padding: "32px 0" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
          Dashboard
        </h1>

        <p style={{ opacity: 0.8, marginBottom: 16 }}>
          First select or create a user.
        </p>
      </main>
    );
  }

  const isClient = activeUser.role === "client";
  const title = isClient ? "Мої бронювання" : "Бронювання до мене";

  return (
    <main className="container" style={{ padding: "32px 0" }}>
      <header
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
            {title}
          </h1>
          <p style={{ opacity: 0.75 }}>
            Активний користувач: <b>{activeUser.name}</b> ({activeUser.role})
          </p>
        </div>
      </header>

      {/* 2) Loading / error / empty */}
      {isLoading && <p>Завантаження...</p>}

      {!isLoading && error && <p style={{ color: "crimson" }}>{error}</p>}

      {!isLoading && !error && bookings.length === 0 && (
        <p style={{ opacity: 0.8 }}>Поки що немає бронювань.</p>
      )}

      {/* 3) List */}
      {!isLoading && !error && bookings.length > 0 && (
        <ul style={{ display: "grid", gap: 12, padding: 0, listStyle: "none" }}>
          {bookings.map((b) => {
            const otherUser = isClient ? b.businessId : b.clientId;

            return (
              <li
                key={b._id}
                style={{
                  border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: 14,
                  padding: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: 700 }}>
                      {isClient ? "Business" : "Client"}:{" "}
                      {otherUser?.name ?? "—"}
                    </p>
                    <p style={{ margin: 0, opacity: 0.75 }}>
                      {otherUser?.email ?? ""}
                    </p>
                  </div>

                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      border: "1px solid rgba(0,0,0,0.15)",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      opacity: b.status === "canceled" ? 0.6 : 1,
                    }}
                    title="booking status"
                  >
                    {b.status}
                  </span>
                </div>

                <p style={{ margin: "0 0 6px 0" }}>
                  <b>Start:</b> {new Date(b.startAt).toLocaleString()}
                </p>
                <p style={{ margin: "0 0 6px 0" }}>
                  <b>End:</b> {new Date(b.endAt).toLocaleString()}
                </p>

                {b.notes && (
                  <p style={{ margin: 0, opacity: 0.85 }}>
                    <b>Notes:</b> {b.notes}
                  </p>
                )}

                {/* Business може скасовувати active */}
                {!isClient && b.status === "active" && (
                  <div style={{ marginTop: 10 }}>
                    <button
                      type="button"
                      onClick={() => cancelBooking(b._id)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 999,
                        border: "1px solid rgba(0,0,0,0.2)",
                        background: "transparent",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Cancel booking
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
