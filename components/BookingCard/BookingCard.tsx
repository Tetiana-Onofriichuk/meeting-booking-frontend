"use client";

import type { Booking } from "@/types/booking";
import { useBookingStore } from "@/store/bookingStore";
import styles from "./BookingCard.module.css";

type Props = {
  booking: Booking;
};

export default function BookingCard({ booking }: Props) {
  const { cancelBooking, isLoading } = useBookingStore();

  const handleCancel = async () => {
    await cancelBooking(booking._id);
  };

  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <div className={styles.title}>
          {booking.clientId.name} → {booking.businessId.name}
        </div>

        <span className={styles.badge}>{booking.status}</span>
      </div>

      <div className={styles.time}>
        {new Date(booking.startAt).toLocaleString()} –{" "}
        {new Date(booking.endAt).toLocaleString()}
      </div>

      {booking.notes ? <p className={styles.notes}>{booking.notes}</p> : null}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={handleCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
