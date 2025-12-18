"use client";

import { useEffect } from "react";
import { useBookingStore } from "@/store/bookingStore";
import EmptyState from "@/components/EmptyState/EmptyState";
import styles from "./BookingList.module.css";

type Props = {
  clientId?: string;
  businessId?: string;
};

export default function BookingList({ clientId, businessId }: Props) {
  const { bookings, isLoading, error, fetchBookings } = useBookingStore();

  useEffect(() => {
    fetchBookings({ clientId, businessId });
  }, [clientId, businessId, fetchBookings]);

  if (isLoading) {
    return <p className={styles.state}>Loading bookings…</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (bookings.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul className={styles.list}>
      {bookings.map((booking) => (
        <li key={booking._id} className={styles.item}>
          <div className={styles.title}>
            {booking.clientId.name} → {booking.businessId.name}
          </div>

          <div className={styles.time}>
            {new Date(booking.startAt).toLocaleString()} –{" "}
            {new Date(booking.endAt).toLocaleString()}
          </div>

          <div className={styles.status}>Status: {booking.status}</div>
        </li>
      ))}
    </ul>
  );
}
