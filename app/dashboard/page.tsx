"use client";

import { useEffect } from "react";

import EmptyState from "@/components/EmptyState/EmptyState";
import BookingList from "@/components/BookingList/BookingList";

import { useUserStore } from "@/store/userStore";
import { useBookingStore } from "@/store/bookingStore";

import css from "./Dashboard.module.css";

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
      return;
    }

    if (activeUser.role === "business") {
      fetchBookings({ businessId: activeUser._id });
    }
  }, [activeUser, fetchBookings]);

  if (!activeUser) {
    return (
      <main className="container">
        <EmptyState
          title="Dashboard"
          description="Please select or create a user to see bookings."
        />
      </main>
    );
  }

  const isClient = activeUser.role === "client";
  const title = isClient ? "My bookings" : "Bookings for my business";
  const view = isClient ? "client" : "business";

  return (
    <main className={css.page}>
      <div className="container">
        <header className={css.header}>
          <h1 className={css.title}>{title}</h1>
          <p className={css.subtitle}>
            Active user: <b>{activeUser.name}</b> ({activeUser.role})
          </p>
        </header>

        <BookingList
          bookings={bookings}
          view={view}
          isLoading={isLoading}
          error={error}
          onCancel={cancelBooking}
        />
      </div>
    </main>
  );
}
