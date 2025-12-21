"use client";

import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import css from "./BookingForm.module.css";

import type { Booking } from "@/types/booking";
import { useBookingStore } from "@/store/bookingStore";
import { useUserStore } from "@/store/userStore";

import Button from "@/components/Button/Button";
import Dropdown, { DropdownOption } from "@/components/Dropdown/Dropdown";
import DateDropdown from "@/components/DateDropdown/DateDropdown";

import { buildTimeOptions } from "@/utils/time";

type FormValues = {
  businessId: string;

  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;

  notes: string;
};

type BusinessOption = { id: string; label: string };

type Props = {
  businessOptions: BusinessOption[];
  mode?: "create" | "edit";
  booking?: Booking | null;

  /** Викликаємо після успішного create/update (для закриття модалки, тощо) */
  onSuccess?: () => void;

  /** Кнопка Cancel (зазвичай = onClose з модалки) */
  onCancel?: () => void;
};

function toIso(date: string, time: string) {
  return new Date(`${date}T${time}`).toISOString();
}

function toMs(date: string, time: string) {
  return new Date(`${date}T${time}`).getTime();
}

function toDateInputValue(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toTimeValue(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export default function BookingForm({
  businessOptions,
  mode = "create",
  booking = null,
  onSuccess,
  onCancel,
}: Props) {
  const router = useRouter();
  const activeUser = useUserStore((s) => s.activeUser);

  const createBooking = useBookingStore((s) => s.createBooking);
  const updateBooking = useBookingStore((s) => s.updateBooking);
  const isLoading = useBookingStore((s) => s.isLoading);
  const error = useBookingStore((s) => s.error);

  const businessDropdownOptions: DropdownOption[] = businessOptions.map(
    (b) => ({
      value: b.id,
      label: b.label,
    })
  );

  const timeOptions: DropdownOption[] = buildTimeOptions(30);

  const isEdit = mode === "edit";
  const canEdit = isEdit && Boolean(booking);

  if (!activeUser) {
    return <p className={css.info}>Please select an active user first.</p>;
  }

  if (activeUser.role !== "client") {
    return <p className={css.info}>Only client users can create bookings.</p>;
  }

  if (isEdit && !booking) {
    return <p className={css.info}>Booking not found.</p>;
  }

  const initialValues: FormValues = canEdit
    ? {
        businessId:
          booking!.businessId?._id ?? (booking!.businessId as any) ?? "",
        startDate: toDateInputValue(booking!.startAt),
        startTime: toTimeValue(booking!.startAt),
        endDate: toDateInputValue(booking!.endAt),
        endTime: toTimeValue(booking!.endAt),
        notes: booking!.notes ?? "",
      }
    : {
        businessId: businessDropdownOptions[0]?.value ?? "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        notes: "",
      };

  return (
    <Formik<FormValues>
      enableReinitialize
      initialValues={initialValues}
      validate={(values) => {
        const errors: Partial<Record<keyof FormValues, string>> = {};

        if (!values.businessId) errors.businessId = "Business is required";

        if (!values.startDate) errors.startDate = "Start date is required";
        if (!values.startTime) errors.startTime = "Start time is required";

        if (!values.endDate) errors.endDate = "End date is required";
        if (!values.endTime) errors.endTime = "End time is required";

        const hasStart = values.startDate && values.startTime;
        const hasEnd = values.endDate && values.endTime;

        if (hasStart && hasEnd) {
          const startMs = toMs(values.startDate, values.startTime);
          const endMs = toMs(values.endDate, values.endTime);

          if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) {
            errors.endTime = "Invalid date/time";
          } else if (startMs >= endMs) {
            errors.endTime = "End must be after start";
          }
        }

        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => {
        const payload = {
          startAt: toIso(values.startDate, values.startTime),
          endAt: toIso(values.endDate, values.endTime),
          notes: values.notes.trim() || undefined,
        };

        let ok = false;

        if (mode === "create") {
          const created = await createBooking({
            clientId: activeUser._id,
            businessId: values.businessId,
            ...payload,
          });
          ok = Boolean(created);
        } else if (mode === "edit" && booking) {
          const updated = await updateBooking(booking._id, payload);
          ok = Boolean(updated);
        }

        setSubmitting(false);

        if (ok) {
          onSuccess?.();

          if (mode === "create") router.push("/dashboard");
        }
      }}
    >
      {({
        errors,
        touched,
        isSubmitting,
        setFieldValue,
        setFieldTouched,
        values,
      }) => (
        <div className={css.formWrapper}>
          <Form className={css.form}>
            <div className={css.field}>
              <Dropdown
                label="Business"
                value={values.businessId}
                options={businessDropdownOptions}
                placeholder="Select a business"
                disabled={
                  isLoading ||
                  isSubmitting ||
                  businessDropdownOptions.length === 0 ||
                  isEdit
                }
                onChange={(v) => {
                  setFieldValue("businessId", v);
                  setFieldTouched("businessId", true, false);
                }}
              />
              {isEdit ? (
                <p className={css.hint}>
                  Business cannot be changed in edit mode.
                </p>
              ) : null}

              {touched.businessId && errors.businessId && (
                <p className={css.error}>{errors.businessId}</p>
              )}
            </div>

            <div className={css.field}>
              <div className={css.label}>Start</div>

              <div className={css.row2}>
                <div className={css.subField}>
                  <DateDropdown
                    value={values.startDate}
                    placeholder="dd.mm.yyyy"
                    disabled={isLoading || isSubmitting}
                    onChange={(v) => {
                      setFieldValue("startDate", v);
                      setFieldTouched("startDate", true, false);

                      if (!values.endDate) {
                        setFieldValue("endDate", v);
                      }
                    }}
                  />
                  {touched.startDate && errors.startDate && (
                    <p className={css.error}>{errors.startDate}</p>
                  )}
                </div>

                <div className={css.subField}>
                  <Dropdown
                    value={values.startTime}
                    options={timeOptions}
                    placeholder="HH:mm"
                    disabled={isLoading || isSubmitting}
                    onChange={(v) => {
                      setFieldValue("startTime", v);
                      setFieldTouched("startTime", true, false);
                    }}
                  />
                  {touched.startTime && errors.startTime && (
                    <p className={css.error}>{errors.startTime}</p>
                  )}
                </div>
              </div>
            </div>

            <div className={css.field}>
              <div className={css.label}>End</div>

              <div className={css.row2}>
                <div className={css.subField}>
                  <DateDropdown
                    value={values.endDate}
                    placeholder="dd.mm.yyyy"
                    disabled={isLoading || isSubmitting}
                    onChange={(v) => {
                      setFieldValue("endDate", v);
                      setFieldTouched("endDate", true, false);
                    }}
                  />
                  {touched.endDate && errors.endDate && (
                    <p className={css.error}>{errors.endDate}</p>
                  )}
                </div>

                <div className={css.subField}>
                  <Dropdown
                    value={values.endTime}
                    options={timeOptions}
                    placeholder="HH:mm"
                    disabled={isLoading || isSubmitting}
                    onChange={(v) => {
                      setFieldValue("endTime", v);
                      setFieldTouched("endTime", true, false);
                    }}
                  />
                  {touched.endTime && errors.endTime && (
                    <p className={css.error}>{errors.endTime}</p>
                  )}
                </div>
              </div>
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
                disabled={isLoading || isSubmitting}
              />
            </div>

            {error ? <p className={css.error}>{error}</p> : null}

            <div className={css.actions}>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading
                  ? isEdit
                    ? "Saving…"
                    : "Creating…"
                  : isEdit
                    ? "Save changes"
                    : "Create booking"}
              </Button>

              {onCancel ? (
                <Button
                  variant="secondary"
                  onClick={onCancel}
                  disabled={isSubmitting || isLoading}
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
}
