"use client";

import { useState } from "react";
import Link from "next/link";
import css from "./UserPanel.module.css";
import { useUserStore } from "@/store/userStore";
import CreateUserModal from "@/components/Modals/CreateUserModal";
import SelectUserModal from "@/components/Modals/SelectUserModal";
import Button from "@/components/Button/Button";

export default function UserPanel() {
  const { activeUser, logout } = useUserStore();
  const [openCreate, setOpenCreate] = useState(false);
  const [openSelect, setOpenSelect] = useState(false);

  if (activeUser) {
    return (
      <div className={css.wrap}>
        <Link href="/dashboard" className={css.link}>
          <Button variant="secondary">Кабінет</Button>
        </Link>

        <Button variant="secondary" onClick={logout}>
          Вийти
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className={css.wrap}>
        <Button variant="secondary" onClick={() => setOpenSelect(true)}>
          Log in
        </Button>

        <Button variant="primary" onClick={() => setOpenCreate(true)}>
          Sign up
        </Button>
      </div>

      <SelectUserModal
        open={openSelect}
        onClose={() => setOpenSelect(false)}
        onOpenCreate={() => setOpenCreate(true)}
      />

      <CreateUserModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onOpenSelect={() => setOpenSelect(true)}
      />
    </>
  );
}
