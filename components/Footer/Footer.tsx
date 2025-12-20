"use client";

import Link from "next/link";
import css from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={css.footer}>
      <div className="container">
        <div className={css.inner}>
          <div className={css.brand}>
            <Link href="/" className={css.logo} aria-label="Meeting Book home">
              <svg width={34} height={34} aria-hidden="true">
                <use href="/sprite.svg#icon-logo" />
              </svg>
            </Link>

            <div className={css.brandText}>
              <p className={css.name}>Meeting Book</p>
              <p className={css.tagline}>Plan meetings in minutes</p>
            </div>
          </div>

          <div className={css.meta}>
            <p className={css.copy}>© {year} Meeting Book</p>

            <p className={css.credit}>
              Built by <span className={css.author}>Tetiana Onofriichuk</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
