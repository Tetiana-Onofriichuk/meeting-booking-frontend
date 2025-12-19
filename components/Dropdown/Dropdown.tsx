"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import cn from "clsx";
import css from "./Dropdown.module.css";

export type DropdownOption = { value: string; label: string };

type Props = {
  value: string;
  onChange: (v: string) => void;
  options: DropdownOption[];
  disabled?: boolean;
  label?: string;
  placeholder?: string;
};

export default function Dropdown({
  value,
  onChange,
  options,
  disabled = false,
  label,
  placeholder = "Select…",
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
    if (!value) return placeholder;
    return options.find((o) => o.value === value)?.label ?? placeholder;
  }, [value, options, placeholder]);

  return (
    <div className={css.wrap} ref={rootRef}>
      {label ? <div className={css.label}>{label}</div> : null}

      <button
        type="button"
        className={cn(css.trigger, open && css.open)}
        onClick={() => setOpen((v) => !v)}
        disabled={disabled || options.length === 0}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={cn(css.value, !value && css.placeholder)}>
          {currentLabel}
        </span>

        <span className={css.chevron} aria-hidden="true">
          <svg width="16" height="16">
            <use href="/sprite.svg#icon-chevron-down" />
          </svg>
        </span>
      </button>

      {open && (
        <ul className={css.menu} role="listbox">
          {options.map((o) => {
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
