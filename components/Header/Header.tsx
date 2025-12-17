"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // ⬅️ додали
import css from "./Header.module.css";
// import TagsMenu from "@/components/TagsMenu/TagsMenu";
import AuthNavigation from "@/components/AuthNavigation/AuthNavigation";
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "lucide-react";
import Button from "@/components/Button/Button";

export default function Header() {
  const pathname = usePathname();
  const isProfile = pathname?.startsWith("/profile");
  const { theme, toggle } = useTheme();

  return (
    <header className={`${css.header} ${isProfile ? css.profile : ""}`}>
      <Link className={css.logo} href="/" aria-label="Home">
        NoteHub
      </Link>

      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/">Home</Link>
          </li>

          {/* <li><TagsMenu /></li> */}

          <AuthNavigation />
          <li>
            <Button variant="icon" onClick={toggle} title="Toggle theme">
              {theme === "dark" ? <Moon size={24} /> : <Sun size={24} />}
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
