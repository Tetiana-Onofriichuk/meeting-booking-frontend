"use client";

import { useEffect } from "react";
import css from "./SelectUserModal.module.css";
import { useUserStore } from "@/store/userStore";
import Button from "@/components/Button/Button";

type Props = {
  onClose: () => void;
  onOpenCreate?: () => void;
};

export default function SelectUserContent({ onClose, onOpenCreate }: Props) {
  const { users, fetchUsers, setActiveUser, isLoading, error } = useUserStore();

  useEffect(() => {
    if (users.length === 0) fetchUsers();
  }, [users.length, fetchUsers]);

  return (
    <div className="body">
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
              onOpenCreate();
            }}
          >
            Sign up
          </Button>
        </div>
      )}
    </div>
  );
}
