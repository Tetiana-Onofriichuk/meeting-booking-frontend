"use client";

import { useEffect, useState } from "react";
import css from "./ProfilePage.module.css";

import EmptyState from "@/components/EmptyState/EmptyState";
import Button from "@/components/Button/Button";
import ConfirmDeleteUserModal from "@/components/ConfirmDeleteUserModal/ConfirmDeleteUserModal";

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
  const deleteUser = useUserStore((s) => s.deleteUser);

  const isLoading = useUserStore((s) => s.isLoading);
  const storeError = useUserStore((s) => s.error);

  const [mode, setMode] = useState<"view" | "edit">("view");
  const [form, setForm] = useState<FormState>({ name: "", email: "" });

  const [saveError, setSaveError] = useState<string>("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string>("");

  useEffect(() => {
    if (!activeUser) return;

    setForm({
      name: activeUser.name ?? "",
      email: activeUser.email ?? "",
    });

    setMode("view");
    setSaveError("");
    setDeleteError("");
    setIsDeleteOpen(false);
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

  const handleCancelEdit = () => {
    setForm({
      name: activeUser.name ?? "",
      email: activeUser.email ?? "",
    });
    setSaveError("");
    setMode("view");
  };

  const handleSave = async () => {
    setSaveError("");

    const err = validateUserForm(form);
    if (err) {
      setSaveError(err);
      return;
    }

    const updated = await updateUser(activeUser._id, {
      name: form.name.trim(),
      email: form.email.trim(),
    });

    if (!updated) {
      setSaveError(storeError || "Failed to update profile.");
      return;
    }

    setMode("view");
  };

  const openDelete = () => {
    setDeleteError("");
    setIsDeleteOpen(true);
  };

  const closeDelete = () => {
    if (isLoading) return;
    setDeleteError("");
    setIsDeleteOpen(false);
  };

  const confirmDelete = async () => {
    setDeleteError("");

    const success = await deleteUser(activeUser._id);

    if (!success) {
      setDeleteError(storeError || "Failed to delete user.");
      return;
    }

    setIsDeleteOpen(false);
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

              <div className={css.delete}>
                <Button
                  type="button"
                  variant="secondary"
                  className={css.deleteBtn}
                  onClick={openDelete}
                  disabled={isLoading}
                >
                  Delete user
                </Button>
              </div>

              <div className={css.logout}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={logout}
                  disabled={isLoading}
                >
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </label>

                <div className={css.editActions}>
                  <Button type="submit" variant="primary" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save"}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancelEdit}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>

                {saveError ? <p className={css.error}>{saveError}</p> : null}
              </form>

              <div className={css.delete}>
                <Button
                  type="button"
                  variant="secondary"
                  className={css.deleteBtn}
                  onClick={openDelete}
                  disabled={isLoading}
                >
                  Delete user
                </Button>
              </div>

              <div className={css.logout}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={logout}
                  disabled={isLoading}
                >
                  Logout
                </Button>
              </div>
            </>
          )}

          <ConfirmDeleteUserModal
            open={isDeleteOpen}
            userName={activeUser.name}
            isLoading={isLoading}
            error={deleteError}
            onClose={closeDelete}
            onConfirm={confirmDelete}
          />
        </div>
      </div>
    </section>
  );
}
