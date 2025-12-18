"use client";

import { useEffect } from "react";
import css from "./SelectUserModal.module.css";
import { useUserStore } from "@/store/userStore";
import Button from "@/components/Button/Button";

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenCreate?: () => void;
};

export default function SelectUserModal({
  open,
  onClose,
  onOpenCreate,
}: Props) {
  const { users, fetchUsers, setActiveUser, isLoading, error } = useUserStore();

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    if (users.length === 0) fetchUsers();
  }, [open, users.length, fetchUsers]);

  if (!open) return null;

  return (
    <div className={css.backdrop} onMouseDown={onClose} role="presentation">
      <div
        className={css.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Select user"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={css.head}>
          <h3 className={css.title}>Log in</h3>
          <Button variant="icon" onClick={onClose} aria-label="Close">
            ✕
          </Button>
        </div>

        {error && users.length === 0 ? (
          <div className={css.errorBox}>{error}</div>
        ) : isLoading && users.length === 0 ? (
          <div className={css.muted}>Loading…</div>
        ) : users.length === 0 ? (
          <div className={css.muted}>No users found. Create a new one.</div>
        ) : (
          <div className={css.list}>
            {users.map((u) => (
              <button
                key={u._id}
                type="button"
                className={css.userRow}
                onClick={() => {
                  setActiveUser(u);
                  onClose();
                }}
              >
                <span className={css.userName}>{u.name}</span>
                <span className={css.badge}>{u.role}</span>
              </button>
            ))}
          </div>
        )}

        {onOpenCreate && (
          <div className={css.footer}>
            <Button
              variant="secondary"
              onClick={() => {
                onClose();
                onOpenCreate?.();
              }}
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
