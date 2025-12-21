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
  const deleteBooking = useBookingStore((s) => s.deleteBooking);

  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const isClient = activeUser?.role === "client";
  const view: "client" | "business" = isClient ? "client" : "business";
  const title = isClient ? "My bookings" : "Bookings for my business";

  const fetchParams = useMemo(() => {
    if (!activeUser) return undefined;

    if (activeUser.role === "client") return { clientId: activeUser._id };
    return { businessId: activeUser._id };
  }, [activeUser]);

  useEffect(() => {
    if (!fetchParams) return;
    fetchBookings(fetchParams);
  }, [fetchParams, fetchBookings]);

  useEffect(() => {
    if (!activeUser) return;
    if (users.length === 0) fetchUsers();
  }, [activeUser, users.length, fetchUsers]);

  const businessOptions = useMemo(() => {
    return users
      .filter((u) => u.role === "business")
      .map((u) => ({ id: u._id, label: u.name }));
  }, [users]);

  const closeEdit = async () => {
    setEditingBooking(null);

    if (!fetchParams) return;
    await fetchBookings(fetchParams);
  };

  const handleCancel = async (id: string) => {
    const ok = await cancelBooking(id);

    if (editingBooking?._id === id) {
      await closeEdit();
      return ok;
    }

    if (ok && fetchParams) {
      await fetchBookings(fetchParams);
    }

    return ok;
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteBooking(id);

    if (editingBooking?._id === id) {
      setEditingBooking(null);
    }

    return ok;
  };

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
          onCancel={handleCancel}
          onDelete={handleDelete}
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
