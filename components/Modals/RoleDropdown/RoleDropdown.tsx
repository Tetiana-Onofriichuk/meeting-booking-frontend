"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import cn from "clsx";
import css from "./RoleDropdown.module.css";

export type Role = "client" | "business";

type Option = { value: Role; label: string };

type Props = {
  value: Role;
  onChange: (v: Role) => void;
  disabled?: boolean;
  label?: string;
};

const OPTIONS: Option[] = [
  { value: "client", label: "client" },
  { value: "business", label: "business" },
];

export default function RoleDropdown({
  value,
  onChange,
  disabled = false,
  label = "Роль",
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

  const currentLabel = useMemo(() => {
    return OPTIONS.find((o) => o.value === value)?.label ?? value;
  }, [value]);

  return (
    <div className={css.wrap} ref={rootRef}>
      <div className={css.label}>{label}</div>

      <button
        type="button"
        className={cn(css.trigger, open && css.open)}
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={css.value}>{currentLabel}</span>

        <span className={css.chevron} aria-hidden="true">
          <svg width="16" height="16">
            <use href="/sprite.svg#icon-chevron-down" />
          </svg>
        </span>
      </button>

      {open && (
        <ul className={css.menu} role="listbox">
          {OPTIONS.map((o) => {
            const selected = o.value === value;

            return (
              <li key={o.value} className={css.menuItem}>
                <button
                  type="button"
                  className={cn(css.option, selected && css.selected)}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                >
                  <span className={css.optionName}>{o.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
