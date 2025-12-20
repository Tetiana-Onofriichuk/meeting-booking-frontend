"use client";

import { useState } from "react";
import Link from "next/link";
import css from "./UserPanel.module.css";

import { useUserStore } from "@/store/userStore";
import Button from "@/components/Button/Button";
import Modal from "@/components/Modals/Modal";

import SelectUserModal from "@/components/Modals/SelectUserModal";
import CreateUserModal from "@/components/Modals/CreateUserModal";

export default function UserPanel() {
  const { activeUser, logout } = useUserStore();

  const [openCreate, setOpenCreate] = useState(false);
  const [openSelect, setOpenSelect] = useState(false);

  if (activeUser) {
    return (
      <div className={css.wrap}>
        <Link href="/profile" className={css.link}>
          <Button variant="secondary">Profile</Button>
        </Link>

        <Button variant="secondary" onClick={logout}>
          Logout
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

      <Modal
        isOpen={openSelect}
        onClose={() => setOpenSelect(false)}
        title="Log in"
      >
        <SelectUserModal
          onClose={() => setOpenSelect(false)}
          onOpenCreate={() => {
            setOpenSelect(false);
            setOpenCreate(true);
          }}
        />
      </Modal>

      <Modal
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Sign up"
      >
        <CreateUserModal
          onClose={() => setOpenCreate(false)}
          onOpenSelect={() => {
            setOpenCreate(false);
            setOpenSelect(true);
          }}
        />
      </Modal>
    </>
  );
}
