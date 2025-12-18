"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isDashboard = pathname.startsWith("/dashboard");
  const isBook = pathname.startsWith("/book");

  return (
    <header className={css.header}>
      <div className="container">
        <div className={css.navigation}>
          <Link href="/" className={css.logo}>
            <svg width={48} height={48} aria-hidden="true">
              <use href="/sprite.svg#icon-logo" />
            </svg>
          </Link>

          <ul className={css.navigationList}>
            <li>
              <Link
                href="/"
                className={`${css.navigationLink} ${isHome ? css.active : ""}`}
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                href="/dashboard"
                className={`${css.navigationLink} ${
                  isDashboard ? css.active : ""
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/book"
                className={`${css.navigationLink} ${isBook ? css.active : ""}`}
              >
                Book
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
