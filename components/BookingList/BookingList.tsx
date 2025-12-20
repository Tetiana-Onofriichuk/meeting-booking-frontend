"use client";

import type { Booking } from "@/types/booking";
import BookingCard from "@/components/BookingCard/BookingCard";
import css from "./BookingList.module.css";

type Props = {
  bookings: Booking[];
  view: "client" | "business";
  isLoading: boolean;
  error: string | null;
  onCancel: (id: string) => Promise<boolean>;
  onEdit?: (booking: Booking) => void;
};

export default function BookingList({
  bookings,
  view,
  isLoading,
  error,
  onCancel,
  onEdit,
}: Props) {
  if (isLoading) {
    return <p className={css.message}>Loading...</p>;
  }

  if (error) {
    return <p className={css.error}>{error}</p>;
  }

  if (bookings.length === 0) {
    return <p className={css.message}>No bookings yet.</p>;
  }

  return (
    <ul className={css.list}>
      {bookings.map((booking) => (
        <BookingCard
          key={booking._id}
          booking={booking}
          view={view}
          onCancel={onCancel}
          onEdit={onEdit}
          isLoading={isLoading}
        />
      ))}
    </ul>
  );
}
