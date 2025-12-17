import NotesClient from "../[...slug]/Notes.client";
import { fetchNotes } from "@/lib/api/serverApi";
import type { Metadata } from "next";
import type { CategoryNoAll } from "@/types/note";

type Props = { params: Promise<{ slug?: string[] }> };

const toCategoryNoAll = (x: string | undefined): CategoryNoAll | undefined => {
  if (!x || x === "All") return undefined;
  return x as CategoryNoAll;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] ?? "All";
  return {
    title: `${tag} notes`,
    description: `List of your notes filtered by tag ${tag}.`,
    openGraph: {
      title: `${tag} notes`,
      description: `List of your notes filtered by tag ${tag}.`,
      url: `https://your-site/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `${tag} notes`,
        },
      ],
    },
  };
}

export default async function NotesByTagPage({ params }: Props) {
  const { slug } = await params;

  const tagNote = toCategoryNoAll(slug?.[0]);
  const initialData = await fetchNotes("", 1, tagNote);

  return <NotesClient initialData={initialData} initialTag={tagNote} />;
}
