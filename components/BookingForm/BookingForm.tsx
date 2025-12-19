"use client";

import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/store/bookingStore";
import { useUserStore } from "@/store/userStore";
import css from "./BookingForm.module.css";
import Button from "@/components/Button/Button";
import Dropdown, { DropdownOption } from "@/components/Dropdown/Dropdown";
import DateDropdown from "@/components/DateDropdown/DateDropdown";

// ✅ ПІДСТАВ СВІЙ РЕАЛЬНИЙ ШЛЯХ
import { buildTimeOptions } from "@/utils/time";

type FormValues = {
  businessId: string;

  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endDate: string;
  endTime: string;

  notes: string;
};

type BusinessOption = { id: string; label: string };

type Props = {
  businessOptions: BusinessOption[];
};

function toIso(date: string, time: string) {
  return new Date(`${date}T${time}`).toISOString();
}

function toMs(date: string, time: string) {
  return new Date(`${date}T${time}`).getTime();
}

export default function BookingForm({ businessOptions }: Props) {
  const router = useRouter();
  const { activeUser } = useUserStore();
  const { createBooking, isLoading, error } = useBookingStore();

  const businessDropdownOptions: DropdownOption[] = businessOptions.map(
    (b) => ({
      value: b.id,
      label: b.label,
    })
  );

  const timeOptions: DropdownOption[] = buildTimeOptions(30);

  const initialValues: FormValues = {
    businessId: businessDropdownOptions[0]?.value ?? "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
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
        const created = await createBooking({
          clientId: activeUser._id,
          businessId: values.businessId,
          startAt: toIso(values.startDate, values.startTime),
          endAt: toIso(values.endDate, values.endTime),
          notes: values.notes.trim() || undefined,
        });

        setSubmitting(false);

        if (created) router.push("/dashboard");
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
                  businessDropdownOptions.length === 0
                }
                onChange={(v) => {
                  setFieldValue("businessId", v);
                  setFieldTouched("businessId", true, false);
                }}
              />
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
              />
            </div>

            {error && <p className={css.error}>{error}</p>}

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? "Creating…" : "Create booking"}
            </Button>
          </Form>
        </div>
      )}
    </Formik>
  );
}
