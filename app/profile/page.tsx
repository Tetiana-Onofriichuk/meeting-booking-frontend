"use client";

import { useEffect, useState } from "react";
import css from "./ProfilePage.module.css";

import EmptyState from "@/components/EmptyState/EmptyState";
import Button from "@/components/Button/Button";
import { useUserStore } from "@/store/userStore";
import { validateUserForm } from "@/lib/userValidators";

type FormState = {
  name: string;
  email: string;
};

export default function ProfilePage() {
  const activeUser = useUserStore((s) => s.activeUser);
  const logout = useUserStore((s) => s.logout);
  const updateUser = useUserStore((s) => s.updateUser);
  const storeLoading = useUserStore((s) => s.isLoading);
  const storeError = useUserStore((s) => s.error);

  const [mode, setMode] = useState<"view" | "edit">("view");
  const [form, setForm] = useState<FormState>({ name: "", email: "" });
  const [localError, setLocalError] = useState<string>("");

  useEffect(() => {
    if (!activeUser) return;

    setForm({
      name: activeUser.name ?? "",
      email: activeUser.email ?? "",
    });

    setMode("view");
    setLocalError("");
  }, [activeUser]);

  if (!activeUser) {
    return (
      <section className={css.section}>
        <div className="container">
          <EmptyState
            title="No active user"
            description="Select a user in the header to open your profile."
          />
        </div>
      </section>
    );
  }

  const handleChange =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleCancel = () => {
    setForm({
      name: activeUser.name ?? "",
      email: activeUser.email ?? "",
    });
    setLocalError("");
    setMode("view");
  };

  const handleSave = async () => {
    setLocalError("");

    const err = validateUserForm(form);
    if (err) {
      setLocalError(err);
      return;
    }

    const updated = await updateUser(activeUser._id, {
      name: form.name.trim(),
      email: form.email.trim(),
    });

    if (!updated) {
      setLocalError(storeError || "Failed to update profile.");
      return;
    }

    setMode("view");
  };

  return (
    <section className={css.section}>
      <div className="container">
        <div className={css.card}>
          <h1 className={css.title}>Profile</h1>
          <p className={css.subtitle}>Your account information</p>

          {mode === "view" ? (
            <>
              <ul className={css.list}>
                <li className={css.row}>
                  <span className={css.label}>Name</span>
                  <span className={css.value}>{activeUser.name}</span>
                </li>

                <li className={css.row}>
                  <span className={css.label}>Email</span>
                  <span className={css.value}>{activeUser.email}</span>
                </li>

                <li className={css.row}>
                  <span className={css.label}>Role</span>
                  <span className={css.value}>{activeUser.role}</span>
                </li>
              </ul>

              <div className={css.actions}>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setMode("edit")}
                >
                  Edit profile
                </Button>
              </div>

              <div className={css.logout}>
                <Button type="button" variant="secondary" onClick={logout}>
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <form
                className={css.form}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
              >
                <label className={css.field}>
                  <span className={css.fieldLabel}>Name (max 8 chars)</span>
                  <input
                    className={css.input}
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder="e.g. Tetiana"
                    autoComplete="name"
                    disabled={storeLoading}
                  />
                </label>

                <label className={css.field}>
                  <span className={css.fieldLabel}>Email</span>
                  <input
                    className={css.input}
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder="mail@example.com"
                    autoComplete="email"
                    inputMode="email"
                    disabled={storeLoading}
                  />
                </label>

                <div className={css.editActions}>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={storeLoading}
                  >
                    {storeLoading ? "Saving..." : "Save"}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={storeLoading}
                  >
                    Cancel
                  </Button>
                </div>

                {localError ? <p className={css.error}>{localError}</p> : null}
              </form>

              <div className={css.logout}>
                <Button type="button" variant="secondary" onClick={logout}>
                  Logout
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
