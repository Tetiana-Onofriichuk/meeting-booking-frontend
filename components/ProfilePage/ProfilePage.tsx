"use client";

import Image from "next/image";
import css from "./ProfilePage.module.css";
import { useAuthStore } from "@/lib/store/authStore";
import type { User } from "@/types/user";

export default function ProfilePage() {
  const { user, isAuthenticated, clearIsAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <section className={css.wrapper}>
        <h1 className={css.title}>Profile</h1>
        <p className={css.muted}>You are not signed in.</p>
      </section>
    );
  }

  const { username, email, avatar } = user as User;

  const avatarSrc = avatar?.trim() ? avatar : "/images/avatar.png";

  return (
    <section className={css.wrapper}>
      <h1 className={css.title}>Profile</h1>

      <div className={css.card}>
        <div className={css.avatar}>
          <Image
            src={avatarSrc}
            alt={`${username}'s avatar`}
            width={120}
            height={120}
            priority
          />
        </div>

        <div className={css.info}>
          <div className={css.row}>
            <span className={css.label}>Name:</span>
            <span className={css.value}>{username}</span>
          </div>
          <div className={css.row}>
            <span className={css.label}>Email:</span>
            <span className={css.value}>{email}</span>
          </div>
        </div>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.signOutBtn}
          onClick={clearIsAuthenticated}
          aria-label="Sign out"
        >
          Sign out
        </button>
      </div>
    </section>
  );
}
