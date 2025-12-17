import Link from "next/link";
import Image from "next/image";
import css from "./ProfilePage.module.css";
import btn from "@/components/Button/Button.module.css";
import { getServerMe } from "@/lib/api/serverApi";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Page | NoteHub",
  description: "View and manage your profile information.",
  openGraph: {
    title: "Profile Page | NoteHub",
    description: "View and manage your profile information.",
    url: "https://09-auth-mu-nine.vercel.app/",
    siteName: "MyApp",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Profile page preview",
      },
    ],
  },
};

export default async function Profile() {
  const user = await getServerMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>

          <Link href="/profile/edit" className={`${btn.btn} ${btn.primary}`}>
            Edit Profile
          </Link>
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

        <div className={css.profileInfo}>
          <p className={css.row}>
            <span className={css.label}>Username:</span>
            <span className={css.value}>
              {user.username || user.email.split("@")[0]}
            </span>
          </p>

          <p className={css.row}>
            <span className={css.label}>Email:</span>
            <span className={css.value}>{user.email}</span>
          </p>
        </div>
      </div>
    </main>
  );
}
