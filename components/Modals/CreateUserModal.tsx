"use client";

import { useEffect, useMemo, useState } from "react";
import css from "./CreateUserModal.module.css";
import { useUserStore } from "@/store/userStore";
import Button from "@/components/Button/Button";
import Dropdown, { DropdownOption } from "@/components/Dropdown/Dropdown";
import { validateUserForm } from "@/lib/userValidators";

type Role = "client" | "business";

const ROLE_OPTIONS: DropdownOption[] = [
  { value: "client", label: "client" },
  { value: "business", label: "business" },
];

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
  const createUser = useUserStore((s) => s.createUser);
  const isLoading = useUserStore((s) => s.isLoading);
  const apiError = useUserStore((s) => s.error);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("client");

  // помилка саме форми (валідація) — показуємо тільки після submit
  const [formError, setFormError] = useState<string>("");

  // ESC close
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // reset only local error on open
  useEffect(() => {
    if (!open) return;
    setFormError("");
  }, [open]);

  const canSubmit = useMemo(() => {
    if (isLoading) return false;
    return name.trim().length > 0 && email.trim().length > 0;
  }, [name, email, isLoading]);

  if (!open) return null;

  const resetForm = () => {
    setName("");
    setEmail("");
    setRole("client");
    setFormError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const submit = async () => {
    setFormError("");

    const err = validateUserForm({ name, email });
    if (err) {
      setFormError(err);
      return;
    }

    const created = await createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
    });

    if (created) {
      resetForm();
      onClose();
    }
  };

  return (
    <div className={css.backdrop} onMouseDown={handleClose} role="presentation">
      <div
        className={css.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Create user"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={css.head}>
          <h3 className={css.title}>Sign up</h3>
          <Button variant="icon" onClick={handleClose} aria-label="Close">
            ✕
          </Button>
        </div>

        {/* Form validation error (priority) */}
        {formError ? <div className={css.errorBox}>{formError}</div> : null}

        {/* API error */}
        {!formError && apiError ? (
          <div className={css.errorBox}>{apiError}</div>
        ) : null}

        <form
          className={css.body}
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <label className={css.field}>
            <span className={css.label}>Name (max 8 chars)</span>
            <input
              className={css.input}
              value={name}
              onChange={(e) => setName(e.target.value)} // ✅ НЕ обрізаємо
              placeholder="e.g. Tetiana"
              autoFocus
              disabled={isLoading}
            />
          </label>

          <label className={css.field}>
            <span className={css.label}>Email</span>
            <input
              className={css.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mail@example.com"
              disabled={isLoading}
              inputMode="email"
              autoComplete="email"
            />
          </label>

          <Dropdown
            label="Role"
            value={role}
            options={ROLE_OPTIONS}
            disabled={isLoading}
            onChange={(v) => setRole(v as Role)}
          />

          <Button type="submit" variant="primary" disabled={!canSubmit}>
            {isLoading ? "Creating…" : "Create"}
          </Button>

          {onOpenSelect && (
            <div className={css.footer}>
              <Button
                variant="secondary"
                onClick={() => {
                  handleClose();
                  onOpenSelect?.();
                }}
              >
                Log in
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
