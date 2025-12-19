"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import cn from "clsx";
import css from "./DateDropdown.module.css";

type Props = {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

function toYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fromYmd(v: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  const [y, m, d] = v.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

function displayUaLike(v: string): string {
  const d = fromYmd(v);
  if (!d) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const mon = String(d.getMonth() + 1).padStart(2, "0");
  const y = d.getFullYear();
  return `${day}.${mon}.${y}`;
}

export default function DateDropdown({
  value,
  onChange,
  label,
  placeholder = "dd.mm.yyyy",
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const selected = useMemo(() => fromYmd(value), [value]);
  const shown = value ? displayUaLike(value) : "";

  return (
    <div className={css.wrap} ref={rootRef}>
      {label ? <div className={css.label}>{label}</div> : null}

      <button
        type="button"
        className={cn(css.trigger, open && css.open)}
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={cn(css.value, !value && css.placeholder)}>
          {shown || placeholder}
        </span>

        <span className={css.icon} aria-hidden="true">
          <svg width="18" height="18">
            <use href="/sprite.svg#icon-calendar" />
          </svg>
        </span>
      </button>

      {open && (
        <div className={css.popover} role="dialog" aria-label="Choose date">
          <DayPicker
            mode="single"
            selected={selected ?? undefined}
            onSelect={(d) => {
              if (!d) return;
              onChange(toYmd(d));
              setOpen(false);
            }}
            weekStartsOn={1}
            classNames={{
              root: css.dpRoot,
              months: css.dpMonths,
              month: css.dpMonth,
              caption: css.dpCaption,
              caption_label: css.dpCaptionLabel,
              nav: css.dpNav,
              nav_button: css.dpNavBtn,
              table: css.dpTable,
              head_row: css.dpHeadRow,
              head_cell: css.dpHeadCell,
              row: css.dpRow,
              cell: css.dpCell,
              day: css.dpDay,
              day_button: css.dpDayBtn,
              day_selected: css.dpSelected,
              day_today: css.dpToday,
              day_outside: css.dpOutside,
            }}
          />
          <div className={css.actions}>
            <button
              type="button"
              className={css.smallBtn}
              onClick={() => onChange("")}
            >
              Clear
            </button>
            <button
              type="button"
              className={css.smallBtn}
              onClick={() => {
                onChange(toYmd(new Date()));
                setOpen(false);
              }}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
