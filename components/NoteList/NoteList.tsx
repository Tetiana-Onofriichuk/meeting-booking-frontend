"use client";

import Link from "next/link";
import css from "./NoteList.module.css";
import type { Note, NoteId } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api/clientApi";
import { useMemo, useState } from "react";
import Button from "@/components/Button/Button";
import { useRouter } from "next/navigation";

interface NoteListProps {
  notes: Note[];
}

const getNoteId = (n: Note): NoteId => {
  if (n.id) return n.id;
  if (n._id) return n._id;
  throw new Error("Note is missing id/_id");
};

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<NoteId | null>(null);
  const router = useRouter();

  const list = useMemo(() => notes ?? [], [notes]);

  const { mutate: deleteMutation } = useMutation({
    mutationFn: (id: NoteId) => deleteNote(id),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setDeletingId(null);
    },
    onError(error) {
      console.error("Error deleting note:", error);
      setDeletingId(null);
    },
  });

  if (!list.length) {
    return <p className={css.empty}>No notes found.</p>;
  }

  return (
    <ul className={css.list}>
      {list.map((note, idx) => {
        const id = getNoteId(note);
        return (
          <li
            className={css.card}
            key={id}
            style={{ animationDelay: `${(idx + 1) * 0.05}s` }}
          >
            <div className={css.header}>
              <Link
                href={`/notes/${id}`}
                className={css.titleLink}
                aria-label={`Open note ${note.title}`}
              >
                <h2 className={css.title}>{note.title}</h2>
              </Link>
              <span className={css.tag}>{note.tag || "No tag"}</span>
            </div>

            <p className={css.content}>{note.content || "—"}</p>

            <div className={css.footer}>
              <div className={css.actions}>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => router.push(`/notes/${id}`)}
                >
                  View
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setDeletingId(id);
                    deleteMutation(id);
                  }}
                  disabled={deletingId === id}
                >
                  {deletingId === id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
