"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import css from "./BookPage.module.css";
import Button from "@/components/Button/Button";
import BookingForm from "@/components/BookingForm/BookingForm";
import { useUserStore } from "@/store/userStore";
import { getBusinesses } from "@/lib/apiClient";
import type { User } from "@/types/user";

type BusinessOption = { id: string; label: string };

export default function BookPage() {
  // ✅ Hooks завжди на верхньому рівні
  const { activeUser } = useUserStore();

  const [businesses, setBusinesses] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const canCreate = Boolean(activeUser) && activeUser?.role === "client";

  useEffect(() => {
    // ✅ ефект теж викликається завжди, але всередині є guard
    if (!canCreate) return;

    let mounted = true;

    const run = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const list = await getBusinesses();
        if (!mounted) return;
        setBusinesses(list);
      } catch (e) {
        if (!mounted) return;
        const msg =
          e instanceof Error ? e.message : "Failed to load businesses";
        setLoadError(msg);
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [canCreate]);

  // ✅ Тепер guards — після хуків
  if (!activeUser) {
    return (
      <section className={css.page}>
        <div className={css.card}>
          <h1 className={css.title}>Book a meeting</h1>
          <p className={css.text}>
            Please select an active user on the Dashboard to create a booking.
          </p>

          <div className={css.actions}>
            <Link href="/dashboard">
              <Button type="button">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (activeUser.role !== "client") {
    return (
      <section className={css.page}>
        <div className={css.card}>
          <h1 className={css.title}>Book a meeting</h1>
          <p className={css.text}>
            Only clients can create bookings. Switch active user to a client on
            the Dashboard.
          </p>

          <div className={css.actions}>
            <Link href="/dashboard">
              <Button type="button">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const businessOptions: BusinessOption[] = businesses.map((b) => ({
    id: b._id,
    label: `${b.name} — ${b.email}`,
  }));

  return (
    <section className={css.page}>
      <div className={css.header}>
        <h1 className={css.title}>Create booking</h1>
        <p className={css.subtitle}>
          Choose a business, pick a time range, and add notes (optional).
        </p>
      </div>

      <div className={css.card}>
        {isLoading && <p className={css.text}>Loading businesses…</p>}
        {loadError && <p className={css.error}>{loadError}</p>}

        {!isLoading && !loadError && businesses.length === 0 && (
          <p className={css.text}>No businesses available.</p>
        )}

        {!isLoading && !loadError && businesses.length > 0 && (
          <BookingForm businessOptions={businessOptions} />
        )}
      </div>
    </section>
  );
}
