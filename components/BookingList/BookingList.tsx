"use client";

import type { Booking } from "@/types/booking";
import BookingCard from "@/components/BookingCard/BookingCard";
import css from "./BookingList.module.css";

import { ClipLoader } from "react-spinners";

type Props = {
  bookings?: Booking[] | null;
  view: "client" | "business";
  isLoading: boolean;
  error: string | null;

  onCancel: (id: string) => Promise<boolean>;
  onDelete?: (id: string) => Promise<boolean>;
  onEdit?: (booking: Booking) => void;
};

export default function BookingList({
  bookings,
  view,
  isLoading,
  error,
  onCancel,
  onDelete,
  onEdit,
}: Props) {
  const safeBookings: Booking[] = Array.isArray(bookings) ? bookings : [];

  if (isLoading) {
    return (
      <div className={css.loader} aria-label="Loading bookings">
        <ClipLoader size={42} color="var(--color-deco)" />
      </div>
    );
  }

  if (error) {
    return <p className={css.error}>{error}</p>;
  }

  if (safeBookings.length === 0) {
    return <p className={css.message}>No bookings yet.</p>;
  }

  return (
    <ul className={css.list}>
      {safeBookings.map((booking) => (
        <BookingCard
          key={booking._id}
          booking={booking}
          view={view}
          onCancel={onCancel}
          onDelete={onDelete}
          onEdit={onEdit}
          isLoading={isLoading}
        />
      ))}
    </ul>
  );
}
