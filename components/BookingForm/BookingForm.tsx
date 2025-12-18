"use client";

import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/store/bookingStore";
import { useUserStore } from "@/store/userStore";
import css from "./BookingForm.module.css";

type FormValues = {
  businessId: string;
  startAt: string;
  endAt: string;
  notes: string;
};

export default function BookingForm() {
  const router = useRouter();
  const { activeUser } = useUserStore();
  const { createBooking, isLoading, error } = useBookingStore();

  const initialValues: FormValues = {
    businessId: "",
    startAt: "",
    endAt: "",
    notes: "",
  };

  if (!activeUser) {
    return <p className={css.info}>Please select an active user first.</p>;
  }

  if (activeUser.role !== "client") {
    return <p className={css.info}>Only client users can create bookings.</p>;
  }

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validate={(values) => {
        const errors: Partial<FormValues> = {};

        if (!values.businessId) errors.businessId = "Business ID is required";
        if (!values.startAt) errors.startAt = "Start time is required";
        if (!values.endAt) errors.endAt = "End time is required";

        if (
          values.startAt &&
          values.endAt &&
          new Date(values.startAt) >= new Date(values.endAt)
        ) {
          errors.endAt = "End time must be after start time";
        }

        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => {
        const created = await createBooking({
          clientId: activeUser._id,
          businessId: values.businessId,
          startAt: new Date(values.startAt).toISOString(),
          endAt: new Date(values.endAt).toISOString(),
          notes: values.notes.trim() || undefined,
        });

        setSubmitting(false);

        if (created) {
          router.push("/dashboard");
        }
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.field}>
            <label className={css.label} htmlFor="businessId">
              Business ID
            </label>
            <Field
              id="businessId"
              name="businessId"
              placeholder="Paste business user ID"
              className={css.input}
            />
            {touched.businessId && errors.businessId && (
              <p className={css.error}>{errors.businessId}</p>
            )}
          </div>

          <div className={css.field}>
            <label className={css.label} htmlFor="startAt">
              Start
            </label>
            <Field
              id="startAt"
              name="startAt"
              type="datetime-local"
              className={css.input}
            />
            {touched.startAt && errors.startAt && (
              <p className={css.error}>{errors.startAt}</p>
            )}
          </div>

          <div className={css.field}>
            <label className={css.label} htmlFor="endAt">
              End
            </label>
            <Field
              id="endAt"
              name="endAt"
              type="datetime-local"
              className={css.input}
            />
            {touched.endAt && errors.endAt && (
              <p className={css.error}>{errors.endAt}</p>
            )}
          </div>

          <div className={css.field}>
            <label className={css.label} htmlFor="notes">
              Notes
            </label>
            <Field
              id="notes"
              as="textarea"
              name="notes"
              rows={4}
              placeholder="Optional"
              className={`${css.input} ${css.textarea}`}
            />
          </div>

          {error && <p className={css.error}>{error}</p>}

          <button
            type="submit"
            className={css.submit}
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? "Creating…" : "Create booking"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
