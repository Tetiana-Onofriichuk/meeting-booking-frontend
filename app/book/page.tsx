"use client";

import BookingForm from "@/components/BookingForm/BookingForm";

export default function BookPage() {
  return (
    <main style={{ padding: "24px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 600 }}>Book a meeting</h1>
      <p style={{ marginTop: "8px", color: "#555" }}>
        Fill the form to create a new booking.
      </p>

      <div style={{ marginTop: "24px" }}>
        <BookingForm />
      </div>
    </main>
  );
}
