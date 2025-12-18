"use client";

import { useEffect, useState } from "react";
import css from "./CreateUserModal.module.css";
import { useUserStore } from "@/store/userStore";
import Button from "@/components/Button/Button";
import RoleDropdown from "@/components/Modals/RoleDropdown/RoleDropdown";

type Role = "client" | "business";

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenSelect?: () => void;
};

export default function CreateUserModal({
  open,
  onClose,
  onOpenSelect,
}: Props) {
  const { createUser, isLoading, error } = useUserStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("client");

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
  }, [open]);

  if (!open) return null;

  const canSubmit =
    name.trim().length > 0 && email.trim().length > 0 && !isLoading;

  const submit = async () => {
    const created = await createUser({
      name: name.trim(),
      email: email.trim(),
      role,
    });

    if (created) {
      setName("");
      setEmail("");
      setRole("client");
      onClose();
    }
  };

  return (
    <div className={css.backdrop} onMouseDown={onClose} role="presentation">
      <div
        className={css.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Create user"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={css.head}>
          <h3 className={css.title}>Sign up</h3>
          <Button variant="icon" onClick={onClose} aria-label="Close">
            ✕
          </Button>
        </div>

        {error ? <div className={css.errorBox}>{error}</div> : null}

        <div className={css.body}>
          <label className={css.field}>
            <span className={css.label}>Name (max 8 chars)</span>
            <input
              className={css.input}
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 8))}
              placeholder="Напр. Tetiana"
              autoFocus
            />
          </label>

          <label className={css.field}>
            <span className={css.label}>Email</span>
            <input
              className={css.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mail@example.com"
            />
          </label>

          <RoleDropdown value={role} onChange={setRole} disabled={isLoading} />

          <Button variant="primary" disabled={!canSubmit} onClick={submit}>
            {isLoading ? "Creating…" : "Create"}
          </Button>

          {onOpenSelect && (
            <div className={css.footer}>
              <Button
                variant="secondary"
                onClick={() => {
                  onClose();
                  onOpenSelect?.();
                }}
              >
                Log in
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
