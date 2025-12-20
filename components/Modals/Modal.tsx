"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";
import Button from "@/components/Button/Button";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
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
  return createPortal(
    <div className={css.backdrop} onClick={onClose} role="presentation">
      {" "}
      <div
        className={css.modal}
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Modal"}
      >
        {" "}
        <header className={css.header}>
          {" "}
          {title ? <h3 className={css.title}>{title}</h3> : <div />}{" "}
          <Button
            variant="icon"
            className={css.closeBtn}
            aria-label="Close modal"
            title="Close"
            onClick={onClose}
          >
            {" "}
            ✕{" "}
          </Button>{" "}
        </header>{" "}
        <div className={css.content}>{children}</div>{" "}
      </div>{" "}
    </div>,
    document.body
  );
}
