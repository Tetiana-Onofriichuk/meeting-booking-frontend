import Link from "next/link";
import styles from "./EmptyState.module.css";

type Props = {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function EmptyState({
  title = "No bookings yet",
  description = "You don’t have any bookings. Create your first meeting.",
  ctaLabel = "Create meeting",
  ctaHref = "/book",
}: Props) {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>

      <Link href={ctaHref} className={styles.button}>
        {ctaLabel}
      </Link>
    </div>
  );
}
