"use client";

import { useEffect } from "react";
import css from "./ConfirmDeleteUserModal.module.css";
import Button from "@/components/Button/Button";

type Props = {
  open: boolean;
  userName?: string;
  isLoading?: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteUserModal({
  open,
  userName,
  isLoading = false,
  error = null,
  onClose,
  onConfirm,
}: Props) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={css.backdrop} onMouseDown={onClose} role="presentation">
      <div
        className={css.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Confirm delete user"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={css.head}>
          <h3 className={css.title}>Delete user</h3>
          <Button variant="icon" onClick={onClose} aria-label="Close">
            ✕
          </Button>
        </div>

        <p className={css.text}>
          Are you sure you want to delete{" "}
          <span className={css.strong}>{userName || "this user"}</span>?
          <br />
          This action cannot be undone.
        </p>

        {error ? <div className={css.errorBox}>{error}</div> : null}

        <div className={css.actions}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            className={css.dangerBtn}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
