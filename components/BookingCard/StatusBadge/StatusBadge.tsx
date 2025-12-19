import css from "./StatusBadge.module.css";
import type { BookingStatus } from "@/types/booking";

type Props = {
  status: BookingStatus;
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`${css.badge} ${
        status === "active" ? css.active : css.canceled
      }`}
      title="Booking status"
    >
      {status}
    </span>
  );
}
