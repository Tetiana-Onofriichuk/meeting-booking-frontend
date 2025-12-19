"use client";

import type { Booking } from "@/types/booking";
import css from "./BookingCard.module.css";

import StatusBadge from "@/components/BookingCard/StatusBadge/StatusBadge";
import Button from "@/components/Button/Button";

type Props = {
  booking: Booking;
  view: "client" | "business";
  onCancel?: (id: string) => void;
  isLoading?: boolean;
};

export default function BookingCard({
  booking,
  view,
  onCancel,
  isLoading = false,
}: Props) {
  const isClientView = view === "client";
  const otherUser = isClientView ? booking.businessId : booking.clientId;

  const canCancel = booking.status === "active";

  return (
    <li className={css.card}>
      <div className={css.container}>
        <div className={css.row}>
          <div className={css.title}>
            {isClientView ? "Business" : "Client"}:{" "}
            <span className={css.name}>{otherUser?.name ?? "—"}</span>
          </div>

          <StatusBadge status={booking.status} />
        </div>

        <div className={css.email}>{otherUser?.email ?? ""}</div>

        <div className={css.time}>
          {new Date(booking.startAt).toLocaleString()} –{" "}
          {new Date(booking.endAt).toLocaleString()}
        </div>

        {booking.notes && <p className={css.notes}>{booking.notes}</p>}
      </div>
      {canCancel && (
        <div className={css.actions}>
          <Button
            variant="secondary"
            onClick={() => onCancel?.(booking._id)}
            disabled={isLoading}
            className={css.cancelBtn}
          >
            Cancel booking
          </Button>
        </div>
      )}
    </li>
  );
}
