"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CATEGORIES } from "@/types/note";
import css from "./SidebarNotes.module.css";

export default function SidebarNotes() {
  const params = useParams<{ slug?: string[] }>();
  const active = params.slug?.[0] ?? "All";

  return (
    <nav aria-label="Note categories" className={css.root}>
      <ul className={css.list}>
        {CATEGORIES.map((category) => {
          const isActive = active === category;
          const href = `/notes/filter/${encodeURIComponent(category)}`;
          return (
            <li key={category}>
              <Link
                href={href}
                className={`${css.link} ${isActive ? css.active : ""}`}
                aria-current={isActive ? "page" : undefined}
                prefetch
              >
                {category}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
