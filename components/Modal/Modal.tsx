"use client";

import css from "./Modal.module.css";
import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";

interface NoteModalProps {
  onClose: () => void;
  children: React.ReactNode;
  labelledById?: string; // id <h2> для a11y
}

export default function NoteModal({
  onClose,
  children,
  labelledById,
}: NoteModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Закриття по Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // простий фокус-трап: якщо Tab виходить за межі, повертаємо на панель
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Локуємо скрол і запам'ятовуємо фокус
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      // Повертаємо фокус
      previouslyFocused.current?.focus?.();
    };
  }, [onClose]);

  // Автофокус на панель
  useEffect(() => {
    // якщо є фокусні елементи в панелі—фокус на перший, інакше на саму панель
    const panel = panelRef.current;
    if (!panel) return;
    const focusables = panel.querySelectorAll<HTMLElement>(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    (focusables[0] ?? panel).focus();
  }, []);

  const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      className={css.backdrop}
      onMouseDown={handleBackdropMouseDown}
      aria-hidden="true"
    >
      <div
        ref={panelRef}
        className={css.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledById}
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
