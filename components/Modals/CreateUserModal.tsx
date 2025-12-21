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
  onClose: () => void;
  onOpenSelect?: () => void;
};

export default function CreateUserModal({ onClose, onOpenSelect }: Props) {
  const createUser = useUserStore((s) => s.createUser);
  const isLoading = useUserStore((s) => s.isLoading);
  const apiError = useUserStore((s) => s.error);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("client");

  const [formError, setFormError] = useState<string>("");

  const canSubmit = useMemo(() => {
    if (isLoading) return false;
    return name.trim().length > 0 && email.trim().length > 0;
  }, [name, email, isLoading]);

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

  useEffect(() => {
    setFormError("");
  }, []);

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
    <>
      {formError ? <div className={css.errorBox}>{formError}</div> : null}

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
            onChange={(e) => setName(e.target.value)}
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

        <div className={css.actions}>
          <Button
            type="submit"
            variant="primary"
            disabled={!canSubmit}
            className={css.btnCreate}
          >
            {isLoading ? "Creating…" : "Create"}
          </Button>

          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>

        {onOpenSelect && (
          <div className={css.footer}>
            <Button
              variant="secondary"
              onClick={() => {
                handleClose();
                onOpenSelect();
              }}
              disabled={isLoading}
            >
              Log in
            </Button>
          </div>
        )}
      </form>
    </>
  );
}
