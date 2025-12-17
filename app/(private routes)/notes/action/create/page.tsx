// app/notes/action/create/page.tsx
import { NoteForm } from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NoteHub - Create Note",
  description: "Create and save your new note quickly and easily.",
  openGraph: {
    title: "NoteHub - Create Note",
    description: "Create and save your new note quickly and easily.",
    url: "https://08-zustand-puce-seven.vercel.app/notes/action/create",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Create a new note on NoteHub",
      },
    ],
    type: "article",
  },
};

export default function CreateNote() {
  return (
    <main className={css.page}>
      <section className={css.card}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </section>
    </main>
  );
}
