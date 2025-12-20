"use client";

import { useEffect, useMemo, useState } from "react";

import type { Booking } from "@/types/booking";

import EmptyState from "@/components/EmptyState/EmptyState";
import BookingList from "@/components/BookingList/BookingList";
import Modal from "@/components/Modals/Modal";
import BookingForm from "@/components/BookingForm/BookingForm";

import { useUserStore } from "@/store/userStore";
import { useBookingStore } from "@/store/bookingStore";

import css from "./Dashboard.module.css";

export default function DashboardPage() {
  const activeUser = useUserStore((s) => s.activeUser);

  const users = useUserStore((s) => s.users);
  const fetchUsers = useUserStore((s) => s.fetchUsers);

  const bookings = useBookingStore((s) => s.bookings);
  const isLoading = useBookingStore((s) => s.isLoading);
  const error = useBookingStore((s) => s.error);
  const fetchBookings = useBookingStore((s) => s.fetchBookings);
  const cancelBooking = useBookingStore((s) => s.cancelBooking);

  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // fetch bookings when active user changes
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

  // ensure users list exists (needed for businessOptions in BookingForm)
  useEffect(() => {
    if (!activeUser) return;
    if (users.length === 0) fetchUsers();
  }, [activeUser, users.length, fetchUsers]);

  const businessOptions = useMemo(() => {
    return users
      .filter((u) => u.role === "business")
      .map((u) => ({ id: u._id, label: u.name }));
  }, [users]);

  const closeEdit = () => setEditingBooking(null);

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
          onEdit={(b) => setEditingBooking(b)}
        />
      </div>

      <Modal
        isOpen={Boolean(editingBooking)}
        onClose={closeEdit}
        title="Edit booking"
      >
        {editingBooking ? (
          <BookingForm
            mode="edit"
            booking={editingBooking}
            businessOptions={businessOptions}
            onSuccess={closeEdit}
            onCancel={closeEdit}
          />
        ) : null}
      </Modal>
    </main>
  );
}
