"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";
import Button from "../Button/Button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: number;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 520,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const titleId = title ? "modal-title" : undefined;

  return createPortal(
    <div className={css.backdrop} onClick={onClose} role="presentation">
      <div
        className={css.modal}
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-label={!title ? "Modal" : undefined}
      >
        <header className={css.header}>
          {title ? (
            <h3 id={titleId} className={css.title}>
              {title}
            </h3>
          ) : (
            <div />
          )}

          <Button
            type="button"
            variant="icon"
            className={css.closeBtn}
            aria-label="Close modal"
            title="Close"
            onClick={onClose}
          >
            <svg width="20" height="20" aria-hidden="true" focusable="false">
              <use href="/sprite.svg#icon-close" />
            </svg>
          </Button>
        </header>

        <div className={css.content}>{children}</div>
      </div>
    </div>,
    document.body
  );
}
