"use client";
import { getMe, updateMe } from "@/lib/api/clientApi";
import css from "./Profile.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/app/api/api";
import { User } from "@/types/user";
import { useAuthStore } from "@/lib/store/authStore";
import Button from "@/components/Button/Button";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const setUserAuthStore = useAuthStore((s) => s.setUser);
  const router = useRouter();

  useEffect(() => {
    getMe().then(setUser);
  }, []);

  const handleSubmit = async (formData: FormData) => {
    try {
      const formValues = {
        username: formData.get("username") as string,
        email: user?.email as string,
      };
      const res = await updateMe(formValues);
      if (res) {
        setUserAuthStore(res);
        router.push("/profile");
      } else {
        setError("Invalid edit profile");
      }
    } catch (e) {
      const err = e as ApiError;
      setError(
        err.response?.data?.error ?? err.message ?? "Oops... some error"
      );
    }
  };

  const handleClose = () => router.back();

  if (!user) return <p className={css.loading}>Loading...</p>;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.headerRow}>
          <h1 className={css.formTitle}>Edit Profile</h1>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={240}
            height={240}
            className={css.avatar}
          />
        </div>

        <form action={handleSubmit} className={css.form}>
          <label htmlFor="username" className={css.label}>
            Username
          </label>
          <input
            name="username"
            id="username"
            type="text"
            defaultValue={user?.username ?? ""}
            className={css.input}
            required
          />

          <label className={css.label}>Email</label>
          <p className={css.valueMuted}>{user.email}</p>

          {error && <p className={css.error}>{error}</p>}

          <div className={css.actions}>
            <Button type="submit" variant="primary">
              Save
            </Button>
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
