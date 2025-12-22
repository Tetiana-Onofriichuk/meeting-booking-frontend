"use client";

import { useEffect } from "react";
import css from "./SelectUserModal.module.css";

import { useUserStore } from "@/store/userStore";
import Button from "@/components/Button/Button";
import Loading from "@/app/loading";

type Props = {
  onClose: () => void;
  onOpenCreate?: () => void;
};

export default function SelectUserContent({ onClose, onOpenCreate }: Props) {
  const { users, fetchUsers, setActiveUser, isLoading, error } = useUserStore();

  useEffect(() => {
    if (users.length === 0 && !isLoading) {
      fetchUsers();
    }
  }, [users.length, isLoading, fetchUsers]);

  const isEmpty = users.length === 0;

  return (
    <div className={css.body}>
      {error && isEmpty ? (
        <div className={css.errorBox}>{error}</div>
      ) : isLoading && isEmpty ? (
        <Loading minHeight={220} size={36} label="Loading users" />
      ) : isEmpty ? (
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
            disabled={isLoading}
          >
            Sign up
          </Button>
        </div>
      )}
    </div>
  );
}
